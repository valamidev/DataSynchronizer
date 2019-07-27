"use strict"

const util = require("../../utils")
const Emitter = require("../../emitter/emitter")

// Binance things
const exchange_name = "binance"
const default_interval = 60

const Binance = require("binance-api-node").default
const client = new Binance()
// Binance things

function open_socket(symbol, interval = default_interval) {
  interval = util.interval_toString(interval)

  let result = client.ws.candles(symbol, interval, (candle) => {
    Emitter.emit("CandleUpdate", exchange_name, interval, candle)
  })

  // Needed to close connection
  return result
}

module.exports = open_socket
