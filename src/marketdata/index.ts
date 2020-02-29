'use strict';

import { logger } from '../logger';
import { CCXT_API } from '../exchange/ccxt_controller';
import * as _ from 'lodash';
import { BaseDB } from '../database';
import { isArray } from 'util';
import { RowDataPacket } from 'mysql2';

class MarketDataClass {
  exchanges: string[];
  updateFrequency: number;
  constructor() {
    this.exchanges = [];
    this.updateFrequency = 3600 * 1000; // in ms
  }

  async start(exchanges: string[]): Promise<void> {
    try {
      this.exchanges = exchanges;

      await this.updateLoop();
    } catch (e) {
      logger.error('MarketDatas start ', e);
    }
  }

  async updateLoop(): Promise<void> {
    try {
      const updatePromises: Array<Promise<void>> = [];

      for (let i = 0; i < this.exchanges.length; i++) {
        const exchange = this.exchanges[i];

        updatePromises.push(this.updateMarketData(exchange));
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

  async updateMarketData(exchange: string): Promise<void> {
    // Looking after new tradepairs!
    try {
      const marketData = await this.marketDataSelect(exchange);
      const newMarketData = await CCXT_API.getMarketdata(exchange);

      if (_.isObject(newMarketData)) {
        // Add exchange into MarketDatas
        const convertedNewMarketData = Object.values(newMarketData).map(elem => {
          elem.exchange = exchange;

          return elem;
        });

        // TODO: Better matching of stored and new market datas: new pairs etc.
        if (!marketData) {
          await this.marketDataReplace(convertedNewMarketData);
          logger.verbose(`New market data for ${exchange}`);
          return;
        }

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        if (convertedNewMarketData.length !== (marketData as any[]).length) {
          await this.marketDataReplace(convertedNewMarketData);
          logger.verbose(`New market data for ${exchange}`);
          return;
        }
      }

      return;
    } catch (e) {
      logger.error('Update_tradepairs', e);
    }
  }

  async marketDataSelect(exchange: string): Promise<RowDataPacket[] | undefined> {
    try {
      const [rows] = await BaseDB.query('SELECT * FROM `market_datas` WHERE exchange = ?;', [exchange]);

      if (!isArray(rows)) {
        throw new Error('Market data query failed, reason: not array');
      }

      return rows as RowDataPacket[];
    } catch (e) {
      logger.error('Error', e);
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async marketDataReplace(marketData: any[]): Promise<void> {
    try {
      // Stringify JSONs for database storage
      marketData = marketData.map(e => {
        // Convert to simple array
        return [
          e.exchange,
          JSON.stringify(e.limits),
          JSON.stringify(e.precision),
          e.tierBased,
          e.percentage,
          e.taker,
          e.maker,
          e.id,
          e.symbol,
          e.baseId,
          e.quoteId,
          e.base,
          e.quote,
          e.active,
          JSON.stringify(e.info),
        ];
      });

      await BaseDB.query(
        'REPLACE INTO `market_datas` (`exchange`, `limits`, `precision_data`, `tierBased`, `percentage`, `taker`, `maker`, `id`, `symbol`, `baseId`, `quoteId`, `base`, `quote`, `active`, `info`) VALUES ?',
        [marketData],
      );

      return;
    } catch (e) {
      logger.error('Error', e);
    }
  }
}

export const MarketDataAPI = new MarketDataClass();
