"use strict";

const exchangeAPI = require("./index");

test("Add first exchange", async () => {
  let exchange = exchangeAPI.init_new_exchanges("binance");

  expect(exchange.api.tokenBucket).toBeDefined();
});

test("Load first exchange", async () => {
  let exchange = exchangeAPI.load_exchange_api("kucoin");

  expect(exchange.tokenBucket).toBeDefined();
});

test("Candlestick check default length", async () => {
  let result = await exchangeAPI.get_candlestick("BTC/USDT", "binance", "1m");

  expect(result.length).toBe(250);
});
