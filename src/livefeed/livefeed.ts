import { isEqual } from 'lodash';
import { RowDataPacket } from 'mysql2';
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
  public tradepairs: RowDataPacket[];
  public exchanges: string[];
  public websocketAPI: {};

  constructor() {
    this.tradepairs = [];
    this.exchanges = [];
    this.websocketAPI = {};
  }

  public async start(exchanges: string[]): Promise<void> {
    try {
      this.exchanges = exchanges;

      await this.tradepairsWatcher();

      logger.info('LiveFeed API started');
    } catch (e) {
      logger.error('LiveFeed start ', e);
    }
  }

  private async tradepairsWatcher(): Promise<void> {
    // Looking after new tradepairs!
    try {
      const tradepairs = await TradepairQueries.selectTradepairsAll();

      if (!tradepairs) {
        throw new Error('LiveFeed Tradepairs are empty');
      }

      const newSymbols = tradepairs.map((elem) => elem.symbol);

      const oldSymbols = this.tradepairs.map((elem) => elem.symbol);

      // There is no new tradepairs
      if (isEqual(newSymbols, oldSymbols) === true) {
        return;
      }
      this.tradepairs = tradepairs;

      for (const exchange of this.exchanges) {
        if (typeof this.websocketAPI[exchange] !== 'undefined') {
          logger.info(`Close old websocket ${exchange}`);
          this.websocketAPI[exchange]();
        }
        // Open Websockets
        await this.openWebsocketCandlestick(exchange);

        logger.info(`Load new websocket for ${exchange}`);
      }
    } catch (e) {
      logger.error('LiveFeed Tradepairs watcher error ', e);
    } finally {
      setTimeout(() => {
        this.tradepairsWatcher();
      }, watcherTimeout);
    }
  }

  private async openWebsocketCandlestick(exchange: string): Promise<void> {
    const websocketSymbolIds = [];

    for (const tradepair of this.tradepairs) {
      if (tradepair.exchange === exchange) {
        websocketSymbolIds.push(tradepair.id);
      }
    }

    this.websocketAPI[exchange] = ExchangeWS[exchange](websocketSymbolIds);
  }
}

export default new LivefeedAPI();
