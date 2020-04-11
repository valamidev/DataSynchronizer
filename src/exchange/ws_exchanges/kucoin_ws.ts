/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable @typescript-eslint/camelcase */
import { Order } from 'orderbook-synchronizer/lib/types';
import { EMITTER_EVENTS } from '../../constants';
import { Emitter } from '../../emitter/emitter';

// Kucoin things
const exchangeName = 'kucoin';

const KucoinAPI = require('kucoin-websocket-api');

// Kucoin things

export const openSocket = (symbol: any) => {
  const client = new KucoinAPI();

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  client.MarketMatches(symbol, (trade: any) => {
    const tradePayload = {
      time: Math.floor(trade.time / 10e5), // Kucoin use ns for timestamp
      symbol: trade.symbol,
      side: trade.side,
      quantity: trade.size,
      price: trade.price,
      tradeId: trade.tradeId,
    };

    Emitter.emit('Trades', exchangeName, tradePayload);
  });

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  client.MarketLevel2(symbol, (depth: any) => {
    // Kucoin use ns for timestamp
    /*
      sequenceStart: 1556425985882,
      symbol: 'XRP-BTC',
      changes: { asks: [], bids: [ [ '0.00003232', '5240.6325', '1556426078793' ] ] }, 
      sequenceEnd: 1556425985882
    */
    const asks: Order[] = depth.changes.asks.map((elem: any) => {
      return [elem[0], elem[1]];
    });
    const bids: Order[] = depth.changes.bids.map((elem: any) => {
      return [elem[0], elem[1]];
    });

    const updateDepth = { symbol: depth.symbol, asks, bids };

    Emitter.emit(EMITTER_EVENTS.OrderBookUpdate, exchangeName, updateDepth);
  });

  // Needed to close connection
  return (): boolean => {
    /*
    try {
      socketTrades();
      socketOrderbook();
    } catch (err) {
      return err;
    }
    */
    return true;
  };
};
