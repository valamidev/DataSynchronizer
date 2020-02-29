//
import CConverter, { OHLCV, Trade } from 'candlestick-convert';
import { parentPort } from 'worker_threads';

import { logger } from '../logger';

import { DBQueries } from '../database/queries';
import { TradepairQueries } from '../tradepairs/tradepairs';
import { util } from '../utils';
import { isArray } from 'util';
import { TicksOHLCV } from 'src/types/types';

const DEFAULT_CANDLE_INTERVAL = 60;

if (parentPort) {
  // Convert Trades to Candlestick(base_candletime) and save them
  parentPort.on('message', snapshotTime => {
    setImmediate(async () => {
      try {
        // Select all tradepairs
        const tradepairs = await TradepairQueries.selectTradepairsAll();

        if (isArray(tradepairs)) {
          for (const tradepair of tradepairs) {
            if (tradepair) {
              try {
                const { exchange, symbol } = tradepair;

                // Table check
                const candlestickTableName = util.candlestickName(exchange, symbol, DEFAULT_CANDLE_INTERVAL);

                await DBQueries.candlestickTableCheck(candlestickTableName);

                // Get last Candle time
                const lastUpdateTime = await DBQueries.candlestickLastTime(candlestickTableName);

                // Get Trades
                const tradeTableName = util.tradesName(exchange, symbol);

                const trades = await DBQueries.tradesSelect(tradeTableName, lastUpdateTime);

                // Avoid some trades error
                if (Array.isArray(trades)) {
                  // Convert candles
                  const candlesticks = CConverter.trade_to_candle(trades as Trade[], DEFAULT_CANDLE_INTERVAL);

                  const candlestickArray = candlesticks.map((e: OHLCV) => [e.time, e.open, e.high, e.low, e.close, e.volume]);

                  await DBQueries.candlestickReplace(candlestickTableName, candlestickArray as TicksOHLCV[]);
                }
              } catch (e) {
                logger.error('Worker thread error', e);
              }
            }
          }
        }
      } catch (e) {
        logger.error('Worker thread error', e);
      } finally {
        if (parentPort) {
          parentPort.postMessage(snapshotTime);
        }
      }
    });
  });
}
