require('dotenv').config();

process.env.logLevel = 'info';

import { MarketDataAPI } from '../marketdata/index';

test('Marketdata save', async () => {
  const result = await MarketDataAPI.updateMarketData('kucoin');

  expect(result).toBeUndefined();
});
