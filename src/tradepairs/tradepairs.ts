import { logger } from '../logger';
import { BaseDB } from '../database';
import { RowDataPacket } from 'mysql2';
import { isArray } from 'util';

interface SymbolCache {
  exchange: string;
  id: string;
  symbol: string;
}

let id_to_symbol_cache: SymbolCache[] = [];

export const TradepairQueries = {
  /* Database queries */

  id_to_symbol: async (exchange: string, id: string) => {
    try {
      const result = id_to_symbol_cache.find(e => e.exchange == exchange && e.id == id);

      if (typeof result != 'undefined') {
        return result.symbol;
      } else {
        const [rows] = await BaseDB.query('SELECT id,symbol from `market_datas` WHERE exchange = ? AND id = ? LIMIT 1', [exchange, id]);

        if ((rows as any[]).length === 1) {
          const symbol = rows[0].symbol;

          id_to_symbol_cache.push({ exchange, id, symbol });

          return symbol;
        }
      }

      throw new Error('Invalid symbol Id');
    } catch (e) {
      logger.error('SQL error', e);
    }
  },

  select_tradepairs_all: async (): Promise<any[] | undefined> => {
    try {
      // Warden timeout limit 10 minutes
      const time = Date.now() - 600 * 1000;

      const [
        rows,
      ] = await BaseDB.query(
        'SELECT m.exchange,m.id,m.symbol,m.baseId,m.quoteId FROM `tradepairs` as t JOIN `market_datas` as m ON t.symbol = m.symbol AND t.exchange = m.exchange  WHERE t.is_warden = 0 OR (t.is_warden = 1 AND t.time > ?) ORDER BY t.`asset` ASC;',
        [time],
      );

      if (!rows || !isArray(rows)) {
        return [];
      }

      return rows;
    } catch (e) {
      logger.error('SQL error', e);
    }
  },

  add_tradepair: async (exchange: string, symbol: string, id: string, asset: string, quote: string, is_warden: number = 0, time: number = 0) => {
    try {
      // Check existing before insert!

      await BaseDB.query(
        'INSERT INTO `tradepairs` (`exchange`, `symbol`, `id`, `asset`,`quote`,`is_warden`,`time`) VALUES (?,?,?,?,?,?,?) ON DUPLICATE KEY UPDATE time=VALUES(time);',
        [exchange, symbol, id, asset, quote, is_warden, time],
      );

      return;
    } catch (e) {
      logger.error('SQL error', e);
    }
  },

  select_tradepair_single: async (exchange: string, symbol: string) => {
    try {
      let row = await BaseDB.query('SELECT * FROM `tradepairs` where `exchange` = ? and `symbol` = ? LIMIT 1;', [exchange, symbol]);

      return row[0][0];
    } catch (e) {
      logger.error('SQL error', e);
    }
  },
};
