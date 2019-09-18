'use strict';

const logger = require('../logger');
const { BaseDB } = require('../database');

const util = {
  load_sentiments: async (type = 'none') => {
    try {
      let [rows] = await BaseDB.query('SELECT `name` FROM `sentiments` WHERE `type` = ?;', [type]);

      return rows;
    } catch (e) {
      logger.error('SQL error', e);
    }
  },
};

module.exports = util;
