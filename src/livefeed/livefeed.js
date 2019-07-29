"use strict"

const _ = require("lodash")
const logger = require("../logger")
const { pool } = require("../database")

const open_socket = {}

// Exchange Websockets
open_socket["binance"] = require("../exchange/ws_exchanges/binance_ws")
open_socket["kucoin"] = require("../exchange/ws_exchanges/kucoin_ws")
// Exchange Websockets

class LivefeedAPI {
  constructor() {
    this.tradepairs = []
    this.exchanges = []
    this.websocket_api = {}

    this.watcher_timeout = 30 * 1000 // 5 min
  }

  async start(exchanges) {
    try {
      this.exchanges = exchanges

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

      // There is no new tradepairs
      if (_.isEqual(new_symbols, old_symbols) == true) {
        return
      } else {
        this.tradepairs = tradepairs
      }

      for (let i = 0; i < this.exchanges.length; i++) {
        const exchange = this.exchanges[i]

        if (typeof this.websocket_api[exchange] != "undefined") {
          logger.info(`Close old websocket ${exchange}`)
          this.websocket_api[exchange]()
        }
        // Open Websockets
        await this.open_websocket_candlestick(exchange)

        logger.info(`Load new websocket ${tradepairs.length} for ${exchange}`)
      }
    } catch (e) {
      logger.error("Livefeed Tradepairs watcher error ", e)
    } finally {
      setTimeout(() => {
        this.tradepairs_watcher()
      }, this.watcher_timeout)
    }
  }

  async open_websocket_candlestick(exchange) {
    let websocket_symbol_ids = []

    for (let i = 0; i < this.tradepairs.length; i++) {
      const tradepair = this.tradepairs[i]

      if (tradepair.exchange == exchange) {
        websocket_symbol_ids.push(tradepair.id)
      }
    }

    this.websocket_api[exchange] = await open_socket[exchange](websocket_symbol_ids)
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
