"use strict";

const logger = require("../../logger");
// Promise / Async Await compatiable MySQL lib
const pool = require("../../database");

class DB_API {
  async query_candlestick_replace(table_name, array) {
    try {
      await pool.query(
        "REPLACE INTO `" +
          table_name +
          "` (`time`, `open`, `high`, `low`, `close`, `volume`, `closeTime`, `assetVolume`, `trades`, `buyBaseVolume`, `buyAssetVolume`, `ignored`) VALUES ?;",
        [array]
      );
    } catch (e) {
      logger.error("SQL error", e);
    }
  }

  async query_candlestick_create_table(table_name) {
    try {
      // CREATE TABLE New_Users  LIKE Old_Users;
      let [rows] = await pool.query(
        "CREATE TABLE `" + table_name + "` LIKE `def_def_def`;"
      );
      return rows;
    } catch (e) {
      logger.error("SQL error", e);
    }
  }

  async query_candlestick_table_exist(table_name) {
    try {
      let [rows] = await pool.query(
        "SELECT * FROM information_schema.TABLES WHERE table_schema = ? AND table_name = ? LIMIT 1;",
        [process.env.MYSQL_DB, table_name]
      );

      return rows;
    } catch (e) {
      logger.error("SQL error", e);
    }
  }

  async query_candlestick_select_all_asc(table_name) {
    try {
      let [rows] = await pool.query(
        "SELECT * FROM `" + table_name + "` ORDER BY `time` ASC;"
      );

      return rows;
    } catch (e) {
      logger.error("SQL error", e);
    }
  }

  async query_candlestick_select_time_asc(table_name) {
    try {
      let [rows] = await pool.query(
        "SELECT time FROM `" + table_name + "` ORDER BY `time` ASC limit 1;"
      );

      return rows;
    } catch (e) {
      logger.error("SQL error", e);
    }
  }

  async query_candlestick_select_time_desc(table_name) {
    try {
      let [rows] = await pool.query(
        "SELECT time FROM `" + table_name + "` ORDER BY `time` DESC limit 1;"
      );

      return rows;
    } catch (e) {
      logger.error("SQL error", e);
    }
  }

  async query_candlestick_select_all(table_name) {
    try {
      let [rows] = await pool.query(
        "SELECT * FROM `" + table_name + "` ORDER BY `time` ASC;"
      );

      return rows;
    } catch (e) {
      logger.error("SQL error", e);
    }
  }

  // Tradepair Queries
  async query_tradepairs_select_all(table_name) {
    try {
      let [rows] = await pool.query(
        "SELECT * FROM `" + table_name + "` ORDER BY `time` ASC;"
      );

      return rows;
    } catch (e) {
      logger.error("SQL error", e);
    }
  }

  async query_candlestick_history_size(table_name) {
    try {
      let [rows] = await pool.query(
        "SELECT count(*) as count FROM `" + table_name + "`;"
      );

      if (rows.length > 0) {
        return rows[0].count;
      } else {
        return 0;
      }
    } catch (e) {
      logger.error("SQL error", e);
    }
  }
}

module.exports = DB_API;
