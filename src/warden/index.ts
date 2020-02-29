'use strict';

import { logger } from '../logger';
import * as _ from 'lodash';
import { BaseDB } from '../database';
import { TradepairQueries } from '../tradepairs/tradepairs';
import { RowDataPacket } from 'mysql2';

/* Warden intelligent Symbol following system it help to follow new coins or unfollow in-active ones */

class Warden {
  wardenSymbols: string[];
  exchanges: string[];
  quotes: string[];
  quoteLimits: number[];

  constructor() {
    this.wardenSymbols = [];
    this.exchanges = [];
    this.quotes = [];
    this.quoteLimits = [];
  }

  async start(exchanges: string[], quotes: string[], quoteLimits: number[]): Promise<void> {
    try {
      this.exchanges = exchanges;

      if (this.quotes.length != this.quoteLimits.length) {
        throw 'Quotes and quotes limit are not defined correctly!';
      }

      this.quotes = quotes;
      this.quoteLimits = quoteLimits;

      await this.updateLoop();

      logger.verbose('Warden System started');

      return;
    } catch (e) {
      logger.error('Warden System ', e);
    }
  }

  async updateLoop(): Promise<void> {
    try {
      const updatePromises = [];

      for (let i = 0; i < this.exchanges.length; i++) {
        const exchange = this.exchanges[i];

        for (let j = 0; j < this.quotes.length; j++) {
          const quote = this.quotes[j];
          const limit = this.quoteLimits[j];

          updatePromises.push(this.selectSymbols(exchange, quote, limit));
        }
      }

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      let results: any[] = await Promise.all(updatePromises);

      results = _.flatten(results);

      // Update Tradepairs
      const time = Date.now();

      results.map(async elem => {
        await TradepairQueries.addTradepair(elem.exchange, elem.symbol, elem.id, elem.baseId, elem.quoteId, 1, time);
      });

      return;
    } catch (e) {
      logger.error('Warden update loop ', e);
    } finally {
      setTimeout(async () => {
        this.updateLoop();
      }, 60 * 1000);
    }
  }

  /* Add Warden results into the Tradepairs */

  /* Database queries */
  async selectSymbols(exchange: string, quote: string, limit: number): Promise<RowDataPacket[] | undefined> {
    try {
      const [
        rows,
      ] = await BaseDB.query(
        'SELECT m.exchange, m.symbol, m.id ,m.baseId,m.quoteId FROM `market_datas` as m JOIN `price_tickers` as p ON m.exchange = p.exchange AND m.symbol = p.symbol WHERE m.active = 1 and m.exchange = ? and m.quoteId = ?  order by p.quoteVolume desc;',
        [exchange, quote],
      );

      if ((rows as RowDataPacket[]).length > 0) {
        return _.take(rows as RowDataPacket[], limit) as RowDataPacket[];
      }

      return [] as RowDataPacket[];
    } catch (e) {
      logger.error('Warden SQL error', e);
    }
  }
}

export default new Warden();
