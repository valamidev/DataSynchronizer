// Load Exchanges
"use strict";
// Load Exchange APIs
const CCXT_API = require("../exchange/");
const logger = require("../logger");
const util = require("../utils");
const DB_LAYER = require("./db_layer");
const _ = require("lodash");

const { history_limit, ccxt_candlelimit } = process.env;

// Get Candlestick

class Candlestick {
  constructor(exchange, symbol, interval) {
    this.exchange = exchange;
    this.symbol = symbol;
    this.interval = interval;
    this.interval_string = util.interval_toString(interval);
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
      // Check first timestamp and go forward!
      let startTime = await this.DB_LAYER.candlestick_startTime();

      // Clean DB
      if (startTime == 0) {
        // Get genesis history time in ms
        startTime = Date.now() - history_limit * this.interval * 1000;
      }

      let ticks = await this.get_ticks(startTime);

      // Check history limit
      let check_size = await this.DB_LAYER.candlestick_history_size();

      if (check_size > history_limit) {
        return;
      }

      // Only store full responses and history time limit!
      if (ticks.length == ccxt_candlelimit) {
        await this.DB_LAYER.candlestick_replace(ticks);
        await this.init_build_history();
      } else {
        return;
      }
    } catch (e) {
      logger.error("Error", e);
    }
  }

  async update_db() {
    try {
      // Get most fresh data
      let startTime = await this.DB_LAYER.candlestick_startTime();

      if (startTime != 0) {
        let ticks = await this.get_ticks(startTime);

        if (Array.isArray(ticks)) {
          await this.DB_LAYER.candlestick_replace(ticks);
        }

        if (ticks.length == ccxt_candlelimit) {
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

  async get_ticks(startTime) {
    try {
      let ticks = await CCXT_API.get_candlestick(
        this.symbol,
        this.exchange,
        this.interval_string,
        startTime,
        ccxt_candlelimit
      );

      // https://github.com/ccxt/ccxt/issues/2937
      // Last Candle can be unfinished
      if (Array.isArray(ticks)) {
        if (_.last(ticks)[0] + this.interval * 1000 > _.now()) {
          ticks.pop();
        }
        return ticks;
      } else {
        return [];
      }
    } catch (e) {
      logger.error("", e);
    }
  }
}

module.exports = Candlestick;
