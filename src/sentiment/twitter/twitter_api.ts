/* eslint-disable @typescript-eslint/camelcase */

import { logger } from '../../logger';

import Twitter from 'twitter';

const config: Twitter.AccessTokenOptions = {
  consumer_key: process?.env?.consumerKey ?? '',
  consumer_secret: process?.env?.consumerSecret ?? '',
  access_token_key: process?.env?.accessToken ?? '',
  access_token_secret: process?.env?.accessTokenSecret ?? '',
};

const twitter = new Twitter(config);

class TwitterAPIClass {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  promiseGetSearch(parameters: Twitter.RequestParams): Promise<any> {
    // parameters (q, count, result_type, since, exclude)

    return new Promise((resolve, reject) => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      twitter.get('search/tweets', parameters, (error, tweets, _response) => {
        if (error) reject(error);
        if (tweets) resolve(tweets);
      });
    });
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async getSearch(search: string, id = 0): Promise<any> {
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const result: any[] = [];
      const searctResult = await this.promiseGetSearch({
        q: search,
        count: 100,
        since_id: id,
      });

      const tweets = searctResult.statuses;

      const time = Date.now();
      // Filter important fields for us
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      tweets.forEach((tweet: any) => {
        result.push([time, tweet.created_at, search, tweet.text, tweet.id, tweet.user.name, tweet.user.followers_count, tweet.user.listed_count]);
      });

      return result;
    } catch (e) {
      logger.error('Twitter API ', e);
    }
  }
}

export const TwitterAPI = new TwitterAPIClass();
