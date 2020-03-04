import { util } from '../../utils';
import { logger } from '../../logger';
import { Emitter } from '../emitter';

import { TradepairQueries } from '../../tradepairs/tradepairs';
import { DBQueries } from '../../database/queries';
import { TableTemplatePath } from '../../database/queries/enums';

const tableNameCache: Set<string> = new Set();

class TradesEmitter {
  constructor() {
    // Event listeners
    logger.verbose('Trade Emitter started!');

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    Emitter.on('Trades', (exchange: string, trade: any) => {
      setImmediate(async () => {
        try {
          // Get CCXT standard symbol
          const ccxtSymbol = await TradepairQueries.idToSymbol(exchange, trade.symbol);

          if (ccxtSymbol) {
            const tableName = util.tradesName(exchange, ccxtSymbol);

            // Use Set for Table name check cache
            if (tableNameCache.has(tableName)) {
              await DBQueries.tradesReplace(tableName, trade);
              return;
            }

            await this.createTable(tableName);
          }
        } catch (err) {
          logger.error('Error', err);
        }
      });
    });
  }

  async createTable(tableName: string): Promise<void> {
    try {
      if (await DBQueries.tableCheck(tableName)) {
        tableNameCache.add(tableName);
        return;
      }

      await DBQueries.createNewTableFromTemplate(TableTemplatePath.Trades, tableName);
    } catch (err) {
      logger.error('Error', err);
    }
  }
}

module.exports = new TradesEmitter();
