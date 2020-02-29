'use strict';
require('dotenv').config();

process.env.logLevel = 'info';

const Warden = require('../warden/index');

test('Warden Select Symbols', async () => {
  const result = await Warden.selectSymbols('kucoin', 'BTC', 1);

  expect(result).toBeDefined();
});

test('Warden Start', async () => {
  const result = await Warden.start(['kucoin', 'binance'], ['BTC'], [1]);

  expect(result).toBeUndefined();
});
