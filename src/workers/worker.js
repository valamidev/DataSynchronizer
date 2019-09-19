'use strict';

const { parentPort } = require('worker_threads');
const candle_convert = require('candlestick-convert');

const { logger } = require('../logger');
const { util } = require('../utils');
const { TradepairQueries } = require('../tradepairs/tradepairs');
const ExchangeDB = require('../database/queries');

const base_candletime = 60;

// Convert Trades to Candlestick(base_candletime) and save them
parentPort.on('message', snapshot_time => {
  setImmediate(async () => {
    try {
      // Select all tradepairs
      let tradepairs = await TradepairQueries.select_tradepairs_all();

      tradepairs.forEach(async e => {
        try {
          // Table check
          let table_candle = util.candlestick_name(e.exchange, e.symbol, base_candletime);

          await ExchangeDB.candlestick_table_check(table_candle);

          // Get last Candle time
          let last_time = await ExchangeDB.candlestick_lastTime(table_candle);

          // Get Trades
          let table_trades = util.trades_name(e.exchange, e.symbol);

          let trades = await ExchangeDB.trades_select(table_trades, last_time);

          // Avoid some trades error
          if (Array.isArray(trades)) {
            // Convert candles
            let candlesticks = candle_convert.trade_to_candle(trades, base_candletime);

            let candlestick_array = candlesticks.map(e => {
              return [e.time, e.open, e.high, e.low, e.close, e.volume];
            });

            await ExchangeDB.candlestick_replace(table_candle, candlestick_array);
          }
        } catch (e) {
          logger.error('Worker thread error', e);
        }
      });
    } catch (e) {
      logger.error('Worker thread error', e);
    } finally {
      parentPort.postMessage(snapshot_time);
    }
  });
});
