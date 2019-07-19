"use strict";

const logger = require("../logger");
const { pool } = require("../database");

const util = {
  load_sentiments: async (type = "none") => {
    try {
      let [rows] = await pool.query(
        "SELECT `name` FROM `sentiments` WHERE `type` = ?;",
        [type]
      );

      return rows;
    } catch (e) {
      logger.error("SQL error", e);
    }
  }
};

module.exports = util;
