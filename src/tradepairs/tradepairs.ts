import { logger } from '../logger';
import { BaseDB } from '../database';
import { RowDataPacket } from 'mysql2';
import { isArray } from 'util';

interface SymbolCache {
  exchange: string;
  id: string;
  symbol: string;
}

const idToSymbolCache: SymbolCache[] = [];

export const TradepairQueries = {
  /* Database queries */

  idToSymbol: async (exchange: string, id: string): Promise<string | undefined> => {
    try {
      const result = idToSymbolCache.find(e => e.exchange == exchange && e.id == id);

      if (typeof result != 'undefined') {
        return result.symbol;
      } else {
        const [rows] = await BaseDB.query('SELECT id,symbol from `market_datas` WHERE exchange = ? AND id = ? LIMIT 1', [exchange, id]);

        if ((rows as RowDataPacket[]).length === 1) {
          const symbol = rows[0].symbol;

          idToSymbolCache.push({ exchange, id, symbol });

          return symbol;
        }
      }

      throw new Error('Invalid symbol Id');
    } catch (e) {
      logger.error('SQL error', e);
    }
  },

  selectTradepairsAll: async (): Promise<RowDataPacket[] | undefined> => {
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
        return [] as RowDataPacket[];
      }

      return rows as RowDataPacket[];
    } catch (e) {
      logger.error('SQL error', e);
    }
  },

  addTradepair: async (exchange: string, symbol: string, id: string, asset: string, quote: string, isWarden = 0, time = 0): Promise<RowDataPacket[] | undefined> => {
    try {
      // Check existing before insert!

      await BaseDB.query(
        'INSERT INTO `tradepairs` (`exchange`, `symbol`, `id`, `asset`,`quote`,`is_warden`,`time`) VALUES (?,?,?,?,?,?,?) ON DUPLICATE KEY UPDATE time=VALUES(time);',
        [exchange, symbol, id, asset, quote, isWarden, time],
      );

      return;
    } catch (e) {
      logger.error('SQL error', e);
    }
  },

  selectTradepairSingle: async (exchange: string, symbol: string): Promise<RowDataPacket[] | undefined> => {
    try {
      const row = await BaseDB.query('SELECT * FROM `tradepairs` where `exchange` = ? and `symbol` = ? LIMIT 1;', [exchange, symbol]);

      return row[0][0];
    } catch (e) {
      logger.error('SQL error', e);
    }
  },
};
