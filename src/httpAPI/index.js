/* eslint-disable require-atomic-updates */
"use strict"
const _ = require("lodash")
const logger = require("../logger")
const Koa = require("koa")
const Router = require("koa-router")
const parse = require("co-body")
const cors = require("@koa/cors")

const app = new Koa()
app.use(cors())

class HttpAPI {
  constructor(port) {
    app.listen(port)
  }

  add_candle_history(name, hisotry_builder) {
    let router = new Router({
      prefix: `/${name}`
    })

    router.post("/", async (ctx) => {
      let post = await parse(ctx)

      post = JSON.parse(post)

      const builder = new hisotry_builder(post.exchange, post.symbol, post.limit)

      let result = await builder.start()

      ctx.body = result
    })

    app.use(router.routes()).use(router.allowedMethods())
  }
}

module.exports = HttpAPI
