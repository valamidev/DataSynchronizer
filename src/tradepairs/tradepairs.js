"use strict"

const logger = require("../logger")
const { pool } = require("../database")

class Tradepairs {
  constructor() {
    this.tradepairs = []
  }

  /* Database queries */

  async select_tradepairs_all() {
    try {
      // Warden timeout limit 10 minutes
      let time = Date.now() - 600 * 1000

      let [rows] = await pool.query("SELECT * FROM `tradepairs` WHERE is_warden = 0 OR (is_warden = 1 AND time > ?) ORDER BY `asset` ASC;", [time])

      return rows
    } catch (e) {
      logger.error("SQL error", e)
    }
  }

  async add_tradepair(exchange, symbol, interval, asset, quote, is_warden = 0, time = 0) {
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
  }

  async select_tradepair_single(exchange, symbol, interval) {
    try {
      let row = await pool.query("SELECT * FROM `tradepairs` where `exchange` = ? and `symbol` = ? and `interval_sec` = ? LIMIT 1;", [exchange, symbol, interval])

      return row[0][0]
    } catch (e) {
      logger.error("SQL error", e)
    }
  }
}

module.exports = Tradepairs
