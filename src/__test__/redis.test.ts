/* eslint-disable no-undef */
require("dotenv").config()

import {Redis,Redis_pub} from "../redis/redis"

test("Redis Connection test", async () => {
  Redis.set("foo_bar_test", "bar")
  let result = await Redis.get("foo_bar_test")
  Redis.del("foo_bar_test")

  expect(result).toBe("bar")
})

test("Redis publish disabled test", async () => {
  expect(() => {
    Redis.publish("news", "Hello world!")
  }).toThrow()
})

test("Redis subscribe disabled test", async () => {
  expect(() => {
    Redis_pub.subscribe()
  }).toThrow()
})
