'use strict';

import {util} from '../../utils'
import {logger} from '../../logger'
import {Emitter} from '../emitter'



const DB_LAYER = require('../../database/queries');

class Candlestick_emitter {
  constructor() {
    // Event listeners
    logger.verbose('Candlestick Emitter started!');

    Emitter.on('CandleUpdate', (exchange:string, interval:any, candle:any) => {
      setImmediate(() => {
        this.candlestick_update_emitter(exchange, interval, candle);
      });
    });
  }

  async candlestick_update_emitter(exchange:string, interval:any, candle:any) {
    try {
      // Final candles are saved into separated tables
      if (candle.isFinal == true) {
        let table_name = util.candlestick_name(exchange, candle.symbol, interval);

        this.update_ws(table_name, candle);
      }
    } catch (e) {
      logger.error('Candlestick Websocket update error ', e);
    }
  }

  async update_ws(table_name:string, candle:any) {
    try {
      // Check if table exist
      await DB_LAYER.candlestick_table_check(table_name);

      let ohlc = [candle.startTime, candle.open, candle.high, candle.low, candle.close, candle.volume];

      await DB_LAYER.candlestick_replace(table_name, [ohlc]);
    } catch (e) {
      logger.error('', e);
    }
  }
}

module.exports = new Candlestick_emitter();
