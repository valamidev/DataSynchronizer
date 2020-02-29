import { util } from '../../utils';
import { logger } from '../../logger';
import { Emitter } from '../emitter';

import { TradepairQueries } from '../../tradepairs/tradepairs';
import { DBQueries } from '../../database/queries';

const tableNameCache: string[] = [];

class TradesEmitter {
  constructor() {
    // Event listeners
    logger.verbose('Trade Emitter started!');

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    Emitter.on('Trades', (exchange: string, trade: any) => {
      setImmediate(async () => {
        // Get CCXT standard symbol
        const ccxtSymbol = await TradepairQueries.idToSymbol(exchange, trade.symbol);

        if (ccxtSymbol) {
          const tableName = util.tradesName(exchange, ccxtSymbol);

          // Avoid unnecessary Table checks
          if (tableNameCache.indexOf(tableName) == -1) {
            await DBQueries.tradesTableCheck(tableName);
            tableNameCache.push(tableName);
          }

          DBQueries.tradesReplace(tableName, trade);
        }
      });
    });
  }
}

module.exports = new TradesEmitter();
