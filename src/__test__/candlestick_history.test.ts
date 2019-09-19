/* eslint-disable no-undef */
"use strict"
require("dotenv").config()

process.env.log_level = "info"

jest.setTimeout(300000)

const Candle_History_Builder = require("../tradepairs/candlestick_history")

// Add Binance exhcange
test("Get BTC/USDT History", async () => {
  const Candle_history = new Candle_History_Builder("binance", "BTC/USDT", 100)

  await Candle_history.start()

  expect(true).toBe(true)
})
