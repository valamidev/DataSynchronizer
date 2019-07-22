"use strict";

const _ = require("lodash");
const logger = require("../logger");
const { pool } = require("../database");
const Candlestick = require("../candlestick/candlestick");

class Tradepairs {
  constructor() {
    this.tradepairs = [];
  }

  async start() {
    try {
      await this.update_tradepairs();

      await this.candlestick_update_loop();
    } catch (e) {
      logger.error("Tradepair start ", e);
    }
  }

  async candlestick_update_loop() {
    try {
      let update_promises = [];
      // Safety API delay against limiting
      let time_now = Date.now() - process.env.api_delay;

      for (let i = 0; i < this.tradepairs.length; i++) {
        let trade_pair = this.tradepairs[i];

        let expected_update =
          trade_pair.Candlestick.startTime + trade_pair.interval_sec * 1000 * 2;

        if (time_now > expected_update) {
          update_promises.push(trade_pair.Candlestick.update_db());
        }
      }
      // Error should be critical!
      if (update_promises.length > 0) {
        logger.verbose(`Candlestick Update loop, ${time_now}`);
        await Promise.all(update_promises);

        // Update tradepairs
        await this.update_tradepairs();
      }
    } catch (e) {
      logger.error("Candlestick Update ", e);
    } finally {
      setTimeout(() => {
        this.candlestick_update_loop();
      }, 10000);
    }
  }

  async load_candlestick() {
    try {
      let promises = [];

      for (let i = 0; i < this.tradepairs.length; i++) {
        let { exchange, symbol, interval_sec } = this.tradepairs[i];

        this.tradepairs[i].Candlestick = new Candlestick(
          exchange,
          symbol,
          interval_sec
        );

        promises.push(this.tradepairs[i].Candlestick.init());
      }
      // Parallel startup rate limit can cause problem on first start!
      await Promise.all(promises);
    } catch (e) {
      logger.error("Load candlestick", e);
    }
  }

  async update_tradepairs() {
    // Looking after new tradepairs!
    try {
      let tradepairs = await this.select_tradepairs_all();

      let new_symbols = tradepairs.map(elem => elem.symbol);
      let old_symbols = this.tradepairs.map(elem => elem.symbol);

      if (_.isEqual(new_symbols, old_symbols) == false) {
        this.tradepairs = tradepairs;
        logger.info(`Load candlestick ${tradepairs.length}`);
        await this.load_candlestick();
      }

      if (tradepairs.length == 0) {
        // Avoid stuck if tradepairs table is empty at start
        logger.info(`Load candlestick table empty!`);

        setTimeout(() => {
          this.update_tradepairs();
        }, 30000);
      }

      return;
    } catch (e) {
      logger.error("Update_tradepairs", e);
    }
  }

  /* Database queries */

  async select_tradepairs_all() {
    try {
      // Warden timeout limit 10 minutes
      let time = Date.now() - 600 * 1000;

      let [rows] = await pool.query(
        "SELECT * FROM `tradepairs` WHERE is_warden = 0 OR (is_warden = 1 AND time > ?) ORDER BY `asset` ASC;",
        [time]
      );

      return rows;
    } catch (e) {
      logger.error("SQL error", e);
    }
  }

  async add_tradepair(
    exchange,
    symbol,
    interval,
    asset,
    quote,
    is_warden = 0,
    time = 0
  ) {
    try {
      // Check existing before insert!

      await pool.query(
        "INSERT INTO `tradepairs` (`exchange`, `symbol`, `interval_sec`, `asset`,`quote`,`is_warden`,`time`) VALUES (?,?,?,?,?,?,?) ON DUPLICATE KEY UPDATE time=VALUES(time);",
        [exchange, symbol, interval, asset, quote, is_warden, time]
      );

      return;
    } catch (e) {
      logger.error("SQL error", e);
    }
  }

  async select_tradepair_single(exchange, symbol, interval) {
    try {
      let row = await pool.query(
        "SELECT * FROM `tradepairs` where `exchange` = ? and `symbol` = ? and `interval_sec` = ? LIMIT 1;",
        [exchange, symbol, interval]
      );

      return row[0][0];
    } catch (e) {
      logger.error("SQL error", e);
    }
  }
}

module.exports = Tradepairs;
