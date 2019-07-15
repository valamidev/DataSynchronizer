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

      let candledata = await API.fetchOHLCV(symbol, interval, since, limit);

      return candledata;

      /*
      1504541580000, // UTC timestamp in milliseconds, integer
        4235.4,        // (O)pen price, float
        4240.6,        // (H)ighest price, float
        4230.0,        // (L)owest price, float
        4230.7,        // (C)losing price, float
        37.72941911    // (V)olume (in terms of the base currency), float 
      */
    } catch (e) {
      logger.error("CCXT candlestick error ", e);
    }
  }

  load_exchange_api(exchange) {
    try {
      let exchange_data = this.exchanges.filter(
        elem => elem.exchange == exchange
      );

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

      let new_exchanges = { exchange, api };

      this.exchanges.push(new_exchanges);

      return new_exchanges;
    } else {
      throw `Invalid Exchange ${exchange}`;
    }
  }
}

module.exports = new ExchangeAPI();
