"use strict";

const logger = require("../logger");
const { pool } = require("../database");

const ExchangeAPI = require("../exchange/Binance");

class LivefeedAPI {
  constructor() {
    this.live_symbols = [];
  }

  async start() {
    try {
      await this.load_symbols();

      /* TODO be sure that it can re-open on error */
      await this.open_websocket_candlestick();

      await this.livefeed_update_loop();

      logger.info("Livefeed API started");
    } catch (e) {
      logger.error("Livefeed start ", e);
    }
  }

  async livefeed_update_loop() {
    try {
      let cleantime =
        Date.now() - process.env.livefeed_history_size * 3600 * 1000;
      // Remove old livefeed records
      await this.clean_livefeed(cleantime);
    } catch (e) {
      logger.error("Livefeed_update_loop ", e);
    } finally {
      setTimeout(async () => {
        this.livefeed_update_loop();
      }, 3600 * 1000);
    }
  }

  async load_symbols() {
    try {
      let [rows] = await pool.query(
        "SELECT * FROM `livefeed_binance_symbols`;"
      );

      if (rows) {
        this.live_symbols = rows;
      }
    } catch (e) {
      logger.error("SQL error", e);
    }
  }

  async open_websocket_candlestick() {
    let symbols = [];

    for (let i = 0; i < 420; i++) {
      symbols.push(this.live_symbols[i].symbol);
    }

    ExchangeAPI.candlestick_websocket_multi(
      symbols,
      300, // 5 min
      this.websocket_update
    );
  }

  // Callback function for Websocket!
  async websocket_update(result) {
    try {
      /*{ e: 'kline',
          E: 1557051170293,
          s: 'LTCUSDT',
          k:
          { t: 1557051000000,
            T: 1557051299999,
            s: 'LTCUSDT',
            i: '5m',
            f: 19746910,
            L: 19747182,
            o: '76.29000000',
            c: '76.15000000',
            h: '76.34000000',
            l: '75.92000000',
            v: '2009.45861000',
            n: 273,
            x: false,
            q: '152850.85966330',
            V: '839.11550000',
            Q: '63819.00345040',
            B: '0' } } */
      let time = Date.now();

      let data = [
        time,
        result.s,
        result.k.t,
        result.k.o,
        result.k.h,
        result.k.l,
        result.k.c,
        result.k.v,
        result.k.n,
        result.k.x
      ];

      await pool.query(
        "INSERT INTO `livefeed_binance_5m` (`time`, `symbol`, `startTime`, `open`, `high`, `low`, `close`, `volume`, `trades`, `final`) VALUES ?;",
        [[data]]
      );
    } catch (e) {
      logger.error("SQL error", e);
    }
  }

  /* Database queries */

  async clean_livefeed(time) {
    try {
      await pool.query("DELETE FROM `livefeed_binance_5m` WHERE time < ?;", [
        time
      ]);
    } catch (e) {
      logger.error("SQL error", e);
    }
  }

  async save_livefeed_symbols(symbols) {
    try {
      await pool.query(
        "REPLACE INTO `livefeed_binance_symbols` (`symbol`, `priceChange`, `priceChangePercent`, `weightedAvgPrice`, `prevClosePrice`, `lastPrice`, `lastQty`, `bidPrice`, `bidQty`, `askPrice`, `askQty`, `openPrice`, `highPrice`, `lowPrice`, `volume`, `quoteVolume`, `openTime`, `closeTime`, `firstId`, `lastId`, `count`) VALUES ?",
        [symbols]
      );
    } catch (e) {
      logger.error("SQL error", e);
    }
  }
}

module.exports = new LivefeedAPI();
