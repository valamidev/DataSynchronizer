"use strict";

const logger = require("../logger");
const pool = require("../database");
const Binance = require("../exchange/Binance");

class AccountAPI {
  constructor() {
    this.loopdelay = 30000;
  }

  async start() {
    try {
      await this.update_balance_loop();
      await this.update_order_loop();

      setInterval(async () => {
        this.update_balance_loop();
        this.update_order_loop();
      }, this.loopdelay);

      logger.info("Account API started");
    } catch (e) {
      logger.error("AccountAPI start ", e);
    }
  }

  async update_order_loop() {
    try {
      let orders = await Binance.promise_get_open_orders();

      let time = Date.now();

      /* TODO SOMETHING BETTER FOR CLEANUP! */
      let queries = "DELETE FROM `account_orders`;";

      for (let i = 0; i < orders.length; i++) {
        queries += "REPLACE INTO `account_orders` SET  ?;";
      }

      await pool.query(queries, orders);
    } catch (e) {
      logger.error("Orders loop", e);
    }
  }

  async update_balance_loop() {
    try {
      let balances = await Binance.promise_get_balance();

      let time = Date.now();
      // Create Array for MySQL query
      balances = Object.keys(balances).map(key => {
        return [key, balances[key].available, balances[key].onOrder, time];
      });

      await pool.query(
        "REPLACE INTO `account_balance` (`symbol`, `available`, `onOrder`, `time`) VALUES ?;",
        [balances]
      );
    } catch (e) {
      logger.error("Balance loop", e);
    }
  }
}

module.exports = new AccountAPI();
