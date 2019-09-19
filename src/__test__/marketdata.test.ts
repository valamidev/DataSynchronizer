
require("dotenv").config();

process.env.log_level = "info"

import { MarketDataAPI } from '../marketdata/index'

test("Marketdata save", async () => {
  let result = await MarketDataAPI.update_market_data("kucoin");

  expect(result).toBeUndefined();
});
