'use strict';

import { isEqual } from 'lodash';
import { logger } from '../logger';

import { TradepairQueries } from '../tradepairs/tradepairs';

import { openSocket as binanceWS } from '../exchange/ws_exchanges/binance_ws';
import { openSocket as kucoinWS } from '../exchange/ws_exchanges/kucoin_ws';

// Exchange Websockets
const ExchangeWS = {
  binance: binanceWS,
  kucoin: kucoinWS,
};
// Exchange Websockets

const watcherTimeout = 5 * 60 * 1000; // 5 minute

class LivefeedAPI {
  public tradepairs: any[];
  public exchanges: any[];
  public websocketAPI: {};

  constructor() {
    this.tradepairs = [];
    this.exchanges = [];
    this.websocketAPI = {};
  }

  public async start(exchanges: string[]) {
    try {
      this.exchanges = exchanges;

      await this.tradepairs_watcher();

      logger.info('LiveFeed API started');
    } catch (e) {
      logger.error('LiveFeed start ', e);
    }
  }

  private async tradepairs_watcher() {
    // Looking after new tradepairs!
    try {
      const tradepairs = await TradepairQueries.select_tradepairs_all();

      if (!tradepairs) {
        throw new Error('LiveFeed Tradepairs are empty');
      }

      const new_symbols = tradepairs.map(elem => elem.symbol);

      const old_symbols = this.tradepairs.map(elem => elem.symbol);

      // There is no new tradepairs
      if (isEqual(new_symbols, old_symbols) === true) {
        return;
      } else {
        this.tradepairs = tradepairs;
      }

      for (const exchange of this.exchanges) {
        if (typeof this.websocketAPI[exchange] !== 'undefined') {
          logger.info(`Close old websocket ${exchange}`);
          this.websocketAPI[exchange]();
        }
        // Open Websockets
        await this.open_websocket_candlestick(exchange);

        logger.info(`Load new websocket for ${exchange}`);
      }
    } catch (e) {
      logger.error('LiveFeed Tradepairs watcher error ', e);
    } finally {
      setTimeout(() => {
        this.tradepairs_watcher();
      }, watcherTimeout);
    }
  }

  private async open_websocket_candlestick(exchange: any) {
    const websocketSymbolIds = [];

    for (const tradepair of this.tradepairs) {
      if (tradepair.exchange === exchange) {
        websocketSymbolIds.push(tradepair.id);
      }
    }

    this.websocketAPI[exchange] = await ExchangeWS[exchange](websocketSymbolIds);
  }
}

module.exports = new LivefeedAPI();
