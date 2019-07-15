const util = {
  // Intervals: 1m,3m,5m,15m,30m,1h,2h,4h,6h,8h,12h,1d,3d,1w,1M
  interval_toString: number => {
    let string = "";
    switch (number) {
      case 60:
        string = "1m";
        break;
      case 180:
        string = "3m";
        break;
      case 300:
        string = "5m";
        break;
      case 900:
        string = "15m";
        break;
      case 1800:
        string = "30m";
        break;
      case 3600:
        string = "1h";
        break;
      case 7200:
        string = "2h";
        break;
      case 14400:
        string = "4h";
        break;
      case 28800:
        string = "8h";
        break;
      case 43200:
        string = "12h";
        break;
      case 86400:
        string = "24h";
        break;
      default:
        string = "1m";
        break;
    }

    return string;
  },

  history_limit: () => {
    /* time * millisec * day */
    let limit = process.env.history_timeframe * 1000 * 86400;

    let time = Date.now() - limit;

    return time;
  },

  candlestick_name: (exchange, symbol, interval) => {
    symbol = symbol.replace("/", "");

    let name = exchange + "_" + symbol + "_" + util.interval_toString(interval);

    //Lowercase only
    return name.toLowerCase();
  },

  removeFalsy: obj => {
    let newObj = {};
    Object.keys(obj).forEach(prop => {
      if (obj[prop]) {
        newObj[prop] = obj[prop];
      }
    });
    return newObj;
  },

  candlestick_data_integrity: (data, invertval) => {
    let interval_msec = parseInt(invertval * 1000); //millisec
    if (data.length == 0) return false;

    let outages = [];

    for (let i = 0; i < data.length - 1; i++) {
      if (data[i + 1]["time"] - data[i]["time"] > interval_msec * 10) {
        outages.push(data[i]["time"]);
      }
    }

    return outages;
  }
};

module.exports = util;
