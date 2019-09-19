"use strict"

import {util} from '../../utils'
import {logger} from '../../logger'
import {Emitter} from '../emitter'


const { OrderBookStore } = require("orderbook-synchronizer")
const memory_limit = 512
const Orderbooks = {}

const {TradepairQueries} = require("../../tradepairs/tradepairs")
const DB_LAYER = require("../../database/queries")
const { Redis, Redis_pub } = require("../../redis/redis")

class Orderbook_emitter {
  constructor() {
    // Event listeners
    logger.verbose("Orderbook Emitter started!")

    Emitter.on("Orderbook", (exchange:string, depth:any) => {
      exchange = exchange.toLowerCase()

      if (typeof Orderbooks[exchange] == "undefined") {
        Orderbooks[exchange] = new OrderBookStore(memory_limit)
      }

      let { symbol, asks, bids } = depth

      if (Orderbooks[exchange]._symbols.indexOf(symbol) == -1) {
        setImmediate(async () => {
          try {
            let table_name = util.orderbook_name(exchange, symbol)
            let orderbook_snapshot = await Redis.get(table_name)
            if (orderbook_snapshot != null) {
              orderbook_snapshot = JSON.parse(orderbook_snapshot)
              if (Array.isArray(orderbook_snapshot.ask) && Array.isArray(orderbook_snapshot.bid)) {
                Orderbooks[exchange].updateOrderBook(symbol, orderbook_snapshot.ask, orderbook_snapshot.bid)
              }
            }
            Orderbooks[exchange].updateOrderBook(symbol, asks, bids)
          } catch (e) {
            logger.error("Orderbook snapshot error", e)
          }
        })
      } else {
        Orderbooks[exchange].updateOrderBook(symbol, asks, bids)

        if (typeof Orderbooks[exchange]._data[symbol] != "undefined") {
          let data = Orderbooks[exchange]._data[symbol]

          Redis_pub.publish("OrderBookUpdate", JSON.stringify({ exchange, symbol, ask: data.best_ask, bid: data.best_bid }))
        }
      }
    })

    Emitter.on("OrderbookSnapshot", (snapshot_time:number) => {
      Object.keys(Orderbooks).map((exchange) => {
        let symbols = Orderbooks[exchange]._symbols

        symbols.forEach((symbol:any) => {
          setImmediate(async () => {
            let orderbook = Orderbooks[exchange].getOrderBook(symbol)
            // Get CCXT standard symbol
            let ccxt_symbol = await TradepairQueries.id_to_symbol(exchange, symbol)

            let table_name = util.orderbook_name(exchange, ccxt_symbol)

            await DB_LAYER.orderbook_table_check(table_name)
            await DB_LAYER.orderbook_replace(table_name, { time: snapshot_time, orderbook })

            // Store snapshot in redis for 600 sec
            Redis.set(table_name, JSON.stringify(orderbook), "EX", 600)
          })
        })
      })
    })
  }
}

module.exports = new Orderbook_emitter()
