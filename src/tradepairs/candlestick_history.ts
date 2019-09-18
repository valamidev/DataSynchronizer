// Load Exchanges
"use strict"
// Load Exchange APIs
import {CCXT_API} from "../exchange/ccxt_controller"
import {logger} from "../logger"
import * as _ from "lodash"

const util = require("../utils")
const DB_LAYER = require("../database/queries")


const ccxt_candlelimit = {
  binance: 500
}

const base_interval = 60

class Candlestick {
  exchange: any
  symbol: string
  history_limit: number
  interval: number
  intervalString: string
  tableName: string
  history_data: any[]
  constructor(exchange:string, symbol:string, history_limit:number = 300) {
    this.exchange = exchange
    this.symbol = symbol
    this.history_limit = history_limit
    this.interval = base_interval
    this.intervalString = util.interval_toString(this.interval)
    this.tableName = util.candlestick_name(exchange, symbol, this.interval)

    this.history_data = []
    // Check Table and Data integrity
  }

  async start() {
    try {
      await DB_LAYER.candlestick_table_check(this.tableName)

      logger.verbose(`Candlestick history build start for: ${this.exchange}-${this.symbol}-${this.intervalString}`)
      await this.init_build_history()

      let candle_data = await DB_LAYER.candlestick_select_all(this.tableName)

      let integrity_check = util.candlestick_data_integrity(candle_data, this.interval)

      if (integrity_check.length > 0) {
        logger.verbose(`Candlestick history data integrity error in ${this.exchange}-${this.symbol} ${integrity_check.length} times`)
      }

      logger.verbose(`Candlestick history build finished for: ${this.exchange}-${this.symbol}-${this.intervalString}`)

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
      let check_size = await DB_LAYER.candlestick_history_size(this.tableName)

      if (check_size > this.history_limit) {
        return
      }

      if (Array.isArray(ticks)) {
        if (ticks.length == 1) {
          return
        }

        await DB_LAYER.candlestick_replace(this.tableName, ticks)
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

  async get_ticks(startTime: number) {
    try {
      let ticks:any[] = []

      ticks = await CCXT_API.get_candlestick(this.symbol, this.exchange, this.intervalString, startTime, ccxt_candlelimit[this.exchange])

      // https://github.com/ccxt/ccxt/issues/2937
      // Last Candle can be unfinished always
      if (ticks.length > 0) {
        if (Number(_.last(ticks)[0]) + this.interval * 1000 > _.now()) {
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
