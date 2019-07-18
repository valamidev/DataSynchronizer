const json_mysql = require("json-mysql");

let resp = {
  limits: { amount: [Object], price: [Object], cost: [Object] },
  precision: { amount: 4, price: 8 },
  tierBased: false,
  percentage: true,
  taker: 0.001,
  maker: 0.001,
  id: "SNC-BTC",
  symbol: "SNC/BTC",
  baseId: "SNC",
  quoteId: "BTC",
  base: "SNC",
  quote: "BTC",
  active: true,
  info: {
    symbol: "SNC-BTC",
    quoteMaxSize: "99999999",
    enableTrading: true,
    priceIncrement: "0.00000001",
    feeCurrency: "BTC",
    baseMaxSize: "10000000000",
    baseCurrency: "SNC",
    quoteCurrency: "BTC",
    market: "BTC",
    quoteIncrement: "0.00000001",
    baseMinSize: "1",
    quoteMinSize: "0.00001",
    name: "SNC-BTC",
    baseIncrement: "0.0001"
  }
};

console.log(new json_mysql("account_orders", resp).query);
