"use strict";
require("dotenv").config();

const PriceTickers = require("./index");

test("PriceTicker save", async () => {
  let result = await PriceTickers.update("kucoin");

  expect(result).toBeUndefined();
});
