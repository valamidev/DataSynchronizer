'use strict';

import { logger } from '../../logger';
import { util } from '../../utils';
import { Emitter } from '../emitter';

import { OrderBookStore } from 'orderbook-synchronizer';

import { TradepairQueries } from '../../tradepairs/tradepairs';
import { DBQueries } from '../../database/queries';
import { Redis, RedisPub } from '../../redis/redis';
import { TableTemplatePath } from '../../database/queries/enums';

const memoryLimit = 512;
const Orderbooks = {};

interface OrderBookDepth {
  symbol: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  asks: any[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  bids: any[];
}

class OrderbookEmitter {
  constructor() {
    // Event listeners
    logger.verbose('Orderbook Emitter started!');

    Emitter.on('Orderbook', (exchange: string, depth: OrderBookDepth) => {
      exchange = exchange.toLowerCase();

      if (typeof Orderbooks[exchange] == 'undefined') {
        Orderbooks[exchange] = new OrderBookStore(memoryLimit);
      }

      const { symbol, asks, bids } = depth;

      if (Orderbooks[exchange]._symbols.indexOf(symbol) == -1) {
        setImmediate(async () => {
          try {
            const tableName = util.orderbookName(exchange, symbol);
            const orderbookSnapshot = await Redis.get(tableName);
            if (orderbookSnapshot !== null) {
              const parsedOrderbookSnapshot = JSON.parse(orderbookSnapshot);

              if (parsedOrderbookSnapshot?.ask && parsedOrderbookSnapshot?.bid) {
                Orderbooks[exchange].updateOrderBook(symbol, parsedOrderbookSnapshot.ask, parsedOrderbookSnapshot.bid);
              }
            }
            Orderbooks[exchange].updateOrderBook(symbol, asks, bids);
          } catch (e) {
            logger.error('Orderbook snapshot error', e);
          }
        });
      } else {
        Orderbooks[exchange].updateOrderBook(symbol, asks, bids);

        if (typeof Orderbooks[exchange]._data[symbol] != 'undefined') {
          const data = Orderbooks[exchange]._data[symbol];

          RedisPub.publish('OrderBookUpdate', JSON.stringify({ exchange, symbol, ask: data.best_ask, bid: data.best_bid }));
        }
      }
    });

    Emitter.on('OrderbookSnapshot', (snapshotTime: number) => {
      Object.keys(Orderbooks).forEach(exchange => {
        const symbols = Orderbooks[exchange]._symbols;

        symbols.forEach((symbol: string) => {
          setImmediate(async () => {
            const orderbook = Orderbooks[exchange].getOrderBook(symbol);
            // Get CCXT standard symbol
            const ccxtSymbol = await TradepairQueries.idToSymbol(exchange, symbol);

            if (ccxtSymbol) {
              const tableName = util.orderbookName(exchange, ccxtSymbol);

              if (!(await DBQueries.tableCheck(tableName))) {
                await DBQueries.createNewTableFromTemplate(TableTemplatePath.Orderbook, tableName);
              }

              await DBQueries.orderbookReplace(tableName, { time: snapshotTime, orderbook });

              // Store snapshot in redis for 600 sec
              Redis.set(tableName, JSON.stringify(orderbook), 'EX', 600);
            }
          });
        });
      });
    });
  }
}

module.exports = new OrderbookEmitter();
