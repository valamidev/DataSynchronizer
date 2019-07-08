"use strict";

const logger = require("../../logger");
const snoowrap = require("snoowrap");

const reddit_api = new snoowrap({
  userAgent: "SentimentBoT",
  clientId: process.env.reddit_clientId,
  clientSecret: process.env.reddit_clientSecret,
  username: process.env.reddit_username,
  password: process.env.reddit_password
});

class RedditAPI {
  constructor() {}

  async get_subreddit_top(subreddit) {
    try {
      let posts = await reddit_api
        .getSubreddit(subreddit)
        .getTop({ time: "day" });

      return posts;
    } catch (e) {
      logger.error("Reddit API ", e);
    }
  }
}

module.exports = new RedditAPI();
