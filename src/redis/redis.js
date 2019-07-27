"use strict"
const Redis = require("ioredis")

const redis_conf = {
  port: process.env.REDIS_PORT, // Redis port
  host: process.env.REDIS_HOST, // Redis host
  family: 4, // 4 (IPv4) or 6 (IPv6)
  password: process.env.REDIS_AUTH,
  db: process.env.REDIS_DB_ID
}

//
//https://github.com/luin/ioredis#pubsub
//
// Subscription connection it cannot be used for Publish!
const redis = new Redis(redis_conf)
redis.publish = () => {
  throw new Error("Subscription connection cannot be used for publish!")
}
// Publish connection it can be used only for Publish!
const redis_pub = new Redis(redis_conf)
redis_pub.subscribe = () => {
  throw new Error("Publisher connection cannot be used for subscribe!")
}

module.exports = { redis, redis_pub }
