"use strict"

const util = require("../../utils")
const logger = require("../../logger")
const Emitter = require("../emitter")

const OrderbookStore = require("orderbook-synchronizer")
const memory_limit = 1024
const Orderbooks = {}

const DB_LAYER = require("../../database/queries")
const { Redis } = require("../../redis/redis")

class Orderbook_emitter {
  constructor() {
    // Event listeners
    logger.verbose("Orderbook Emitter started!")

    Emitter.on("Orderbook", (exchange, depth) => {
      if (typeof Orderbooks[exchange.toLowerCase()] == "undefined") {
        Orderbooks[exchange.toLowerCase()] = new OrderbookStore(memory_limit)
      }

      let { symbol, asks, bids } = depth

      Orderbooks[exchange.toLowerCase()].updateOrderBook(symbol, asks, bids)
    })

    Emitter.on("OrderbookSnapshot", (snapshot_time) => {
      /* TODO make it less ugly */
      Object.entries(Orderbooks).map((Orderbook) => {
        //[ [ 'kucoin', OrderBookStore { _data: { ]
        let exchange = Orderbook[0]

        Object.entries(Orderbook[1]._data).map((elem) => {
          // kucoin 1564487760000 [ 'CAG-BTC', { ask: [], bid: [] } ]
          // exchange, snapshot_time, elem[0], elem[1])

          setImmediate(async () => {
            let table_name = util.orderbook_name(exchange, elem[0])

            await DB_LAYER.orderbook_table_check(table_name)
            await DB_LAYER.orderbook_replace(table_name, { time: snapshot_time, orderbook: elem[1] })

            // Store snapshot in redis for 600 sec
            Redis.set(table_name, elem[1], "EX", 600)
          })
        })
      })
    })
  }
}

module.exports = new Orderbook_emitter()
