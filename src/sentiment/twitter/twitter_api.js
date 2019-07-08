"use strict";

//const node_twitter = require("twitter-node-client").Twitter;
const logger = require("../../logger");

const twitter_api = require("twitter");

const config = {
  consumer_key: process.env.consumerKey,
  consumer_secret: process.env.consumerSecret,
  access_token_key: process.env.accessToken,
  access_token_secret: process.env.accessTokenSecret
};

const twitter = new twitter_api(config);

class TwitterAPI {
  constructor() {}

  promise_getSearch(parameters) {
    // parameters (q, count, result_type, since, exclude)

    return new Promise((resolve, reject) => {
      twitter.get("search/tweets", parameters, (error, tweets, response) => {
        if (error) reject(error);
        if (tweets) resolve(tweets);
      });
    });
  }

  async getSearch(search, id = 0) {
    try {
      let result = [];
      let searct_result = await this.promise_getSearch({
        q: search,
        count: 100,
        since_id: id,
        exclude: "replies",
        exclude: "retweets"
      });

      let tweets = searct_result.statuses;

      let time = Date.now();
      // Filter important fields for us
      tweets.forEach(tweet => {
        result.push([
          time,
          tweet.created_at,
          search,
          tweet.text,
          tweet.id,
          tweet.user.name,
          tweet.user.followers_count,
          tweet.user.listed_count
        ]);
      });

      return result;
    } catch (e) {
      logger.error("Twitter API ", e);
    }
  }
}

const Twitter = new TwitterAPI();

module.exports = Twitter;
