'use strict';

const sentiment_util = require('../sentiment_util');
const { logger } = require('../../logger');
const { BaseDB } = require('../../database');
const twitter = require('./twitter_api');

class SentimentTwitter {
  constructor() {
    this.twitter = [];
  }

  async update_twitter_loop() {
    try {
      let db_twitters = await sentiment_util.load_sentiments('twitter');

      this.twitter = db_twitters.map(row => row.name);

      let update_promises = [];

      this.twitter.forEach(twitter => {
        update_promises.push(this.update_twitter(twitter));
      });

      //logger.info(`Sentiment Twitter Update, ${time_now}`);
      await Promise.all(update_promises);
    } catch (e) {
      logger.error('Update twitter_loop error', e);
    }
  }

  async update_twitter(asset) {
    try {
      let search = `$${asset}`;
      let last_id = 0;

      // Get last ID to not query same result multiple time
      let get_last_id = await this.get_last_tweet(search);

      if (get_last_id) {
        last_id = get_last_id.id;
      }
      // Perform search on Twitter
      let res = await twitter.getSearch(search, last_id);
      // Save result
      if (res && res.length > 0) await this.save_twitter_result(res);
    } catch (e) {
      logger.error('Update twitter error', e);
    }
  }

  /* DATABASE QUERIES */

  async save_twitter_result(data) {
    try {
      await BaseDB.query('REPLACE INTO `sentiment_twitter` (`time`, `created_at`, `asset`, `text`, `id`, `user`, `followers`, `listed`) VALUES ?;', [data]);
    } catch (e) {
      logger.error('SQL error', e);
    }
  }

  async get_last_tweet(asset) {
    try {
      let [rows] = await BaseDB.query('SELECT id FROM `sentiment_twitter` WHERE asset = ?  ORDER BY `id` DESC limit 1;', [asset]);

      return rows[0];
    } catch (e) {
      logger.error('SQL error', e);
    }
  }

  /* DATABASE QUERIES */
}

module.exports = new SentimentTwitter();
