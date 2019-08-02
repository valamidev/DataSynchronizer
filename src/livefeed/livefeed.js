"use strict"

const _ = require("lodash")
const logger = require("../logger")

const TradepairsDB = require("../tradepairs/tradepairs")

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

    this.watcher_timeout = 5 * 60 * 1000 // 5 minute
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
      let tradepairs = await TradepairsDB.select_tradepairs_all()

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

        logger.info(`Load new websocket for ${exchange}`)
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
}

module.exports = new LivefeedAPI()
