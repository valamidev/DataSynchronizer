"use strict"

const util = require("../../utils")
const logger = require("../../logger")
const Emitter = require("../emitter")

const DB_LAYER = require("../../database/queries")

class Trades_emitter {
  constructor() {
    // Event listeners
    logger.verbose("Trade Emitter started!")

    Emitter.on("Trades", (exchange, trade) => {
      setImmediate(() => {
        let table_name = util.livefeed_trades(exchange)

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

        DB_LAYER.trades_livefeed_insert(table_name, trade)
      })
    })
  }
}

module.exports = new Trades_emitter()
