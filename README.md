# DataSynchronizer

This package allow you to fetch Candlestick datas from exchanges and other data sources into a MySQL databases.

**Supported exchanges(Candlestick/OHLC):**
- Full CCXT support (Kucoin,Binance,Poloniex,Bitfinex...)

**Supported exchanges (Livefeed):**
- Binance

**Supported Sentiment sources:**
- Twitter
- Reddit


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