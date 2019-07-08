"use strict";

const logger = require("../../logger");
const DB = new (require("./queries"))();

class DB_LAYER {
  constructor(table_name) {
    this.table_name = table_name;
  }

  async candlestick_table_check() {
    try {
      let rows = await DB.query_candlestick_table_exist(this.table_name);

      if (rows.length != 1) {
        await DB.query_candlestick_create_table(this.table_name);
      }
    } catch (e) {
      logger.error("Error", e);
    }
  }

  async candlestick_endTime() {
    try {
      let rows = await DB.query_candlestick_select_time_asc(this.table_name);

      if (rows[0]) {
        return rows[0].time;
      }

      return null;
    } catch (e) {
      logger.error("Error", e);
    }
  }

  async candlestick_startTime() {
    try {
      let rows = await DB.query_candlestick_select_time_desc(this.table_name);

      if (rows[0]) {
        return rows[0].time;
      }

      return false;
      // Throw error no entry in the Database
    } catch (e) {
      logger.error("Error", e);
    }
  }

  async candlestick_replace(ticks) {
    try {
      await DB.query_candlestick_replace(this.table_name, ticks);

      return;
    } catch (e) {
      logger.error("Error", e);
    }
  }

  async candlestick_select_all() {
    try {
      let data = await DB.query_candlestick_select_all(this.table_name);

      return data;
    } catch (e) {
      logger.error("Error", e);
    }
  }

  async candlestick_history_size() {
    try {
      let data = await DB.query_candlestick_history_size(this.table_name);

      return data;
    } catch (e) {
      logger.error("Error", e);
    }
  }
}

module.exports = DB_LAYER;
