"use strict";
require("dotenv").config();

const Marketdata = require("./index");

test("Marketdata save", async () => {
  let result = await Marketdata.update_market_data("kucoin");

  expect(result).toBeUndefined();
});
