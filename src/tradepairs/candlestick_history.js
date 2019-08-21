// Load Exchanges
"use strict"
// Load Exchange APIs
const CCXT_API = require("../exchange/ccxt_controller")
const logger = require("../logger")
const util = require("../utils")
const DB_LAYER = require("../database/queries")
const _ = require("lodash")

const ccxt_candlelimit = {
  binance: 500
}

const base_interval = 60

class Candlestick {
  constructor(exchange, symbol, history_limit = 300) {
    this.exchange = exchange
    this.symbol = symbol
    this.history_limit = history_limit
    this.interval = base_interval
    this.interval_string = util.interval_toString(this.interval)
    this.table_name = util.candlestick_name(exchange, symbol, this.interval)

    this.history_data = []
    // Check Table and Data integrity
  }

  async start() {
    try {
      await DB_LAYER.candlestick_table_check(this.table_name)

      logger.verbose(`Candlestick history build start for: ${this.exchange}-${this.symbol}-${this.interval_string}`)
      await this.init_build_history()

      let candle_data = await DB_LAYER.candlestick_select_all(this.table_name)

      let integrity_check = util.candlestick_data_integrity(candle_data, this.interval)

      if (integrity_check.length > 0) {
        logger.verbose(`Candlestick history data integrity error in ${this.exchange}-${this.symbol} ${integrity_check.length} times`)
      }

      logger.verbose(`Candlestick history build finished for: ${this.exchange}-${this.symbol}-${this.interval_string}`)

      return "Done"
    } catch (err) {
      logger.error("Error", err)
      return err
    }
  }

  async init_build_history(startTime = 0) {
    try {
      // Check first timestamp and go forward
      if (startTime == 0) {
        startTime = Date.now() - this.history_limit * this.interval * 1000
      }

      let ticks = await this.get_ticks(startTime)

      // Check history limit
      let check_size = await DB_LAYER.candlestick_history_size(this.table_name)

      if (check_size > this.history_limit) {
        return
      }

      if (Array.isArray(ticks)) {
        if (ticks.length == 1) {
          return
        }

        await DB_LAYER.candlestick_replace(this.table_name, ticks)
        startTime = ticks[ticks.length - 1][0]
        logger.verbose(`Tick length: ${ticks.length}`)
      } else {
        startTime = startTime + ccxt_candlelimit[this.exchange] * this.interval * 1000
      }

      logger.verbose(`Time: ${startTime}`)

      await this.init_build_history(startTime)
    } catch (e) {
      logger.error("Error", e)
    }
  }

  async get_ticks(startTime) {
    try {
      let ticks = []

      ticks = await CCXT_API.get_candlestick(this.symbol, this.exchange, this.interval_string, startTime, ccxt_candlelimit[this.exchange])

      // https://github.com/ccxt/ccxt/issues/2937
      // Last Candle can be unfinished always
      if (ticks.length > 0) {
        if (_.last(ticks)[0] + this.interval * 1000 > _.now()) {
          ticks.pop()
        }
      }

      return ticks
    } catch (e) {
      logger.error("", e)
    }
  }
}

module.exports = Candlestick
