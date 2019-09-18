
require("dotenv").config();

process.env.log_level = "info"

import { MarketData } from '../marketdata/index'

test("Marketdata save", async () => {
  let result = await MarketData.update_market_data("kucoin");

  expect(result).toBeUndefined();
});
