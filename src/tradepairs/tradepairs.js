"use strict"

const logger = require("../logger")
const { pool } = require("../database")

const queries = {
  /* Database queries */

  async select_tradepairs_all() {
    try {
      // Warden timeout limit 10 minutes
      let time = Date.now() - 600 * 1000

      let [rows] = await pool.query(
        "SELECT m.exchange,m.id,m.symbol,m.baseId,m.quoteId,t.interval_sec FROM `tradepairs` as t JOIN `market_datas` as m ON t.symbol = m.symbol AND t.exchange = m.exchange  WHERE t.is_warden = 0 OR (t.is_warden = 1 AND t.time > ?) ORDER BY t.`asset` ASC;",
        [time]
      )

      return rows
    } catch (e) {
      logger.error("SQL error", e)
    }
  },

  add_tradepair: async (exchange, symbol, interval, asset, quote, is_warden = 0, time = 0) => {
    try {
      // Check existing before insert!

      await pool.query(
        "INSERT INTO `tradepairs` (`exchange`, `symbol`, `interval_sec`, `asset`,`quote`,`is_warden`,`time`) VALUES (?,?,?,?,?,?,?) ON DUPLICATE KEY UPDATE time=VALUES(time);",
        [exchange, symbol, interval, asset, quote, is_warden, time]
      )

      return
    } catch (e) {
      logger.error("SQL error", e)
    }
  },

  select_tradepair_single: async (exchange, symbol, interval) => {
    try {
      let row = await pool.query("SELECT * FROM `tradepairs` where `exchange` = ? and `symbol` = ? and `interval_sec` = ? LIMIT 1;", [exchange, symbol, interval])

      return row[0][0]
    } catch (e) {
      logger.error("SQL error", e)
    }
  }
}

module.exports = queries
