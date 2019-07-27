/* eslint-disable no-undef */
"use strict"
require("dotenv").config()

const { Redis, Redis_pub } = require("./redis")

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
