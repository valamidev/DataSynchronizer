import { Utils } from '../utils';

describe('Utils', () => {
  it('should candlestickName format as expected', () => {
    const candlestickName1 = Utils.candlestickName('binance', 'btc-/_bnb', 60);
    const candlestickName2 = Utils.candlestickName('binance', 'btc-/_bnb', '1m');

    expect(candlestickName1).toBe('binance_btcbnb_1m');
    expect(candlestickName2).toBe('binance_btcbnb_1m');
  });
});
