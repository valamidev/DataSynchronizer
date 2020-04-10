import { OrderBookStore } from 'orderbook-synchronizer';
import { logger } from '../../logger';
import { util } from '../../utils';
import { Emitter } from '../emitter';

import { TradepairQueries } from '../../tradepairs/tradepairs';
import { DBQueries } from '../../database/queries';
import { Redis, RedisPub } from '../../redis/redis';
import { TableTemplates } from '../../database/queries/enums';

const memoryLimit = 512;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const OrderBookExchangeCache: Map<string, OrderBookStore> = new Map();

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

    Emitter.on(
      'Orderbook',
      async (exchange: string, depth: OrderBookDepth): Promise<void> => {
        // eslint-disable-next-line no-param-reassign
        exchange = exchange.toLowerCase();

        if (!OrderBookExchangeCache[exchange]) {
          OrderBookExchangeCache[exchange] = new OrderBookStore(memoryLimit);
        }

        const { symbol, asks, bids } = depth;

        if ((OrderBookExchangeCache[exchange] as OrderBookStore).hasOrderBook(symbol)) {
          try {
            OrderBookExchangeCache[exchange].updateOrderBook(symbol, asks, bids);

            const data = { ...OrderBookExchangeCache[exchange].getOrderBook(symbol) };

            if (data.best_ask && data.best_bid) {
              await RedisPub.publish(
                'OrderBookUpdate',
                JSON.stringify({ exchange, symbol, ask: data.best_ask, bid: data.best_bid }),
              );
            }
          } catch (e) {
            logger.error('Orderbook update error', e);
          }
        } else {
          try {
            const tableName = util.orderbookName(exchange, symbol);
            const orderbookSnapshot = await Redis.get(tableName);

            if (orderbookSnapshot !== null) {
              const parsedOrderbookSnapshot = JSON.parse(orderbookSnapshot);

              if (parsedOrderbookSnapshot.ask && parsedOrderbookSnapshot.bid) {
                OrderBookExchangeCache[exchange].updateOrderBook(
                  symbol,
                  parsedOrderbookSnapshot.ask,
                  parsedOrderbookSnapshot.bid,
                );
              }
            }
            OrderBookExchangeCache[exchange].updateOrderBook(symbol, asks, bids);
          } catch (e) {
            logger.error('Orderbook loading error', e);
          }
        }
      },
    );

    Emitter.on(
      'OrderbookSnapshot',
      async (snapshotTime: number): Promise<void> => {
        const exchanges = Object.keys(OrderBookExchangeCache);

        for (const exchange of exchanges) {
          const symbols = OrderBookExchangeCache[exchange].getSymbolList();

          for (const symbol of symbols) {
            try {
              const orderbook = { ...OrderBookExchangeCache[exchange].getOrderBook(symbol) };
              // Get CCXT standard symbol
              const ccxtSymbol = await TradepairQueries.idToSymbol(exchange, symbol);

              if (ccxtSymbol) {
                const tableName = util.orderbookName(exchange, ccxtSymbol);

                if (!(await DBQueries.tableCheck(tableName))) {
                  await DBQueries.createNewTableFromTemplate(TableTemplates.Orderbook, tableName);
                }

                await DBQueries.orderbookReplace(tableName, { time: snapshotTime, orderbook });

                // Store snapshot in redis for 600 sec
                Redis.set(tableName, JSON.stringify(orderbook), 'EX', 600);
              }
            } catch (e) {
              logger.error('Orderbook snapshot error', e);
            }
          }
        }
      },
    );
  }
}

module.exports = new OrderbookEmitter();
