const json_mysql = require("json-mysql");

let resp = {
  symbol: "BTCUSDT",
  orderId: 353270073,
  clientOrderId: "web_e30e87ff257c458999ff4ccd81863f4e",
  price: "5735.00000000",
  origQty: "0.01489000",
  executedQty: "0.00000000",
  cummulativeQuoteQty: "0.00000000",
  status: "NEW",
  timeInForce: "GTC",
  type: "LIMIT",
  side: "BUY",
  stopPrice: "0.00000000",
  icebergQty: "0.00000000",
  time: 1557521676982,
  updateTime: 1557521676982,
  isWorking: true
};

console.log(new json_mysql("account_orders", resp).query);
