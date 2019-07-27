"use strict"

const Emitter = require("../../emitter/emitter")

const { Redis_pub } = require("../redis")

Emitter.on("CandleUpdate", (exchange, interval, candle) => {
  setImmediate(() => {
    Redis_pub.publish("CandleUpdate", JSON.stringify({ exchange, interval, candle }))
  })
})

/* Receive code */
/*
const { Redis } = require("../index")


Redis.subscribe("CandleUpdate", function(err, count) {
  console.log("Redis pub/sub channel subscribed count", count)
})

Redis.on("message", function(channel, message) {
  console.log("Receive message %s from channel %s", message, channel)
})
*/
