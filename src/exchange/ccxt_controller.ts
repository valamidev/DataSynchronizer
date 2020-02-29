/* eslint-disable @typescript-eslint/no-explicit-any */
import { logger } from '../logger';
import _ from 'lodash';
import * as ccxt from 'ccxt';

class ExchangeAPI {
  exchanges: any[];
  constructor() {
    this.exchanges = [];
  }

  async getMarketdata(exchange: string): Promise<any> {
    try {
      const API = this.loadExchangeAPI(exchange);

      const marketdata = await API.loadMarkets();

      return marketdata;
    } catch (e) {
      logger.error('CCXT marketdata error ', e);
    }
  }

  async getPriceTickers(exchange: string): Promise<any> {
    try {
      const API = this.loadExchangeAPI(exchange);

      const pricetickers = await API.fetchTickers();

      return pricetickers;
    } catch (e) {
      logger.error('CCXT marketdata error ', e);
    }
  }

  async getCandlestick(
    symbol: string,
    exchange: string,
    interval: string,
    since: any = undefined,
    limit = 100,
  ): Promise<Array<[number, number, number, number, number, number]> | undefined> {
    try {
      const API = this.loadExchangeAPI(exchange);

      const candledata = await API.fetchOHLCV(symbol, interval, since, limit);

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
      logger.error('CCXT candlestick error ', e);
    }
  }

  /* CCXT API STUFF */

  loadExchangeAPI(exchange: string): any {
    try {
      exchange = exchange.toLowerCase();

      // Check if CCXT API already loaded
      let exchangeData = this.exchanges.find(e => e.exchange == exchange);

      // CCTX API load from buffer or add to the buffer
      if (!exchangeData) {
        exchangeData = this.initNewExchanges(exchange);
      }

      return exchangeData.api;
    } catch (e) {
      logger.error('CCXT load API error ', e);
    }
  }

  initNewExchanges(exchange: string): any {
    exchange = exchange.toLowerCase();

    if (_.isObject(ccxt[exchange])) {
      const api = new ccxt[exchange]();

      this.exchanges.push({ exchange, api });

      return { exchange, api };
    } else {
      throw `Invalid Exchange ${exchange}`;
    }
  }

  /* CCXT API STUFF */
}

export const CCXT_API = new ExchangeAPI();
