# DataSynchronizer

DataSynchronizer is a powerful NodeJS writen Cryptocurrency exchange / Sentiment data aggregator tool. 

**Capabilities**
- Fetch up to 100 Symbol(Kucoin API limitation) Candlestic, Trades, Orderbooks from Binance & Kucoin.
- Semi-automated seeking after new symbols or trending symbols.
- Auto convert MarketLvl2 datas (trades) into Candlesticks 1m
- Moderated fault tolerance, only auto-reconnecting Websockets are used. 


**Supported exchanges:**
- **Binance:** Candlestick, Trades, Orderbook Snapshots
- **Kucoin:** Trades, Orderbook Snapshots (Candlesticks can be calculated)
- **Other exchanges:** CCXT support for PriceTickers and MarketDatas

**Supported Sentiment sources:**
- Twitter
- Reddit

**Modules:**
- MarketData: Collect information about available tradepairs and their informations.
- Sentiment: Twitter/Reddit API fetcher.
- Livefeed: Websocket manager for real-time datasources.
- PriceTicker: All symbol price information from exchanges.
- Warden: Automated manager looking after newly added symbols and trending symbols.

**TODO:**
- Add Docker friendly deployment solution.
- Add PostgreSQL database for Exchange datas Candlestick,MarketDepth...


**Install:**

**Requirements:**
- Reddis 5.0+ (https://www.digitalocean.com/community/tutorials/how-to-install-and-secure-redis-on-ubuntu-18-04)
- MySQL (5.7+) or MariaDB (10.1.34+)
- NodeJS 10+ with --experimental-worker enabled!
- ~ 1Gb storage / day @ 150 Symbols


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

