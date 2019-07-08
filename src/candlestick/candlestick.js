// Load Exchanges
"use strict";
// Load Exchange APIs
const Binance = require("../exchange/Binance");
const logger = require("../logger");
const util = require("../utils");
const DB_LAYER = require("./db_layer");
const _ = require("lodash");

// Get Candlestick

class Candlestick {
  constructor(exchange, symbol, interval) {
    this.exchange = exchange;
    this.symbol = symbol;
    this.interval = interval;
    this.interval_string = util.interval_toString(interval);
    this.Exchange_API = Binance;
    this.table_name = util.candlestick_name(exchange, symbol, interval);
    this.DB_LAYER = new DB_LAYER(this.table_name);
    this.startTime = 0;
    // Check Table and Data integrity
  }

  async init() {
    try {
      await this.DB_LAYER.candlestick_table_check();

      let check_data = await this.get_data();

      if (check_data.length > 0) {
        await this.update_db();
      } else {
        logger.info(
          `Candlestick history build start for: ${this.exchange}-${
            this.symbol
          }-${this.interval_string}`
        );
        await this.init_build_history();
        await this.update_db();
        logger.info(
          `Candlestick history build finished for: ${this.exchange}-${
            this.symbol
          }-${this.interval_string}`
        );
      }
    } catch (e) {
      logger.error("Error", e);
    }
  }

  async get_data() {
    try {
      let candle_data = await this.DB_LAYER.candlestick_select_all();

      let integrity_check = util.candlestick_data_integrity(
        candle_data,
        this.interval
      );

      if (candle_data.length == 0) {
        return [];
      } else if (integrity_check.length > 0) {
        logger.info(
          `Data integrity error in ${this.table_name} ${
            integrity_check.length
          } times`
        );
      }

      return candle_data;
    } catch (e) {
      logger.error("Error", e);
    }
  }

  async init_build_history() {
    try {
      // Check first timestamp and go backward!
      let endTime = await this.DB_LAYER.candlestick_endTime();

      let ticks = await this.Exchange_API.promise_get_candlestick(
        this.symbol,
        this.interval_string,
        {
          endTime
        }
      );

      // Don't build more than 3500 candle history!
      let check_size = await this.DB_LAYER.candlestick_history_size();

      if (check_size > 3000) {
        return;
      }

      // Only store full responses and history time limit!
      if (ticks.length >= 499 && _.last(ticks)[0] >= util.history_limit()) {
        await this.DB_LAYER.candlestick_replace(ticks);
        await this.init_build_history();
      } else {
        return;
      }
    } catch (e) {
      logger.error("Error", e);
    }
  }

  async update_db(limit = 500) {
    try {
      // Get most fresh data

      let endTime = Date.now(); // Current time
      let startTime = await this.DB_LAYER.candlestick_startTime();

      if (startTime) {
        let ticks = await this.Exchange_API.promise_get_candlestick(
          this.symbol,
          this.interval_string,
          {
            limit,
            endTime,
            startTime
          }
        );

        if (ticks.length > 0) {
          await this.DB_LAYER.candlestick_replace(ticks);
        }

        if (ticks.length > 1) {
          await this.update_db();
        } else {
          this.startTime = await this.DB_LAYER.candlestick_startTime();
          return;
        }
      }
    } catch (e) {
      logger.error("", e);
    }
  }
}

module.exports = Candlestick;
