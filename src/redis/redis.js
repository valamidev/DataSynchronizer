"use strict"
const IORedis = require("ioredis")

const redis_conf = {
  port: process.env.REDIS_PORT, // Redis port
  host: process.env.REDIS_HOST, // Redis host
  family: 4, // 4 (IPv4) or 6 (IPv6)
  password: process.env.REDIS_AUTH,
  db: process.env.REDIS_DB_ID,
  retryStrategy: function(times) {
    var delay = Math.min(times * 50, 2000)
    return delay
  }
}

//
//https://github.com/luin/ioredis#pubsub
//
// Subscription connection it cannot be used for Publish!
const Redis = new IORedis(redis_conf)
Redis.publish = () => {
  throw new Error("Subscription connection cannot be used for publish!")
}
// Publish connection it can be used only for Publish!
const Redis_pub = new IORedis(redis_conf)
Redis_pub.subscribe = () => {
  throw new Error("Publisher connection cannot be used for subscribe!")
}

module.exports = { Redis, Redis_pub }
