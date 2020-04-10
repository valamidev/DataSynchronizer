import { sentimentUtil } from '../sentiment_util';
import { logger } from '../../logger';
import { BaseDB } from '../../database';
import { RedditAPI } from './reddit_api';
import { Sentiments } from '../sentiment';

class SentimentReddit {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  reddit: any[];

  constructor() {
    this.reddit = [];
  }

  async updateRedditLoop(): Promise<void> {
    try {
      const DBReddits = await sentimentUtil.loadSentiments(Sentiments.reddit);

      if (DBReddits) {
        this.reddit = DBReddits.map((row) => row.name);
      }

      const updatePromises: Array<Promise<void>> = [];

      this.reddit.forEach((reddit) => {
        updatePromises.push(this.getSubredditData(reddit, Date.now()));
      });

      await Promise.all(updatePromises);
    } catch (e) {
      logger.error('Sentiment Reddit Update ', e);
    }
  }

  async getSubredditData(subreddit: string, time: number): Promise<void> {
    const posts = await RedditAPI.getSubredditTop(subreddit);

    if (posts?.forEach) {
      /*
         title, selftext, ups, num_comments,    
         */
      let sumUPs = 0;
      let sumComments = 0;
      const titles: string[] = [];

      posts.forEach((post) => {
        titles.push(post.title);

        sumUPs += post.ups;
        sumComments += post.num_comments;
      });

      await this.saveRedditResult([time, subreddit, sumUPs, sumComments, titles.join()]);
    }
  }

  /* DATABASE QUERIES */

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async saveRedditResult(data: any): Promise<void> {
    try {
      await BaseDB.query(
        'INSERT INTO `sentiment_reddit` (`time`, `subreddit`, `sum_ups`, `sum_comments`, `titles`) VALUES ?;',
        [[data]],
      );
    } catch (e) {
      logger.error('SQL error', e);
    }
  }
}

export default new SentimentReddit();
