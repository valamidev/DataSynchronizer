"use strict"

const _ = require("lodash")
const logger = require("../logger")
const { pool } = require("../database")

const TradepairsDB = require("../tradepairs/tradepairs")

/* Warden intelligent Symbol following system it help to follow new coins or unfollow inactive ones */

class Warden {
  constructor() {
    this.warden_symbols = []
    this.exchanges = []
    this.quotes = []
    this.quote_limits = []
  }

  async start(exchanges, quotes, quote_limits) {
    try {
      this.exchanges = exchanges

      if (this.quotes.length != this.quote_limits.length) {
        throw "Quotes and quotes limit are not defined correctly!"
      }

      this.quotes = quotes
      this.quote_limits = quote_limits

      await this.update_loop()

      logger.verbose("Warden System started")

      return
    } catch (e) {
      logger.error("Warden System ", e)
    }
  }

  async update_loop() {
    try {
      let update_promises = []

      for (let i = 0; i < this.exchanges.length; i++) {
        const exchange = this.exchanges[i]

        for (let j = 0; j < this.quotes.length; j++) {
          const quote = this.quotes[j]
          const limit = this.quote_limits[j]

          update_promises.push(this.select_symbols(exchange, quote, limit))
        }
      }

      let results = await Promise.all(update_promises)

      results = _.flatten(results)

      // Update Tradepairs
      let time = Date.now()

      results.map(async (elem) => {
        await TradepairsDB.add_tradepair(elem.exchange, elem.symbol, elem.id, elem.baseId, elem.quoteId, 1, time)
      })
    } catch (e) {
      logger.error("Warden update loop ", e)
    } finally {
      setTimeout(async () => {
        this.update_loop()
      }, 60 * 1000)
    }
  }

  /* Add Warden results into the Tradepairs */

  /* Database queries */
  async select_symbols(exchange, quote, limit) {
    try {
      let [rows] = await pool.query(
        "SELECT m.exchange, m.symbol, m.id ,m.baseId,m.quoteId FROM `market_datas` as m JOIN `price_tickers` as p ON m.exchange = p.exchange AND m.symbol = p.symbol WHERE m.active = 1 and m.exchange = ? and m.quoteId = ?  order by p.quoteVolume desc;",
        [exchange, quote]
      )

      if (rows.length > 0) {
        return _.take(rows, limit)
      }

      return []
    } catch (e) {
      logger.error("Warden SQL error", e)
    }
  }
}

module.exports = new Warden()
