"use strict"
require("dotenv").config()

const PriceTickers = require("../pricetickers/index")

test("PriceTicker save", async () => {
  const result = await PriceTickers.update("binance")

  expect(result).toBeUndefined()
})
