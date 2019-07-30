"use strict"

const logger = require("../../logger")
const { candle_db } = require("../../database")

const { MYSQL_DB_EXCHANGE } = process.env

const queries = {
  /* Orderbooks */

  orderbook_replace: async (table_name, res) => {
    try {
      let data = [res.time, JSON.stringify(res.orderbook)]

      await candle_db.query("REPLACE INTO `" + table_name + "` (`time`, `orderbook`) VALUES ?;", [[data]])

      return
    } catch (e) {
      logger.error("Error", e)
    }
  },

  orderbook_table_check: async (table_name) => {
    try {
      let [rows] = await candle_db.query("SELECT * FROM information_schema.TABLES WHERE table_schema = ? AND table_name = ? LIMIT 1;", [MYSQL_DB_EXCHANGE, table_name])

      if (rows.length != 1) {
        let [rows] = await candle_db.query("CREATE TABLE `" + table_name + "` LIKE `orderbook_def`;")
        return rows
      } else {
        return
      }
    } catch (e) {
      logger.error("Error", e)
    }
  },

  /* Trades */

  trades_table_check: async (table_name) => {
    try {
      let [rows] = await candle_db.query("SELECT * FROM information_schema.TABLES WHERE table_schema = ? AND table_name = ? LIMIT 1;", [MYSQL_DB_EXCHANGE, table_name])

      if (rows.length != 1) {
        let [rows] = await candle_db.query("CREATE TABLE `" + table_name + "` LIKE `trades_def`;")
        return rows
      } else {
        return
      }
    } catch (e) {
      logger.error("Error", e)
    }
  },

  trades_replace: async (table_name, ticks) => {
    try {
      if (ticks.length > 0) {
        await candle_db.query("REPLACE INTO `" + table_name + "` (`time`, `symbol`, `side`, `quantity`, `price`, `tradeId`) VALUES ?;", [ticks])
      }
      return
    } catch (e) {
      logger.error("Error", e)
    }
  },

  trades_livefeed_insert: async (table_name, res) => {
    try {
      /*
        {
          time: 1564393265876 // in ms
          symbol: 'BTC-USDT'
          side: 'buy'/'sell'
          quantity: '0.00171400'
          price:'9469.48000000'
          tradeId: 30 long string
        }
      */

      let data = [res.time, res.symbol, res.side, res.quantity, res.price, res.tradeId]

      await candle_db.query("INSERT INTO `" + table_name + "` (`time`, `symbol`, `side`, `quantity`, `price`, `tradeId`) VALUES ?;", [[data]])
    } catch (e) {
      logger.error("SQL error", e)
    }
  },

  /* Candlesticks */

  candlestick_table_check: async (table_name) => {
    try {
      let [rows] = await candle_db.query("SELECT * FROM information_schema.TABLES WHERE table_schema = ? AND table_name = ? LIMIT 1;", [MYSQL_DB_EXCHANGE, table_name])

      if (rows.length != 1) {
        let [rows] = await candle_db.query("CREATE TABLE `" + table_name + "` LIKE `candlestick_def`;")
        return rows
      } else {
        return
      }
    } catch (e) {
      logger.error("Error", e)
    }
  },

  candlestick_endTime: async (table_name) => {
    try {
      let [rows] = await candle_db.query("SELECT time FROM `" + table_name + "` ORDER BY `time` ASC limit 1;")

      if (rows[0]) {
        return rows[0].time
      }

      return 0
    } catch (e) {
      logger.error("Error", e)
    }
  },

  candlestick_startTime: async (table_name) => {
    try {
      let [rows] = await candle_db.query("SELECT time FROM `" + table_name + "` ORDER BY `time` DESC limit 1;")

      if (rows[0]) {
        return rows[0].time
      }

      return 0
      // Throw error no entry in the Database
    } catch (e) {
      logger.error("Error", e)
    }
  },

  candlestick_replace: async (table_name, ticks) => {
    try {
      if (ticks.length > 0) {
        await candle_db.query("REPLACE INTO `" + table_name + "` (`time`, `open`, `high`, `low`, `close`, `volume`) VALUES ?;", [ticks])
      }
      return
    } catch (e) {
      logger.error("Error", e)
    }
  },

  candlestick_select_all: async (table_name) => {
    try {
      let [rows] = await candle_db.query("SELECT * FROM `" + table_name + "` ORDER BY `time` ASC;")

      return rows
    } catch (e) {
      logger.error("Error", e)
    }
  },

  candlestick_history_size: async (table_name) => {
    try {
      let [rows] = await candle_db.query("SELECT count(*) as count FROM `" + table_name + "`;")

      if (rows.length > 0) {
        return rows[0].count
      } else {
        return 0
      }
    } catch (e) {
      logger.error("Error", e)
    }
  },

  candlestick_livefeed_insert: async (table_name, result) => {
    try {
      /*{   eventType: 'kline',
            eventTime: 1563784000234,
            symbol: 'BTCUSDT',
            startTime: 1563783960000,
            closeTime: 1563784019999,
            firstTradeId: 159464603,
            lastTradeId: 159464790,
            open: '10557.00000000',
            high: '10557.00000000',
            low: '10551.01000000',
            close: '10554.66000000',
            volume: '16.69123200',
            trades: 188,
            interval: '1m',
            isFinal: false,
            quoteVolume: '176174.73012498',
            buyVolume: '10.63625400',
            quoteBuyVolume: '112271.08317540' 
          } */
      let time = Date.now()

      let data = [time, result.symbol, result.startTime, result.open, result.high, result.low, result.close, result.volume, result.trades, result.isFinal]

      await candle_db.query("INSERT INTO `" + table_name + "` (`time`, `symbol`, `startTime`, `open`, `high`, `low`, `close`, `volume`, `trades`, `final`) VALUES ?;", [[data]])
    } catch (e) {
      logger.error("SQL error", e)
    }
  },

  clean_livefeed: async (table_name, time) => {
    try {
      await candle_db.query("DELETE FROM `" + table_name + "` WHERE time < ?;", [time])
    } catch (e) {
      logger.error("SQL error", e)
    }
  }
}

module.exports = queries
