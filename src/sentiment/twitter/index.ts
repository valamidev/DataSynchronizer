import { sentimentUtil } from '../sentiment_util';
import { logger } from '../../logger';
import { BaseDB } from '../../database';
import { TwitterAPI } from './twitter_api';

class SentimentTwitter {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  twitter: string[];
  constructor() {
    this.twitter = [];
  }

  async updateTwitterLoop(): Promise<void> {
    try {
      const DBtwitters = await sentimentUtil.loadSentiments('twitter');

      if (DBtwitters) {
        this.twitter = DBtwitters.map((row) => row.name);

        const updatePromises: Array<Promise<void>> = [];

        this.twitter.forEach((twitter) => {
          updatePromises.push(this.updateTwitter(twitter));
        });

        // logger.info(`Sentiment Twitter Update, ${time_now}`);
        await Promise.all(updatePromises);
      }
    } catch (e) {
      logger.error('Update twitter_loop error', e);
    }
  }

  async updateTwitter(asset: string): Promise<void> {
    try {
      const search = `$${asset}`;
      let lastTweetId = 0;

      // Get last ID to not query same result multiple time
      const getLastTweet = await this.getLastTweet(search);

      if (getLastTweet) {
        lastTweetId = getLastTweet.id;
      }
      // Perform search on Twitter
      const res = await TwitterAPI.getSearch(search, lastTweetId);
      // Save result
      if (res && res.length > 0) {
        await this.saveTwitterResult(res);
      }
    } catch (e) {
      logger.error('Update twitter error', e);
    }
  }

  /* DATABASE QUERIES */

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async saveTwitterResult(data: any): Promise<void> {
    try {
      await BaseDB.query(
        'REPLACE INTO `sentiment_twitter` (`time`, `created_at`, `asset`, `text`, `id`, `user`, `followers`, `listed`) VALUES ?;',
        [data],
      );
    } catch (e) {
      logger.error('SQL error', e);
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async getLastTweet(asset: string): Promise<any | undefined> {
    try {
      const [
        rows,
      ] = await BaseDB.query('SELECT id FROM `sentiment_twitter` WHERE asset = ?  ORDER BY `id` DESC limit 1;', [
        asset,
      ]);

      return rows[0];
    } catch (e) {
      logger.error('SQL error', e);
    }
  }

  /* DATABASE QUERIES */
}

export default new SentimentTwitter();
