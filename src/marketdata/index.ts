'use strict';

import {logger} from '../logger';
import {CCXT_API} from '../exchange/ccxt_controller';
import * as _ from 'lodash';
import {BaseDB} from '../database';
import { RowDataPacket } from 'mysql2';
import { isArray } from 'util';


class MarketDataClass {
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
      let update_promises: any[] = [];

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
      const market_data = await this.market_data_select(exchange);
      const new_market_data = await CCXT_API.get_marketdata(exchange);

      if (_.isObject(new_market_data)) {
        // Add exchange into MarketDatas
       const converted_new_market_data = Object.values(new_market_data).map(elem => {
          elem.exchange = exchange;

          return elem;
        });

        // TODO: Better matching of stored and new market datas: new pairs etc.
        if(!market_data){
          await this.market_data_replace(converted_new_market_data);
          logger.verbose(`New market data for ${exchange}`);
        }

        if (converted_new_market_data.length !== (market_data as any[]).length) {
          await this.market_data_replace(converted_new_market_data);
          logger.verbose(`New market data for ${exchange}`);
        }

      }

      return;
    } catch (e) {
      logger.error('Update_tradepairs', e);
    }
  }

  async market_data_select(exchange: string): Promise<any[] | undefined> {
    try {
      const [rows] = await BaseDB.query('SELECT * FROM `market_datas` WHERE exchange = ?;', [exchange]);

      if(!isArray(rows)){
       throw new Error('Market data query failed, reason: not array')
      }
      
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

      await BaseDB.query(
        'REPLACE INTO `market_datas` (`exchange`, `limits`, `precision_data`, `tierBased`, `percentage`, `taker`, `maker`, `id`, `symbol`, `baseId`, `quoteId`, `base`, `quote`, `active`, `info`) VALUES ?',
        [market_data],
      );

      return;
    } catch (e) {
      logger.error('Error', e);
    }
  }
}

export const MarketDataAPI = new MarketDataClass();
