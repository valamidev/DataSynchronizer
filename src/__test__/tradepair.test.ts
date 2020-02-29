/* eslint-disable no-undef */
'use strict';
require('dotenv').config();
process.env.logLevel = 'info';

import { TradepairQueries } from '../tradepairs/tradepairs';

// Add Binance exhcange
test('Get BCHABC-ETH symbol', async () => {
  const symbol = await TradepairQueries.idToSymbol('kucoin', 'BCHABC-ETH');

  let symbolCache = '';

  for (let i = 0; i < 10; i++) {
    symbolCache = await TradepairQueries.idToSymbol('kucoin', 'BCHABC-ETH');
  }

  expect(symbol == symbolCache).toBe(true);
});
