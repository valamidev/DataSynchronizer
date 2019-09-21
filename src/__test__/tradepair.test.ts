/* eslint-disable no-undef */
"use strict"
require("dotenv").config()
process.env.log_level = "info"

import {TradepairQueries} from '../tradepairs/tradepairs'

// Add Binance exhcange
test("Get BCHABC-ETH symbol", async () => {
  let symbol = await TradepairQueries.id_to_symbol("kucoin", "BCHABC-ETH")

  
  let symbol_cache = ""

  for (let i = 0; i < 10; i++) {
    symbol_cache = await TradepairQueries.id_to_symbol("kucoin", "BCHABC-ETH")
  }

  expect(symbol == symbol_cache).toBe(true)
})
