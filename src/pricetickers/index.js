"use strict";

const logger = require("../logger");
const pool = require("../database");
const CCXT_API = require("../exchange");

class PriceTickers {
  constructor() {
    this.exchanges = [];
    this.update_frequency = 5 * 1000; // in ms
  }

  async start(exchanges) {
    try {
      this.exchanges = exchanges;

      await this.update_loop();
    } catch (e) {
      logger.error("PriceTickers start ", e);
    }
  }

  async update_loop() {
    try {
      let update_promises = [];

      for (let i = 0; i < this.exchanges.length; i++) {
        let exchange = this.exchanges[i];

        update_promises.push(this.update(exchange));
      }

      if (update_promises.length > 0) {
        logger.verbose(`Marketdata Update loop`);
        await Promise.all(update_promises);
      }
    } catch (e) {
      logger.error("Marketdata Update ", e);
    } finally {
      setTimeout(() => {
        this.market_data_update_loop();
      }, this.update_frequency);
    }
  }

  async update(exchange) {
    // Looking after new tradepairs!
    try {
      let price_tickers = [];

      price_tickers = await CCXT_API.get_pricetickers(exchange);

      let time = Date.now();

      // Add exchange / time into PriceTickers
      price_tickers = Object.values(price_tickers).map(elem => {
        elem.exchange = exchange;
        elem.timestamp = time;

        return elem;
      });

      if (price_tickers.length > 0) {
        await this.replace_db(price_tickers);
      }

      return;
    } catch (e) {
      logger.error("Update_tradepairs", e);
    }
  }

  async replace_db(price_tickers) {
    try {
      // Stringify JSONs for database storage
      price_tickers = price_tickers.map(e => {
        // Convert to simple array
        return [
          e.exchange,
          e.symbol,
          e.timestamp,
          e.high,
          e.low,
          e.bid,
          e.ask,
          e.last,
          e.change,
          e.percentage,
          e.baseVolume,
          e.quoteVolume,
          JSON.stringify(e.info)
        ];
      });

      await pool.query(
        "REPLACE INTO `price_tickers` (`exchange`, `symbol`, `timestamp`, `high`, `low`, `bid`, `ask`, `last`, `change`, `percentage`, `baseVolume`, `quoteVolume`, `info`) VALUES ?",
        [price_tickers]
      );

      return;
    } catch (e) {
      logger.error("Error", e);
    }
  }
}

module.exports = new PriceTickers();
