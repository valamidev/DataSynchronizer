import { logger } from '../../logger';
import { Utils } from '../../utils';
import { Emitter } from '../emitter';

import { DBQueries } from '../../database/queries';
import { TicksOHLCV } from '../../types/types';
import { TableTemplates } from '../../database/queries/enums';

class CandlestickEmitter {
  constructor() {
    // Event listeners
    logger.verbose('Candlestick Emitter started!');

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    Emitter.on('CandleUpdate', (exchange: string, interval: any, candle: any) => {
      setImmediate(() => {
        this.candlestickUpdateEmitter(exchange, interval, candle);
      });
    });
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async candlestickUpdateEmitter(exchange: string, interval: any, candle: any): Promise<void> {
    try {
      // Final candles are saved into separated tables
      if (candle.isFinal === true) {
        const tableName = Utils.candlestickName(exchange, candle.symbol, interval);

        this.updateWS(tableName, candle);
      }
    } catch (e) {
      logger.error('Candlestick Websocket update error ', e);
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async updateWS(tableName: string, candle: any): Promise<void> {
    try {
      // Check if table exist
      if (!(await DBQueries.tableCheck(tableName))) {
        await DBQueries.createNewTableFromTemplate(TableTemplates.Candlestick, tableName);
      }

      const OHLCV: TicksOHLCV[] = [
        [candle.startTime, candle.open, candle.high, candle.low, candle.close, candle.volume],
      ];

      await DBQueries.candlestickReplace(tableName, OHLCV);
    } catch (e) {
      logger.error('', e);
    }
  }
}

module.exports = new CandlestickEmitter();
