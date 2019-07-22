"use strict";

const logger = require("../logger");
const { pool } = require("../database");

const open_socket = require("../exchange/ws_exchanges/binance_ws");

const Candlestick_emitter = require("./candlestick_emitter");

class LivefeedAPI {
  constructor() {
    this.tradepairs = [];

    this.binance_websocket;
  }

  async start() {
    try {
      this.tradepairs = await this.select_tradepairs_all();

      this.open_websocket_candlestick("binance");

      logger.info("Livefeed API started");
    } catch (e) {
      logger.error("Livefeed start ", e);
    }
  }

  open_websocket_candlestick(exchange) {
    let websocket_symbol_ids = [];

    for (let i = 0; i < this.tradepairs.length; i++) {
      const tradepair = this.tradepairs[i];

      if (tradepair.exchange == exchange) {
        websocket_symbol_ids.push(tradepair.id);
      }
    }

    this.binance_websocket = open_socket(websocket_symbol_ids);
  }

  async select_tradepairs_all() {
    try {
      // Warden timeout limit 10 minutes
      let time = Date.now() - 600 * 1000;

      let [rows] = await pool.query(
        "SELECT m.exchange,m.id,m.symbol,m.baseId,m.quoteId,t.interval_sec FROM `tradepairs` as t JOIN `market_datas` as m ON t.symbol = m.symbol AND t.exchange = m.exchange  WHERE t.is_warden = 0 OR (t.is_warden = 1 AND t.time > ?) ORDER BY t.`asset` ASC;",
        [time]
      );

      return rows;
    } catch (e) {
      logger.error("SQL error", e);
    }
  }
}

module.exports = new LivefeedAPI();
