"use strict"

const Emitter = require("../../emitter/emitter")

// Kucoin things
const exchange_name = "kucoin"
const default_interval = 60

const Kucoin_API = require("kucoin-websocket-api")
const client = new Kucoin_API()
// Kucoin things

const open_socket = async (symbol) => {
  let socket_trades = await client.MarketMatches(symbol, (trade) => {
    // Kucoin use ns for timestamp

    trade = {
      time: parseInt(trade.time / 10e5),
      symbol: trade.symbol,
      side: trade.side,
      quantity: trade.size,
      price: trade.price,
      tradeId: trade.tradeId
    }

    Emitter.emit("Trades", exchange_name, trade)
  })

  let socket_orderbook = await client.MarketLevel2(symbol, (depth) => {
    // Kucoin use ns for timestamp
    /*
      sequenceStart: 1556425985882,
      symbol: 'XRP-BTC',
      changes: { asks: [], bids: [ [ '0.00003232', '5240.6325', '1556426078793' ] ] }, 
      sequenceEnd: 1556425985882
    */
    // console.log(order_book_update.changes)
    let asks = depth.changes.asks.map((e) => {
      return { price: e[0], size: e[1] }
    })
    let bids = depth.changes.bids.map((e) => {
      return { price: e[0], size: e[1] }
    })

    let update_depth = { symbol: depth.symbol, asks, bids }

    Emitter.emit("Orderbook", exchange_name, update_depth)
  })

  // Needed to close connection
  return () => {
    socket_trades()
    socket_orderbook()
  }
}

module.exports = open_socket
