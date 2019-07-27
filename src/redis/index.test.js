/* eslint-disable no-undef */
"use strict"
require("dotenv").config()

const { redis, redis_pub } = require("./index")

test("Redis Connection test", async () => {
  redis.set("foo_bar_test", "bar")
  let result = await redis.get("foo_bar_test")
  redis.del("foo_bar_test")

  expect(result).toBe("bar")
})

test("Redis publish disabled test", async () => {
  expect(() => {
    redis.publish("news", "Hello world!")
  }).toThrow()
})

test("Redis subscribe disabled test", async () => {
  expect(() => {
    redis_pub.subscribe()
  }).toThrow()
})
