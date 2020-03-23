'use strict';

import { logger } from '../logger';

import reddit from './reddit/';
import twitter from './twitter';

export enum Sentiments {
  reddit = 'reddit',
  twitter = 'twitter',
}

class SentimentAPI {
  async start(): Promise<void> {
    try {
      await reddit.updateRedditLoop();
      await twitter.updateTwitterLoop();

      if (process?.env?.reddit_update_timeout) {
        setInterval(async () => {
          reddit.updateRedditLoop();
        }, parseInt(process.env.reddit_update_timeout) * 1000);
      }

      if (process?.env?.twitter_update_timeout) {
        setInterval(async () => {
          twitter.updateTwitterLoop();
        }, parseInt(process.env.twitter_update_timeout) * 1000);
      }

      logger.info('Sentiment API stated');
      return;
    } catch (e) {
      logger.error('Sentiment start ', e);
    }
  }
}

export default new SentimentAPI();
