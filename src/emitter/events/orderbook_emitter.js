"use strict"

const util = require("../../utils")
const logger = require("../../logger")
const Emitter = require("../emitter")

const OrderbookStore = require("orderbook-synchronizer")
const memory_limit = 1024
const Orderbooks = {}

const DB_LAYER = require("../../database/queries")

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

      // console.log(exchange.toLowerCase(), symbol, Orderbooks[exchange.toLowerCase()].getOrderBook(symbol))
    })

    Emitter.on("OrderbookSnapshot", (snapshot_time) => {
      Object.entries(Orderbooks).map((exchanges) => {
        //  console.log(exchanges, snapshot_time)
      })

      // console.log(exchange.toLowerCase(), symbol, Orderbooks[exchange.toLowerCase()].getOrderBook(symbol))
    })
  }
}

module.exports = new Orderbook_emitter()
