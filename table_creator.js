const json_mysql = require("json-mysql")

let resp = {
  sequence: "1556497093017",
  symbol: "BTC-USDT",
  side: "buy",
  size: "0.88404706",
  price: "9599.50000000000000000000",
  takerOrderId: "5d3ea50a89fc844d23fabbbc",
  time: "1564386570149854282",
  type: "match",
  makerOrderId: "5d3ea50a89fc844d23fabbb5",
  tradeId: "5d3ea50aab93db283d4b381e"
}

console.log(new json_mysql("livefeed_kucoin_trades", resp).query)
