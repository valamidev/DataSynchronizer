"use strict";
const util = require("../../utils");
const binance = require("node-binance-api")().options({
  APIKEY: process.env.BINANCE_APIKEY,
  APISECRET: process.env.BINANCE_APISECRET,
  useServerTime: true, // If you get timestamp errors, synchronize to server time at startup
  recvWindow: 10000
});

class BINANCE_API {
  constructor() {
    this.time = 0;
    this.set_time();
    this.time_delay = 0;
  }

  set_time() {
    // https://api.binance.com/api/v1/time
    binance.time((error, time) => {
      this.time = time.serverTime;
      this.time_delay = Date.now() - time.serverTime;
    });
  }

  // "BNBBTC" , "5m"  Optional parameters: limit (max/default 500), startTime, endTime.
  // Wrap the callback into a promise

  promise_get_candlestick(symbol, interval, options = { endTime: null }) {
    // Remove null values from option
    options = util.removeFalsy(options);

    return new Promise((resolve, reject) => {
      binance.candlesticks(
        symbol,
        interval,
        (error, ticks) => {
          if (error) {
            reject(error);
          } else {
            // Remove unfinished ticks!
            let filtered_ticks = ticks.filter(elem => {
              if (elem[6] <= Date.now()) return elem;
            });

            resolve(filtered_ticks);
          }
        },
        options
      );
    });
  }

  promise_get_exchangeInfo() {
    // Return All Symbol with latest price
    return new Promise((resolve, reject) => {
      binance.exchangeInfo((error, data) => {
        if (error) {
          reject(error);
        } else {
          resolve(data);
        }
      });
    });
  }

  promise_get_prevday_all_symbol() {
    // Return All Symbol with latest price
    return new Promise((resolve, reject) => {
      binance.prevDay(false, (error, prevDay) => {
        if (error) {
          reject(error);
        } else {
          resolve(prevDay);
        }
      });
    });
  }

  promise_get_latest_price_all_symbol() {
    // Return All Symbol with latest price
    return new Promise((resolve, reject) => {
      binance.prices((error, ticker) => {
        if (error) {
          reject(error);
        } else {
          resolve(ticker);
        }
      });
    });
  }

  promise_get_balance() {
    // Return your Binance balance
    return new Promise((resolve, reject) => {
      binance.balance((error, ticker) => {
        if (error) {
          reject(error);
        } else {
          resolve(ticker);
        }
      });
    });
  }

  promise_get_open_orders() {
    // Return all open Order
    return new Promise((resolve, reject) => {
      binance.openOrders(false, (error, result) => {
        if (error) {
          reject(error);
        } else {
          resolve(result);
        }
      });
    });
  }

  candlestick_websocket_multi(symbols, interval_in_sec, callback) {
    binance.websockets.candlesticks(
      symbols,
      util.interval_toString(interval_in_sec),
      response => {
        callback(response, interval_in_sec);
      }
    );
  }

  websocket_endpoits() {
    let endpoints = binance.websockets.subscriptions();
    for (let endpoint in endpoints) {
      console.log(endpoint);
      //binance.websockets.terminate(endpoint);
    }
  }
}

module.exports = new BINANCE_API();
