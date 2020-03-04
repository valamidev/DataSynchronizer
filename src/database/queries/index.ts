'use strict';

import fs from 'fs';
import { RowDataPacket } from 'mysql2';

import { logger } from '../../logger';
import { ExchangeDB } from '../../database';
import { TicksOHLCV } from '../../types/types';

export const DBQueries = {
  /* Orderbooks */

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  orderbookReplace: async (tableName: string, res: any): Promise<void> => {
    try {
      const data = [res.time, JSON.stringify(res.orderbook)];

      await ExchangeDB.query('REPLACE INTO `' + tableName + '` (`time`, `orderbook`) VALUES ?;', [[data]]);

      return;
    } catch (e) {
      logger.error(`Error ${tableName} `, e);
    }
  },

  /* Trades */

  tradesSelect: async (tableName: string, time = 0): Promise<RowDataPacket[] | undefined> => {
    try {
      const [rows] = await ExchangeDB.query('SELECT * FROM `' + tableName + '` WHERE time > ? ORDER BY `time` ASC;', [time]);

      return rows as RowDataPacket[];
    } catch (err) {
      logger.verbose('SQL error', err);
      return undefined;
    }
  },

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  tradesReplace: async (tableName: string, res: any): Promise<void> => {
    try {
      /*
      {
        time: 1564393265876 // in ms
        symbol: 'BTC-USDT' // DO not need here! 
        side: 'buy'/'sell'
        quantity: '0.00171400'
        price:'9469.48000000'
        tradeId: 30 long string
      }
      */
      const data = [res.time, res.side, res.quantity, res.price, res.tradeId];

      await ExchangeDB.query('REPLACE INTO `' + tableName + '` (`time`, `side`, `quantity`, `price`, `tradeId`) VALUES ?;', [[data]]);

      return;
    } catch (e) {
      logger.error('Error', e);
    }
  },

  /* Candlesticks */

  candlestickLastTime: async (tableName: string): Promise<number | undefined> => {
    try {
      const [rows] = await ExchangeDB.query('SELECT time FROM `' + tableName + '` ORDER BY `time` DESC limit 1;');

      if (rows[0]) {
        return rows[0].time;
      }

      return 0;
      // Throw error no entry in the Database
    } catch (e) {
      logger.error('Error', e);
    }
  },

  candlestickReplace: async (tableName: string, ticks: TicksOHLCV[]): Promise<void> => {
    try {
      if (ticks.length > 0) {
        await ExchangeDB.query('REPLACE INTO `' + tableName + '` (`time`, `open`, `high`, `low`, `close`, `volume`) VALUES ?;', [ticks]);
      }
    } catch (e) {
      logger.error('Error', e);
    }
  },

  candlestickSelectAll: async (tableName: string): Promise<RowDataPacket[] | undefined> => {
    try {
      const [rows] = await ExchangeDB.query('SELECT * FROM `' + tableName + '` ORDER BY `time` ASC;');

      return rows as RowDataPacket[];
    } catch (e) {
      logger.error('Error', e);
    }
  },

  candlestickHistorySize: async (tableName: string): Promise<number | undefined> => {
    try {
      const [rows] = await ExchangeDB.query('SELECT count(*) as count FROM `' + tableName + '`;');

      if (rows[0]) {
        return rows[0].count;
      }

      return 0;
    } catch (e) {
      logger.error('Error', e);
    }
  },

  tableCheck: async (tableName: string): Promise<boolean> => {
    try {
      const [rows] = await ExchangeDB.query('SHOW TABLES LIKE ? ;', [tableName]);

      if ((rows as RowDataPacket[]).length === 1) {
        return true;
      }

      return false;
    } catch (e) {
      logger.error('Error', e);
      return false;
    }
  },

  createNewTableFromTemplate: async (templateQuery: string, tableName: string): Promise<boolean> => {
    try {
      await ExchangeDB.query(templateQuery, [tableName]);

      return true;
    } catch (e) {
      logger.error('Error', e);

      return false;
    }
  },
};
