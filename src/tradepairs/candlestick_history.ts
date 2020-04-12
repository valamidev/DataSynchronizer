// Load Exchanges

// Load Exchange APIs
import _ from 'lodash';
import { RowDataPacket } from 'mysql2';
import { CCXT_API } from '../exchange/ccxt_controller';
import { logger } from '../logger';

import { Utils } from '../utils';
import { DBQueries } from '../database/queries';
import { TicksOHLCV } from '../types/types';
import { TableTemplates } from '../database/queries/enums';

const ccxtCandleLimit = {
  binance: 500,
};

const baseInterval = 60;

class Candlestick {
  exchange: string;
  symbol: string;
  historyLimit: number;
  interval: number;
  intervalString: string;
  tableName: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  historyData: any[];
  constructor(exchange: string, symbol: string, historyLimit = 300) {
    this.exchange = exchange;
    this.symbol = symbol;
    this.historyLimit = historyLimit;
    this.interval = baseInterval;
    this.intervalString = Utils.intervalToString(this.interval);
    this.tableName = Utils.candlestickName(exchange, symbol, this.interval);

    this.historyData = [];
    // Check Table and Data integrity
  }

  async start(): Promise<void> {
    try {
      if (!(await DBQueries.tableCheck(this.tableName))) {
        await DBQueries.createNewTableFromTemplate(TableTemplates.Candlestick, this.tableName);
      }

      logger.verbose(`Candlestick history build start for: ${this.exchange}-${this.symbol}-${this.intervalString}`);
      await this.initBuildHistory();

      const candleData = await DBQueries.candlestickSelectAll(this.tableName);

      const integrityCheck = Utils.candlestickDataIntegrityCheck(candleData as RowDataPacket[][], this.interval);

      if (Array.isArray(integrityCheck)) {
        logger.verbose(
          `Candlestick history data integrity error in ${this.exchange}-${this.symbol} ${integrityCheck.length} times`,
        );
      }

      logger.verbose(`Candlestick history build finished for: ${this.exchange}-${this.symbol}-${this.intervalString}`);

      return;
    } catch (err) {
      logger.error('Error', err);
      return err;
    }
  }

  async initBuildHistory(startTime = 0): Promise<void> {
    try {
      // Check first timestamp and go forward
      if (startTime === 0) {
        // eslint-disable-next-line no-param-reassign
        startTime = Date.now() - this.historyLimit * this.interval * 1000;
      }

      const ticks = await this.getTicks(startTime);

      // Check history limit
      const checkSize = await DBQueries.candlestickHistorySize(this.tableName);

      if (checkSize && checkSize > this.historyLimit) {
        return;
      }

      if (Array.isArray(ticks)) {
        if (ticks.length === 1) {
          return;
        }

        await DBQueries.candlestickReplace(this.tableName, ticks as TicksOHLCV[]);
        // eslint-disable-next-line no-param-reassign , prefer-destructuring
        startTime = ticks[ticks.length - 1][0];
        logger.verbose(`Tick length: ${ticks.length}`);
      } else {
        // eslint-disable-next-line no-param-reassign
        startTime += ccxtCandleLimit[this.exchange] * this.interval * 1000;
      }

      logger.verbose(`Time: ${startTime}`);

      await this.initBuildHistory(startTime);
    } catch (e) {
      logger.error('Error', e);
    }
  }

  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  async getTicks(startTime: number) {
    try {
      const ticks = await CCXT_API.getCandlestick(
        this.symbol,
        this.exchange,
        this.intervalString,
        startTime,
        ccxtCandleLimit[this.exchange],
      );

      // https://github.com/ccxt/ccxt/issues/2937
      // Last Candles can be incomplete
      if (ticks && ticks.length > 0) {
        if (ticks[ticks.length - 1] && ticks[ticks.length - 1][0]) {
          if (ticks[ticks.length - 1][0] + this.interval * 1000 > _.now()) {
            ticks.pop();
          }
        }
      }

      return ticks;
    } catch (e) {
      logger.error('', e);
    }
  }
}

module.exports = Candlestick;
