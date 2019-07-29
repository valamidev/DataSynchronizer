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

  // Needed to close connection
  return () => {
    socket_candle()
    socket_trades()
  }
}

module.exports = open_socket
