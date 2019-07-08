"use strict";

const sentiment_util = require("../sentiment_util");
const logger = require("../../logger");
const pool = require("../../database");
const RedditAPI = require("./reddit_api");

class SentimentReddit {
  constructor() {
    this.reddit = [];
  }

  async update_reddit_loop() {
    try {
      let db_reddits = await sentiment_util.load_sentiments("reddit");

      this.reddit = db_reddits.map(row => row.name);

      let update_promises = [];
      let time_now = Date.now();

      this.reddit.forEach(reddit => {
        update_promises.push(this.get_subreddit_data(reddit, time_now));
      });

      //logger.info(`Sentiment Reddit Update, ${time_now}`);
      await Promise.all(update_promises);
    } catch (e) {
      logger.error("Sentiment Reddit Update ", e);
    }
  }

  async get_subreddit_data(subreddit, time) {
    let posts = await RedditAPI.get_subreddit_top(subreddit);
    /*
    title, selftext, ups, num_comments,    
    */
    let sum_ups = 0;
    let sum_comments = 0;
    let titles = [];

    posts.forEach(post => {
      titles.push(post.title);

      sum_ups += post.ups;
      sum_comments += post.num_comments;
    });

    await this.save_reddit_result([
      time,
      subreddit,
      sum_ups,
      sum_comments,
      titles.join()
    ]);
  }

  /* DATABASE QUERIES */

  async save_reddit_result(data) {
    try {
      await pool.query(
        "INSERT INTO `sentiment_reddit` (`time`, `subreddit`, `sum_ups`, `sum_comments`, `titles`) VALUES ?;",
        [[data]]
      );
    } catch (e) {
      logger.error("SQL error", e);
    }
  }
}

module.exports = new SentimentReddit();
