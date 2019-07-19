"use strict";

const logger = require("../../logger");
const { candle_db } = require("../../database");

const { MYSQL_DB_EXCHANGE } = process.env;

class DB_LAYER {
  constructor(table_name) {
    this.table_name = table_name;
  }

  async candlestick_table_check() {
    try {
      let [rows] = await candle_db.query(
        "SELECT * FROM information_schema.TABLES WHERE table_schema = ? AND table_name = ? LIMIT 1;",
        [MYSQL_DB_EXCHANGE, this.table_name]
      );

      if (rows.length != 1) {
        let [rows] = await candle_db.query(
          "CREATE TABLE `" + this.table_name + "` LIKE `def_def_def`;"
        );
        return rows;
      }
    } catch (e) {
      logger.error("Error", e);
    }
  }

  async candlestick_endTime() {
    try {
      let [rows] = await candle_db.query(
        "SELECT time FROM `" +
          this.table_name +
          "` ORDER BY `time` ASC limit 1;"
      );

      if (rows[0]) {
        return rows[0].time;
      }

      return 0;
    } catch (e) {
      logger.error("Error", e);
    }
  }

  async candlestick_startTime() {
    try {
      let [rows] = await candle_db.query(
        "SELECT time FROM `" +
          this.table_name +
          "` ORDER BY `time` DESC limit 1;"
      );

      if (rows[0]) {
        return rows[0].time;
      }

      return 0;
      // Throw error no entry in the Database
    } catch (e) {
      logger.error("Error", e);
    }
  }

  async candlestick_replace(ticks) {
    try {
      if (ticks.length > 0) {
        await candle_db.query(
          "REPLACE INTO `" +
            this.table_name +
            "` (`time`, `open`, `high`, `low`, `close`, `volume`) VALUES ?;",
          [ticks]
        );
      }
      return;
    } catch (e) {
      logger.error("Error", e);
    }
  }

  async candlestick_select_all() {
    try {
      let [rows] = await candle_db.query(
        "SELECT * FROM `" + this.table_name + "` ORDER BY `time` ASC;"
      );

      return rows;
    } catch (e) {
      logger.error("Error", e);
    }
  }

  async candlestick_history_size() {
    try {
      let [rows] = await candle_db.query(
        "SELECT count(*) as count FROM `" + this.table_name + "`;"
      );

      if (rows.length > 0) {
        return rows[0].count;
      } else {
        return 0;
      }
    } catch (e) {
      logger.error("Error", e);
    }
  }
}

module.exports = DB_LAYER;
