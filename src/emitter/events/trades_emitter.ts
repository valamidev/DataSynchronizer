"use strict"

import {util} from '../../utils'
import {logger} from '../../logger'
import {Emitter} from '../emitter'


const {TradepairQueries} = require("../../tradepairs/tradepairs")
const DB_LAYER = require("../../database/queries")

let table_name_cache: any[] = []

class Trades_emitter {
  constructor() {
    // Event listeners
    logger.verbose("Trade Emitter started!")

    Emitter.on("Trades", (exchange:string, trade:any) => {
      setImmediate(async () => {
        // Get CCXT standard symbol
        let ccxt_symbol = await TradepairQueries.id_to_symbol(exchange, trade.symbol)

        let table_name = util.trades_name(exchange, ccxt_symbol)
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
  }
}

module.exports = new Trades_emitter()
