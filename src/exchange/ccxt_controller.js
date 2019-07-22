"use strict";

const logger = require("../logger");
const _ = require("lodash");
// CCXT
const ccxt = require("ccxt");

class ExchangeAPI {
  constructor() {
    this.exchanges = [];
  }

  async get_candlestick(
    symbol,
    exchange,
    interval,
    since = undefined,
    limit = 100
  ) {
    try {
      let API = this.load_exchange_api(exchange);

      /* [[time,open,high,close,volume]] */
      let candledata = await API.fetchOHLCV(symbol, interval, since, limit);

      return candledata;
    } catch (e) {
      logger.error("CCXT candlestick error ", e);
    }
  }

  async get_marketdata(exchange) {
    try {
      let API = this.load_exchange_api(exchange);

      let marketdata = await API.loadMarkets();

      return marketdata;
    } catch (e) {
      logger.error("CCXT marketdata error ", e);
    }
  }

  async get_pricetickers(exchange) {
    try {
      let API = this.load_exchange_api(exchange);

      let pricetickers = await API.fetchTickers();

      return pricetickers;
    } catch (e) {
      logger.error("CCXT marketdata error ", e);
    }
  }

  /* CCXT API STUFF */

  load_exchange_api(exchange) {
    try {
      exchange = exchange.toLowerCase();

      // Check if CCXT API already loaded
      let exchange_data = this.exchanges.filter(e => e.exchange == exchange);

      // CCTX API load from buffer or add to the buffer
      if (exchange_data.length == 0) {
        exchange_data = this.init_new_exchanges(exchange);
      } else {
        exchange_data = exchange_data[0];
      }

      return exchange_data.api;
    } catch (e) {
      logger.error("CCXT load API error ", e);
    }
  }

  init_new_exchanges(exchange) {
    exchange = exchange.toLowerCase();

    // Check exchange is valid
    if (_.isObject(ccxt[exchange])) {
      let api = new ccxt[exchange]();

      this.exchanges.push({ exchange, api });

      return { exchange, api };
    } else {
      throw `Invalid Exchange ${exchange}`;
    }
  }

  /* CCXT API STUFF */
}

module.exports = new ExchangeAPI();
