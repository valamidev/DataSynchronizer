'use strict';

import { logger } from '../../logger';
import { CandleDB } from '../../database';
import { RowDataPacket } from 'mysql2';
import { TicksOHLCV } from 'src/types/types';

const { MYSQL_DB_EXCHANGE } = process.env;

const exchangeDatabaseName = MYSQL_DB_EXCHANGE ?? 'stockml_exchange';

export const DBQueries = {
  /* Orderbooks */

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  orderbookReplace: async (tableName: string, res: any): Promise<void> => {
    try {
      const data = [res.time, JSON.stringify(res.orderbook)];

      await CandleDB.query('REPLACE INTO `' + tableName + '` (`time`, `orderbook`) VALUES ?;', [[data]]);

      return;
    } catch (e) {
      logger.error(`Error ${tableName} `, e);
    }
  },

  orderbookTableCheck: async (tableName: string): Promise<void> => {
    try {
      const [rows] = await CandleDB.query('SELECT * FROM information_schema.TABLES WHERE TABLE_SCHEMA = ? AND TABLE_NAME = ? LIMIT 1;', [exchangeDatabaseName, tableName]);

      if ((rows as RowDataPacket[]).length != 1) {
        await CandleDB.query('CREATE TABLE `' + tableName + '` LIKE `orderbook_def`;');
      }
    } catch (e) {
      logger.error('Error', e);
    }
  },

  /* Trades */

  tradesSelect: async (tableName: string, time = 0): Promise<RowDataPacket[] | undefined> => {
    try {
      const [rows] = await CandleDB.query('SELECT * FROM `' + tableName + '` WHERE time > ? ORDER BY `time` ASC;', [time]);

      return rows as RowDataPacket[];
    } catch (e) {
      logger.error('SQL error', e);
    }
  },

  tradesTableCheck: async (tableName: string): Promise<void> => {
    try {
      const [rows] = await CandleDB.query('SELECT * FROM information_schema.TABLES WHERE TABLE_SCHEMA = ? AND TABLE_NAME = ? LIMIT 1;', [exchangeDatabaseName, tableName]);

      if ((rows as RowDataPacket[]).length != 1) {
        await CandleDB.query('CREATE TABLE `' + tableName + '` LIKE `trades_def`;');
      }
    } catch (e) {
      logger.error('Error', e);
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

      await CandleDB.query('REPLACE INTO `' + tableName + '` (`time`, `side`, `quantity`, `price`, `tradeId`) VALUES ?;', [[data]]);

      return;
    } catch (e) {
      logger.error('Error', e);
    }
  },

  /* Candlesticks */

  candlestickTableCheck: async (tableName: string): Promise<void> => {
    try {
      const [rows] = await CandleDB.query('SELECT * FROM information_schema.TABLES WHERE TABLE_SCHEMA = ? AND TABLE_NAME = ? LIMIT 1;', [exchangeDatabaseName, tableName]);

      if ((rows as RowDataPacket[]).length != 1) {
        await CandleDB.query('CREATE TABLE `' + tableName + '` LIKE `candlestick_def`;');
      }
    } catch (e) {
      logger.error('Error', e);
    }
  },

  candlestickLastTime: async (tableName: string): Promise<number | undefined> => {
    try {
      const [rows] = await CandleDB.query('SELECT time FROM `' + tableName + '` ORDER BY `time` DESC limit 1;');

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
        await CandleDB.query('REPLACE INTO `' + tableName + '` (`time`, `open`, `high`, `low`, `close`, `volume`) VALUES ?;', [ticks]);
      }
    } catch (e) {
      logger.error('Error', e);
    }
  },

  candlestickSelectAll: async (tableName: string): Promise<RowDataPacket[] | undefined> => {
    try {
      const [rows] = await CandleDB.query('SELECT * FROM `' + tableName + '` ORDER BY `time` ASC;');

      return rows as RowDataPacket[];
    } catch (e) {
      logger.error('Error', e);
    }
  },

  candlestickHistorySize: async (tableName: string): Promise<number | undefined> => {
    try {
      const [rows] = await CandleDB.query('SELECT count(*) as count FROM `' + tableName + '`;');

      if (rows[0]) {
        return rows[0].count;
      }

      return 0;
    } catch (e) {
      logger.error('Error', e);
    }
  },
};
