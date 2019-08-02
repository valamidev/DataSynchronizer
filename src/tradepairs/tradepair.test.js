/* eslint-disable no-undef */
"use strict"
require("dotenv").config()

const TradepairDB = require("./tradepairs")

// Add Binance exhcange
test("Get BCHABC-ETH symbol", async () => {
  let symbol = await TradepairDB.id_to_symbol("kucoin", "BCHABC-ETH")

  let symbol_cache = ""

  for (let i = 0; i < 1000; i++) {
    symbol_cache = await TradepairDB.id_to_symbol("kucoin", "BCHABC-ETH")
  }

  expect(symbol == symbol_cache).toBe(true)
})
