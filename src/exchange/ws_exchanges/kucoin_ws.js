"use strict"

const Emitter = require("../../emitter/emitter")

// Kucoin things
const exchange_name = "kucoin"
const default_interval = 60

const Kucoin_API = require("kucoin-websocket-api")
const client = new Kucoin_API()
// Kucoin things

const open_socket = async (symbol) => {
  let result = await client.MarketMatches(symbol, (trade) => {
    // Kucoin use ns for timestamp

    trade = {
      time: parseInt(trade.time / 10e6),
      symbol: trade.symbol,
      side: trade.side,
      quantity: trade.size,
      price: trade.price,
      tradeId: trade.tradeId
    }

    Emitter.emit("Trades", exchange_name, trade)
  })

  // Needed to close connection
  return result
}

module.exports = open_socket
