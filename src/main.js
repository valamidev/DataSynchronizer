"use strict";
const logger = require("./logger");
const TradePairsAPI = new (require("./tradepairs/tradepairs"))();
const SentimentAPI = require("./sentiment/sentiment");
const LivefeedAPI = require("./livefeed/livefeed");
const MarketDataAPI = require("./marketdata");
const PriceTickersAPI = require("./pricetickers");

const {
  Tradepairs,
  MarketData,
  Sentiment,
  Livefeed,
  PriceTicker,
  exchange_list
} = process.env;

async function main() {
  try {
    logger.info("StockML Synchronizer started");

    // CandleStick OHLV fetcher
    if (Tradepairs == 1) await TradePairsAPI.start();
    // Available Symbols and Precision informations from exchanges
    if (MarketData == 1) await MarketDataAPI.start(exchange_list.split(","));
    // Current prices and other Symbol datas like daily change, daily volume
    if (PriceTicker == 1) await PriceTickersAPI.start(exchange_list.split(","));
    // Twitter/Reddit API
    if (Sentiment == 1) await SentimentAPI.start();
    // Websocket support only for Binance /* TODO: use CCWS */
    if (Livefeed == 1) await LivefeedAPI.start();

    logger.info("Startup finished");
  } catch (e) {
    logger.error("Main error", e);
  }
}

main();
