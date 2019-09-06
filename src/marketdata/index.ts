'use strict';

import {logger} from '../logger';
import { exchanges } from 'ccxt';

const _ = require('lodash');

const { pool } = require('../database');
const CCXT_API = require('../exchange/ccxt_controller');

class MarketData {
  exchanges:  any[];
  update_frequency: number;
  constructor() {
    this.exchanges = [];
    this.update_frequency = 3600 * 1000; // in ms
  }

  async start(exchanges: any[]) {
    try {
      this.exchanges = exchanges;

      await this.market_data_update_loop();
    } catch (e) {
      logger.error('MarketDatas start ', e);
    }
  }

  async market_data_update_loop() {
    try {
      let update_promises = [];

      for (let i = 0; i < this.exchanges.length; i++) {
        let exchange = this.exchanges[i];

        update_promises.push(this.update_market_data(exchange));
      }

      if (update_promises.length > 0) {
        logger.verbose(`Marketdata Update loop`);
        await Promise.all(update_promises);
      }
    } catch (e) {
      logger.error('Marketdata Update ', e);
    } finally {
      setTimeout(() => {
        this.market_data_update_loop();
      }, this.update_frequency);
    }
  }

  async update_market_data(exchange: string) {
    // Looking after new tradepairs!
    try {
      let market_data = await this.market_data_select(exchange);

      let new_market_data: any[] = await CCXT_API.get_marketdata(exchange);

      if (_.isObject(new_market_data)) {
        // Add exchange into MarketDatas
        new_market_data = Object.values(new_market_data).map(elem => {
          elem.exchange = exchange;

          return elem;
        });

        // TODO: Better matching of stored and new market datas: new pairs etc.
        if (new_market_data.length != market_data.length) {
          await this.market_data_replace(new_market_data);
          logger.verbose(`New market data for ${exchange}`);
        }
      }

      return;
    } catch (e) {
      logger.error('Update_tradepairs', e);
    }
  }

  async market_data_select(exchange: string) {
    try {
      let [rows] = await pool.query('SELECT * FROM `market_datas` WHERE exchange = ?;', [exchange]);

      return rows;
    } catch (e) {
      logger.error('Error', e);
    }
  }

  async market_data_replace(market_data: any[]) {
    try {
      // Stringify JSONs for database storage
      market_data = market_data.map(e => {
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

      await pool.query(
        'REPLACE INTO `market_datas` (`exchange`, `limits`, `precision_data`, `tierBased`, `percentage`, `taker`, `maker`, `id`, `symbol`, `baseId`, `quoteId`, `base`, `quote`, `active`, `info`) VALUES ?',
        [market_data],
      );

      return;
    } catch (e) {
      logger.error('Error', e);
    }
  }
}

module.exports = new MarketData();
