import { logger } from './logger';

import SentimentAPI from './sentiment/sentiment';
import LivefeedAPI from './livefeed/livefeed';
import { MarketDataAPI } from './marketdata';
import PriceTickersAPI from './pricetickers';
import WardenClass from './warden';

require('dotenv').config();
require('./emitter'); // Eventemitter class
require('./redis');

// Load Dotenv variables
const {
  MarketData,
  Sentiment,
  Livefeed,
  PriceTicker,
  Warden,
  exchangeList,
  wardenExchangesList,
  quotes,
  quoteLimits,
} = process.env;

const exchanges = exchangeList !== undefined ? exchangeList.split(',') : [];
const wardenExchanges = wardenExchangesList !== undefined ? wardenExchangesList.split(',') : [];
const wardenQuotes = quotes !== undefined ? quotes.split(',') : [];
const wardenQuoteLimits = quoteLimits !== undefined ? quoteLimits.split(',').map((elem) => parseInt(elem)) : [];
// Load Dotenv variables

async function main(): Promise<void> {
  logger.info('StockML Synchronizer started');

  // Available Symbols and Precision informations from exchanges
  if (MarketData && parseInt(MarketData) === 1) {
    await MarketDataAPI.start(exchanges);
  }
  // Current prices and other Symbol datas like daily change, daily volume
  if (PriceTicker && parseInt(PriceTicker) === 1) {
    await PriceTickersAPI.start(exchanges);
  }
  // Twitter/Reddit API
  if (Sentiment && parseInt(Sentiment) === 1) {
    await SentimentAPI.start();
  }
  // Websocket support check exchanges/ws_exchanges for support!
  if (Livefeed && parseInt(Livefeed) === 1) {
    await LivefeedAPI.start(exchanges);
    require('./workers/index');
  }
  // Warden Auto init tradepairs for data collection based on Volume desc
  if (Warden && parseInt(Warden) === 1) {
    await WardenClass.start(wardenExchanges, wardenQuotes, wardenQuoteLimits);
  }

  logger.info('Startup finished');
}

main().catch((err) => {
  logger.error('Startup error', err);
  process.exit(1);
});
