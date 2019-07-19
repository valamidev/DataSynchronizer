"use strict";
require("dotenv").config();

const Warden = require("./index");

test("Warden Select Symbols", async () => {
  let result = await Warden.select_symbols("kucoin", "BTC", 10);

  expect(result).toBeDefined();
});

test("Warden Start", async () => {
  let result = await Warden.start(["kucoin", "binance"], ["BTC"], [10]);

  expect(result).toBeUndefined();
});
