"use strict"

const _ = require("lodash")
const logger = require("../logger")
const { pool } = require("../database")

const open_socket = require("../exchange/ws_exchanges/binance_ws")

class LivefeedAPI {
  constructor() {
    this.tradepairs = []

    /* TODO multi exchange support! */
    this.binance_websocket = () => {}

    this.watcher_timeout = 5 * 60 * 1000 // 5 min
  }

  async start() {
    try {
      await this.tradepairs_watcher()

      logger.info("Livefeed API started")
    } catch (e) {
      logger.error("Livefeed start ", e)
    }
  }

  async tradepairs_watcher() {
    // Looking after new tradepairs!
    try {
      let tradepairs = await this.select_tradepairs_all()

      let new_symbols = tradepairs.map((elem) => elem.symbol)
      let old_symbols = this.tradepairs.map((elem) => elem.symbol)

      if (_.isEqual(new_symbols, old_symbols) == false) {
        this.tradepairs = tradepairs
        logger.info(`Load new websocket ${tradepairs.length}`)

        /* TODO multi exchange support! */
        this.binance_websocket()
        this.open_websocket_candlestick("binance")
      }

      return
    } catch (e) {
      logger.error("Livefeed Tradepairs watcher error ", e)
    } finally {
      setTimeout(() => {
        this.tradepairs_watcher()
      }, this.watcher_timeout)
    }
  }

  open_websocket_candlestick(exchange) {
    let websocket_symbol_ids = []

    for (let i = 0; i < this.tradepairs.length; i++) {
      const tradepair = this.tradepairs[i]

      if (tradepair.exchange == exchange) {
        websocket_symbol_ids.push(tradepair.id)
      }
    }

    /* TODO multi exchange support! */
    this.binance_websocket = open_socket(websocket_symbol_ids)
  }

  async select_tradepairs_all() {
    try {
      // Warden timeout limit 10 minutes
      let time = Date.now() - 600 * 1000

      let [rows] = await pool.query(
        "SELECT m.exchange,m.id,m.symbol,m.baseId,m.quoteId,t.interval_sec FROM `tradepairs` as t JOIN `market_datas` as m ON t.symbol = m.symbol AND t.exchange = m.exchange  WHERE t.is_warden = 0 OR (t.is_warden = 1 AND t.time > ?) ORDER BY t.`asset` ASC;",
        [time]
      )

      return rows
    } catch (e) {
      logger.error("SQL error", e)
    }
  }
}

module.exports = new LivefeedAPI()
