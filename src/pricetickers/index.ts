import _ from 'lodash';
import { BaseDB } from '../database';
import { CCXT_API } from '../exchange/ccxt_controller';
import { logger } from '../logger';

class PriceTickers {
  exchanges: string[];
  updateFrequency: number;
  constructor() {
    this.exchanges = [];
    this.updateFrequency = 30 * 1000; // in ms
  }

  async start(exchanges: string[]): Promise<void> {
    try {
      this.exchanges = exchanges;

      await this.updateLoop();
    } catch (e) {
      logger.error('PriceTickers start ', e);
    }
  }

  async updateLoop(): Promise<void> {
    try {
      const updatePromises = [];

      for (const exchange of this.exchanges) {
        updatePromises.push(this.update(exchange));
      }

      if (updatePromises.length > 0) {
        logger.verbose(`Marketdata Update loop`);
        await Promise.all(updatePromises);
      }
    } catch (e) {
      logger.error('Marketdata Update ', e);
    } finally {
      setTimeout(() => {
        this.updateLoop();
      }, this.updateFrequency);
    }
  }

  async update(exchange: string): Promise<void> {
    // Looking after new tradepairs!
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      let priceTickers: any[] = [];

      priceTickers = await CCXT_API.getPriceTickers(exchange);

      const time = Date.now();

      if (_.isObject(priceTickers) === false) {
        return;
      }
      // Add exchange,time,quoteVolume into PriceTickers
      priceTickers = Object.values(priceTickers).map(elem => {
        elem.exchange = exchange;
        elem.timestamp = time;

        // Calculate quoteVolume where it is missing
        if (elem.quoteVolume == undefined && elem.baseVolume > 0) {
          elem.quoteVolume = elem.baseVolume * ((elem.high + elem.low) / 2);
        }

        return elem;
      });

      /* TODO remove tickers with undefined values */
      priceTickers = priceTickers.filter(elem => elem.high != undefined || typeof elem.symbol !== 'string');

      if (priceTickers.length > 0) {
        await this.replaceDB(priceTickers);
      }

      return;
    } catch (e) {
      logger.error('Update_tradepairs ', e);
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async replaceDB(priceTickers: any[]): Promise<void> {
    // Stringify JSON for database storage
    priceTickers.forEach(async e => {
      // Convert to simple array [[]]
      const priceTicker = [[e.exchange, e.symbol || e.info.symbol, e.timestamp, e.high, e.low, e.bid, e.ask, e.last, e.change, e.percentage, e.baseVolume, e.quoteVolume, JSON.stringify(e.info)]];

      try {
        await BaseDB.query(
          'REPLACE INTO `price_tickers` (`exchange`, `symbol`, `timestamp`, `high`, `low`, `bid`, `ask`, `last`, `change`, `percentage`, `baseVolume`, `quoteVolume`, `info`) VALUES ?',
          [priceTicker],
        );
      } catch (e) {
        logger.error(`Reason: ${e.message}, Data: ${priceTicker}`);
      }
    });
  }
}

export default new PriceTickers();
