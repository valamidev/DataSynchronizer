"use strict"

const util = require("../../utils")
const Emitter = require("../../emitter/emitter")

// Binance things
const exchange_name = "binance"
const default_interval = 60

const Binance = require("binance-api-node").default
const client = new Binance()
// Binance things

const open_socket = async (symbol, interval = default_interval) => {
  interval = util.interval_toString(interval)

  let socket_candle = await client.ws.candles(symbol, interval, (candle) => {
    Emitter.emit("CandleUpdate", exchange_name, interval, candle)

    if (candle.isFinal == true) {
      Emitter.emit("CandleUpdateFinal", exchange_name, interval, candle)
    }
  })

  let socket_trades = await client.ws.aggTrades(symbol, (trade) => {
    trade = {
      time: trade.eventTime,
      symbol: trade.symbol,
      side: trade.maker == true ? "buy" : "sell",
      quantity: trade.quantity,
      price: trade.price,
      tradeId: trade.tradeId
    }

    Emitter.emit("Trades", exchange_name, trade)
  })

  let socket_orderbook = await client.ws.depth(symbol, (depth) => {
    /*
      {
        eventType: 'depthUpdate',
        eventTime: 1564411435348,
        symbol: 'BTCUSDT',
        firstUpdateId: 905213181,
        finalUpdateId: 905213198,
        bidDepth: [
          { price: '9558.02000000', quantity: '0.11576700' },
          { price: '9552.36000000', quantity: '0.00000000' }
        ],
        askDepth: [
          { price: '9558.98000000', quantity: '0.00100800' },
          { price: '9566.05000000', quantity: '0.00000000' },
        ]
      }
    */
    let asks = depth.askDepth.map((e) => {
      return { price: e.price, size: e.quantity }
    })
    let bids = depth.bidDepth.map((e) => {
      return { price: e.price, size: e.quantity }
    })

    let update_depth = { symbol: depth.symbol, asks, bids }

    Emitter.emit("Orderbook", exchange_name, update_depth)
  })

  // Needed to close connection
  return () => {
    socket_candle()
    socket_trades()
    socket_orderbook()
  }
}

module.exports = open_socket
