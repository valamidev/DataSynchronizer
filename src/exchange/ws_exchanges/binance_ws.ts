/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable @typescript-eslint/camelcase */
import { Emitter } from '../../emitter/emitter';

// Binance things
const exchangeName = 'binance';

const Binance = require('binance-api-node').default;

const client = new Binance();
// Binance things

export const openSocket = (symbol: any) => {
  const socketTrades = client.ws.aggTrades(symbol, (trade: any) => {
    trade = {
      time: trade.eventTime,
      symbol: trade.symbol,
      side: trade.maker == true ? 'sell' : 'buy',
      quantity: trade.quantity,
      price: trade.price,
      tradeId: trade.tradeId,
    };

    Emitter.emit('Trades', exchangeName, trade);
  });

  const socketOrderbook = client.ws.depth(symbol, (depth: any) => {
    /*
      {
        eventType: 'depthUpdate',
        eventTime: 1564411435348,
        symbol: 'BTCUSDT',
        firstUpdateId: 905213181,
        finalUpdateId: 905213198,
        bidDepth: [
          { price: '9558.02000000', quantity: '0.11576700' },
          { price: '9552.36000000', quantity: '0.00000000' }
        ],
        askDepth: [
          { price: '9558.98000000', quantity: '0.00100800' },
          { price: '9566.05000000', quantity: '0.00000000' },
        ]
      }
    */
    const asks = depth.askDepth.map((e: any) => {
      return { price: e.price, size: e.quantity };
    });
    const bids = depth.bidDepth.map((e: any) => {
      return { price: e.price, size: e.quantity };
    });

    const updateDepth = { symbol: depth.symbol, asks, bids };

    Emitter.emit('Orderbook', exchangeName, updateDepth);
  });

  // Needed to close connection
  return (): boolean => {
    try {
      socketTrades();
      socketOrderbook();
    } catch (err) {
      return err;
    }

    return true;
  };
};
