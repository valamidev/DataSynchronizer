/* eslint-disable no-undef */
"use strict"
require("dotenv").config()

const exchangeAPI = require("./ccxt_controller")

// Add Binance exhcange
test("Add valid exchange", async () => {
  let exchange = exchangeAPI.init_new_exchanges("binance")

  expect(exchange.api.tokenBucket).toBeDefined()
})

// Add non-exist exchange should be Throwed
test("Add invalid exchange", () => {
  expect(() => {
    exchangeAPI.init_new_exchanges("binancesdfsadf")
  }).toThrow()
})

// Load+Init Valid exchange
test("Load first exchange", async () => {
  let exchange = exchangeAPI.load_exchange_api("kucoin")

  expect(exchange.tokenBucket).toBeDefined()
})

// Get Marketdata
test("Marketdata check", async () => {
  let result = await exchangeAPI.get_marketdata("kucoin")

  expect(result).toBeTruthy()
})

// Get PriceTickers
test("Pricetickers check", async () => {
  let result = await exchangeAPI.get_pricetickers("kucoin")

  expect(result).toBeTruthy()
})
