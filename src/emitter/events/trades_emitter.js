"use strict"

const util = require("../../utils")
const logger = require("../../logger")
const Emitter = require("../emitter")

const DB_LAYER = require("../../database/queries")

let table_name_cache = []

class Trades_emitter {
  constructor() {
    // Event listeners
    logger.verbose("Trade Emitter started!")

    Emitter.on("Trades", (exchange, trade) => {
      setImmediate(async () => {
        let table_name = util.trades_name(exchange, trade.symbol)
        /*
        {
          time: 1564393265876 // in ms
          symbol: 'BTC-USDT'
          side: 'buy'/'sell'
          quantity: '0.00171400'
          price:'9469.48000000'
          tradeId: 30 long string
        }
        */

        // Avoid unnecessary Table checks
        if (table_name_cache.indexOf(table_name) == -1) {
          await DB_LAYER.trades_table_check(table_name)
          table_name_cache.push(table_name)
        }

        DB_LAYER.trades_replace(table_name, trade)
      })
    })

    Emitter.on("TradesCandlestickSnapshot", (snapshot_time) => {
      /* TODO create 1m Candles from trades */
    })
  }
}

module.exports = new Trades_emitter()
