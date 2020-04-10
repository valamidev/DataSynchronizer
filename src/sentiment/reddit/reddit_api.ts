import Snoowrap from 'snoowrap';
import { logger } from '../../logger';

const redditAPI = new Snoowrap({
  userAgent: 'SentimentBoT',
  clientId: process.env.reddit_clientId,
  clientSecret: process.env.reddit_clientSecret,
  username: process.env.reddit_username,
  password: process.env.reddit_password,
});

class RedditAPIClass {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async getSubredditTop(subreddit: string): Promise<any[] | undefined> {
    try {
      redditAPI.config({ requestDelay: 1000, warnings: false });

      const posts = await redditAPI.getSubreddit(subreddit).getTop({ time: 'day' });

      return posts;
    } catch (e) {
      logger.error('Reddit API ', e);
    }
  }
}

export const RedditAPI = new RedditAPIClass();
