"use strict";
const logger = require("./logger");
const TradePairsAPI = new (require("./tradepairs/tradepairs"))();
const SentimentAPI = require("./sentiment/sentiment");
const LivefeedAPI = require("./livefeed/livefeed");
const AccountAPI = require("./account/account");

async function main() {
  try {
    logger.info("StockML Crawler started");

    if (process.env.Tradepairs == 1) await TradePairsAPI.start();

    if (process.env.Sentiment == 1) await SentimentAPI.start();

    if (process.env.Livefeed == 1) await LivefeedAPI.start();

    if (process.env.Accountdatas == 1) await AccountAPI.start();

    logger.info("Startup finished");
  } catch (e) {
    logger.error("Main error", e);
  }
}

main();
