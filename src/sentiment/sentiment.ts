import { logger } from '../logger';

import Reddit from './reddit';
import Twitter from './twitter';

export enum Sentiments {
  reddit = 'reddit',
  twitter = 'twitter',
}

class SentimentAPI {
  async start(): Promise<void> {
    try {
      await Reddit.updateRedditLoop();
      await Twitter.updateTwitterLoop();

      if (process?.env?.reddit_update_timeout) {
        setInterval(async () => {
          Reddit.updateRedditLoop();
        }, parseInt(process.env.reddit_update_timeout) * 1000);
      }

      if (process?.env?.twitter_update_timeout) {
        setInterval(async () => {
          Twitter.updateTwitterLoop();
        }, parseInt(process.env.twitter_update_timeout) * 1000);
      }

      logger.info('Sentiment API stated');
      return;
    } catch (err) {
      logger.error('Sentiment start ', err);
    }
  }
}

export default new SentimentAPI();
