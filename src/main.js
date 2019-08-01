"use strict"

const logger = require("./logger")
require("./emitter") // Eventemitter class
require("./redis")
const SentimentAPI = require("./sentiment/sentiment")
const LivefeedAPI = require("./livefeed/livefeed")
const MarketDataAPI = require("./marketdata")
const PriceTickersAPI = require("./pricetickers")
const WardenClass = require("./warden")

// Load Dotenv variables
const { MarketData, Sentiment, Livefeed, PriceTicker, Warden, exchange_list, warden_exchanges_list, quotes, quote_limits } = process.env

const exchanges = exchange_list.split(",")
const warden_exchanges = warden_exchanges_list.split(",")
const warden_quotes = quotes.split(",")
const warden_quote_limits = quote_limits.split(",")
// Load Dotenv variables

async function main() {
  try {
    logger.info("StockML Synchronizer started")

    // Available Symbols and Precision informations from exchanges
    if (MarketData == 1) await MarketDataAPI.start(exchanges)
    // Current prices and other Symbol datas like daily change, daily volume
    if (PriceTicker == 1) await PriceTickersAPI.start(exchanges)
    // Twitter/Reddit API
    if (Sentiment == 1) await SentimentAPI.start()
    // Websocket support check exchanges/ws_exchanges for support!
    if (Livefeed == 1) {
      await LivefeedAPI.start(exchanges)
    }
    // Warden Auto init tradepairs for data collection based on Volume desc
    if (Warden == 1) await WardenClass.start(warden_exchanges, warden_quotes, warden_quote_limits)

    logger.info("Startup finished")
  } catch (e) {
    logger.error("Main error", e)
  }
}

main()
