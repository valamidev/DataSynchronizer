/* eslint-disable no-undef */
'use strict';
require('dotenv').config();

import { CCXT_API } from '../exchange/ccxt_controller';

// Add Binance exhcange
test('Add valid exchange', async () => {
  const exchange = CCXT_API.initNewExchanges('binance');

  expect(exchange.api.tokenBucket).toBeDefined();
});

// Add non-exist exchange should be Throwed
test('Add invalid exchange', () => {
  expect(() => {
    CCXT_API.initNewExchanges('binancesdfsadf');
  }).toThrow();
});

// Load+Init Valid exchange
test('Load first exchange', async () => {
  const exchange = CCXT_API.loadExchangeAPI('kucoin');

  expect(exchange.tokenBucket).toBeDefined();
});

// Get Marketdata
test('Marketdata check', async () => {
  const result = await CCXT_API.getMarketdata('kucoin');

  expect(result).toBeTruthy();
});

// Get PriceTickers
test('Pricetickers check', async () => {
  const result = await CCXT_API.getPriceTickers('kucoin');

  expect(result).toBeTruthy();
});
