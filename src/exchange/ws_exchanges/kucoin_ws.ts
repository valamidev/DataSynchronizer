/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable @typescript-eslint/camelcase */
import { Emitter } from '../../emitter/emitter';

// Kucoin things
const exchangeName = 'kucoin';

const KucoinAPI = require('kucoin-websocket-api');

const client = new KucoinAPI();
// Kucoin things

export const openSocket = (symbol: any) => {
  const socketTrades = client.MarketMatches(symbol, (trade: any) => {
    // Kucoin use ns for timestamp

    trade = {
      time: Math.floor(trade.time / 10e5),
      symbol: trade.symbol,
      side: trade.side,
      quantity: trade.size,
      price: trade.price,
      tradeId: trade.tradeId,
    };

    Emitter.emit('Trades', exchangeName, trade);
  });

  const socketOrderbook = client.MarketLevel2(symbol, (depth: any) => {
    // Kucoin use ns for timestamp
    /*
      sequenceStart: 1556425985882,
      symbol: 'XRP-BTC',
      changes: { asks: [], bids: [ [ '0.00003232', '5240.6325', '1556426078793' ] ] }, 
      sequenceEnd: 1556425985882
    */
    const asks = depth.changes.asks.map((e: any) => {
      return { price: e[0], size: e[1] };
    });
    const bids = depth.changes.bids.map((e: any) => {
      return { price: e[0], size: e[1] };
    });

    const updateDepth = { symbol: depth.symbol, asks, bids };

    Emitter.emit('Orderbook', exchangeName, updateDepth);
  });

  // Needed to close connection
  return (): void => {
    socketTrades();
    socketOrderbook();
  };
};
