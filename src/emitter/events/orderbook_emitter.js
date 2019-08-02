"use strict"

const util = require("../../utils")
const logger = require("../../logger")
const Emitter = require("../emitter")

const { OrderBookStore } = require("orderbook-synchronizer")
const memory_limit = 1024
const Orderbooks = {}

const TradepairDB = require("../../tradepairs/tradepairs")
const DB_LAYER = require("../../database/queries")
const { Redis } = require("../../redis/redis")

class Orderbook_emitter {
  constructor() {
    // Event listeners
    logger.verbose("Orderbook Emitter started!")

    Emitter.on("Orderbook", (exchange, depth) => {
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
                Orderbooks[exchange.toLowerCase()].updateOrderBook(symbol, orderbook_snapshot.ask, orderbook_snapshot.bid)
              }
            }
          } catch (e) {
            logger.error("Orderbook snapshot error", e)
          }
        })
      }

      Orderbooks[exchange].updateOrderBook(symbol, asks, bids)
    })

    Emitter.on("OrderbookSnapshot", (snapshot_time) => {
      Object.keys(Orderbooks).map((exchange) => {
        let symbols = Orderbooks[exchange]._symbols

        symbols.forEach((symbol) => {
          setImmediate(async () => {
            let orderbook = Orderbooks[exchange].getOrderBook(symbol)
            // Get CCXT standard symbol
            let ccxt_symbol = await TradepairDB.id_to_symbol(exchange, symbol)

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
