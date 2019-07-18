const json_mysql = require("json-mysql");

let resp = {
  symbol: "BNTY/ETH",
  timestamp: undefined,
  high: 0.00001459,
  low: 0.0000131,
  bid: 0.00001311,
  ask: 0.00001342,
  last: 0.00001326,
  change: -8.3e-7,
  percentage: -5.89,
  baseVolume: 1107261.7554,
  quoteVolume: 15.053002368749,
  info: {
    symbol: "BNTY-ETH",
    high: "0.00001459",
    vol: "1107261.7554",
    last: "0.00001326",
    low: "0.0000131",
    buy: "0.00001311",
    sell: "0.00001342",
    changePrice: "-0.00000083",
    averagePrice: "0.00001439",
    changeRate: "-0.0589",
    volValue: "15.053002368749"
  }
};

console.log(new json_mysql("price_tickers", resp).query);
