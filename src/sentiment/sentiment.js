'use strict';

const { logger } = require('../logger');

const reddit = require('./reddit/');
const twitter = require('./twitter');

class SentimentAPI {
  constructor() {}

  async start() {
    try {
      await reddit.update_reddit_loop();
      await twitter.update_twitter_loop();

      setInterval(async () => {
        reddit.update_reddit_loop();
      }, process.env.reddit_update_timeout * 1000);

      setInterval(async () => {
        twitter.update_twitter_loop();
      }, process.env.twitter_update_timeout * 1000);

      logger.info('Sentiment API stated');
      return;
    } catch (e) {
      logger.error('Sentiment start ', e);
    }
  }
}

module.exports = new SentimentAPI();
