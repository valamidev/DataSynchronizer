const json_mysql = require("json-mysql")

let resp = {
  id: "31865059",
  timestamp: 1563975044422,
  datetime: "2019-07-24T13:30:44.422Z",
  lastTradeTimestamp: undefined,
  symbol: "HC/BTC",
  type: "limit",
  side: "sell",
  price: 0.000308,
  amount: 1,
  cost: 0,
  average: undefined,
  filled: 0,
  remaining: 1,
  status: "open",
  fee: undefined,
  trades: undefined
}

console.log(new json_mysql("account_orders", resp).query)
