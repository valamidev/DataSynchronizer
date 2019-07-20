"use strict";
const logger = require("./logger");
const TradePairsAPI = new (require("./tradepairs/tradepairs"))();
const SentimentAPI = require("./sentiment/sentiment");
const LivefeedAPI = require("./livefeed/livefeed");
const MarketDataAPI = require("./marketdata");
const PriceTickersAPI = require("./pricetickers");
const WardenClass = require("./warden");

const {
  Tradepairs,
  MarketData,
  Sentiment,
  Livefeed,
  PriceTicker,
  Warden,
  exchange_list,
  warden_exchanges_list,
  quotes,
  quote_limits
} = process.env;

const exchanges = exchange_list.split(",");
const warden_exchanges = warden_exchanges_list.split(",");
const warden_quotes = quotes.split(",");
const warden_quote_limits = quote_limits.split(",");

async function main() {
  try {
    logger.info("StockML Synchronizer started");

    // CandleStick OHLV fetcher
    if (Tradepairs == 1) await TradePairsAPI.start();
    // Available Symbols and Precision informations from exchanges
    if (MarketData == 1) await MarketDataAPI.start(exchanges);
    // Current prices and other Symbol datas like daily change, daily volume
    if (PriceTicker == 1) await PriceTickersAPI.start(exchanges);
    // Twitter/Reddit API
    if (Sentiment == 1) await SentimentAPI.start();
    // Websocket support only for Binance /* TODO: use CCWS */
    if (Livefeed == 1) await LivefeedAPI.start();
    // Warden Auto init tradepairs for data collection based on Volume desc
    if (Warden == 1)
      await WardenClass.start(
        warden_exchanges,
        warden_quotes,
        warden_quote_limits
      );

    logger.info("Startup finished");
  } catch (e) {
    logger.error("Main error", e);
  }
}

main();
