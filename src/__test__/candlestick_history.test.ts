/* eslint-disable no-undef */
'use strict';
require('dotenv').config();

process.env.logLevel = 'info';

jest.setTimeout(300000);

const candleHistoryBuilder = require('../tradepairs/candlestick_history');

// Add Binance exhcange
test('Get BTC/USDT History', async () => {
  const candleHistory = new candleHistoryBuilder('binance', 'BTC/USDT', 100);

  await candleHistory.start();

  expect(true).toBe(true);
});
