# DataSynchronizer

This package allow you to fetch Candlestick datas from exchanges and other data sources into a MySQL databases.

**Supported exchanges(Candlestick/OHLC):**
- Full CCXT support (Kucoin,Binance,Poloniex,Bitfinex...)

**Supported websocket performance exchanges (Livefeed):**
- Binance

**Supported Sentiment sources:**
- Twitter
- Reddit

**Features:**

- Tradepairs: Base module for Candlestick databases at boot.
- MarketData: Collect information about available tradepairs and their informations.
- Sentiment: Twitter/Reddit API fetcher.
- Livefeed: Websocket manager for real-time datasources.
- PriceTicker: All symbol price information from exchanges.
- Warden: Automated manager looking after newly added symbols and trending symbols.

**TODO:**

- Add more Websocket supported exhcanges.
- Add MarketDepth history storage.
- Add Docker friendly deployment solution.
- Add PostgreSQL database for Exchange datas Candlestick,MarketDepth...


Install:

1. Run NPM install:
```
npm install
```
2. Load/Run SQL from
```
SQL/install.sql
```
3. Setup the .env file
```
Rename .sample_env to .env
Configure the API keys for Binance,Twitter and Reddit
```

How to add Candlestick/OHLC tradepairs:

```
-- Add new Tradepairs which could be automaticaly initialized from DB
INSERT INTO `tradepairs` (`exchange`, `symbol`, `asset`, `quote`, `interval_sec`) VALUES ('binance', 'MATIC/BTC', 'MATIC', 'BTC', '300');
```