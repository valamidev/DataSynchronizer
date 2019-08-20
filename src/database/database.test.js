/* eslint-disable no-undef */
"use strict"
require("dotenv").config()

const { pool, candle_db } = require("./index")

test("Check connections", async () => {
  expect(pool._eventsCount).toBe(2)
  expect(candle_db._eventsCount).toBe(2)
})
