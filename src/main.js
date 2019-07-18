"use strict";
const logger = require("./logger");
const TradePairsAPI = new (require("./tradepairs/tradepairs"))();
const SentimentAPI = require("./sentiment/sentiment");
const LivefeedAPI = require("./livefeed/livefeed");
const MarketDataAPI = require("./marketdata");

const {
  Tradepairs,
  MarketData,
  Sentiment,
  Livefeed,
  exchange_list
} = process.env;

async function main() {
  try {
    logger.info("StockML Synchronizer started");

    if (Tradepairs == 1) await TradePairsAPI.start();

    if (MarketData == 1) await MarketDataAPI.start(exchange_list.split(","));

    if (Sentiment == 1) await SentimentAPI.start();

    if (Livefeed == 1) await LivefeedAPI.start();

    logger.info("Startup finished");
  } catch (e) {
    logger.error("Main error", e);
  }
}

main();
