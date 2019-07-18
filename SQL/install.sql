
CREATE TABLE `accounts` (
  `guid` int(10) NOT NULL,
  `name` varchar(255) COLLATE utf8mb4_hungarian_ci NOT NULL,
  `label` varchar(255) COLLATE utf8mb4_hungarian_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_hungarian_ci;



CREATE TABLE `account_balance` (
  `symbol` varchar(30) COLLATE utf8mb4_hungarian_ci NOT NULL DEFAULT '',
  `available` double NOT NULL,
  `onOrder` double NOT NULL,
  `time` bigint(20) NOT NULL DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_hungarian_ci;


CREATE TABLE `account_options` (
  `owner_guid` int(10) NOT NULL DEFAULT '0',
  `name` varchar(255) COLLATE utf8mb4_hungarian_ci NOT NULL,
  `value` varchar(255) COLLATE utf8mb4_hungarian_ci NOT NULL,
  `type` varchar(20) COLLATE utf8mb4_hungarian_ci NOT NULL DEFAULT 'number'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_hungarian_ci;



CREATE TABLE `account_orders` (
  `symbol` varchar(30) NOT NULL,
  `orderId` bigint(20) NOT NULL DEFAULT '0',
  `clientOrderId` varchar(255) NOT NULL,
  `price` double NOT NULL,
  `origQty` double NOT NULL,
  `executedQty` double NOT NULL,
  `cummulativeQuoteQty` double NOT NULL,
  `status` varchar(255) NOT NULL,
  `timeInForce` varchar(255) NOT NULL,
  `type` varchar(255) NOT NULL,
  `side` varchar(255) NOT NULL,
  `stopPrice` double NOT NULL,
  `icebergQty` double NOT NULL,
  `time` bigint(20) NOT NULL DEFAULT '0',
  `updateTime` bigint(20) NOT NULL DEFAULT '0',
  `isWorking` tinyint(1) NOT NULL DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=utf8;



CREATE TABLE `account_trader_instances` (
  `guid` int(10) NOT NULL,
  `acc_guid` int(10) NOT NULL DEFAULT '0',
  `name` varchar(255) COLLATE utf8mb4_hungarian_ci NOT NULL DEFAULT '',
  `strategy_guid` int(10) NOT NULL DEFAULT '0',
  `limit_order` tinyint(1) NOT NULL DEFAULT '0',
  `symbol` varchar(50) COLLATE utf8mb4_hungarian_ci NOT NULL DEFAULT '',
  `asset` varchar(50) COLLATE utf8mb4_hungarian_ci NOT NULL DEFAULT '',
  `quote` varchar(50) COLLATE utf8mb4_hungarian_ci NOT NULL DEFAULT '',
  `asset_balance` double NOT NULL DEFAULT '0',
  `quote_balance` double NOT NULL DEFAULT '0',
  `order_asset_balance` double NOT NULL DEFAULT '0',
  `order_quote_balance` double NOT NULL DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_hungarian_ci;


CREATE TABLE `account_trades` (
  `instance_id` int(10) NOT NULL DEFAULT '0',
  `closed` tinyint(1) NOT NULL DEFAULT '0',
  `symbol` varchar(30) NOT NULL DEFAULT '',
  `orderId` bigint(20) NOT NULL DEFAULT '0',
  `clientOrderId` varchar(255) NOT NULL DEFAULT '',
  `price` double NOT NULL DEFAULT '0',
  `origQty` double NOT NULL DEFAULT '0',
  `executedQty` double NOT NULL DEFAULT '0',
  `cummulativeQuoteQty` double NOT NULL DEFAULT '0',
  `type` varchar(255) NOT NULL DEFAULT '',
  `side` varchar(255) NOT NULL DEFAULT '',
  `time` bigint(20) NOT NULL DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=utf8;



CREATE TABLE `def_def_def` (
  `time` bigint(20) NOT NULL DEFAULT '0',
  `open` float NOT NULL DEFAULT '0',
  `high` float NOT NULL DEFAULT '0',
  `low` float NOT NULL DEFAULT '0',
  `close` float NOT NULL DEFAULT '0',
  `volume` float NOT NULL DEFAULT '0',
  `closeTime` bigint(20) NOT NULL DEFAULT '0',
  `assetVolume` float NOT NULL DEFAULT '0',
  `trades` int(10) NOT NULL DEFAULT '0',
  `buyBaseVolume` float NOT NULL DEFAULT '0',
  `buyAssetVolume` float NOT NULL DEFAULT '0',
  `ignored` int(10) NOT NULL DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=utf8;


CREATE TABLE `livefeed_binance_5m` (
  `time` bigint(20) NOT NULL DEFAULT '0',
  `symbol` varchar(50) NOT NULL DEFAULT '',
  `startTime` bigint(20) NOT NULL,
  `open` float NOT NULL DEFAULT '0',
  `high` float NOT NULL DEFAULT '0',
  `low` float NOT NULL DEFAULT '0',
  `close` float NOT NULL DEFAULT '0',
  `volume` float NOT NULL DEFAULT '0',
  `trades` int(10) NOT NULL DEFAULT '0',
  `final` tinyint(1) NOT NULL DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=utf8;



CREATE TABLE `livefeed_binance_symbols` (
  `symbol` varchar(255) NOT NULL,
  `priceChange` float NOT NULL DEFAULT '0',
  `priceChangePercent` float NOT NULL DEFAULT '0',
  `weightedAvgPrice` float NOT NULL DEFAULT '0',
  `prevClosePrice` float NOT NULL DEFAULT '0',
  `lastPrice` float NOT NULL DEFAULT '0',
  `lastQty` float NOT NULL DEFAULT '0',
  `bidPrice` float NOT NULL DEFAULT '0',
  `bidQty` bigint(40) NOT NULL DEFAULT '0',
  `askPrice` float NOT NULL DEFAULT '0',
  `askQty` bigint(40) NOT NULL DEFAULT '0',
  `openPrice` float NOT NULL DEFAULT '0',
  `highPrice` float NOT NULL DEFAULT '0',
  `lowPrice` float NOT NULL DEFAULT '0',
  `volume` float NOT NULL DEFAULT '0',
  `quoteVolume` float NOT NULL DEFAULT '0',
  `openTime` bigint(20) NOT NULL DEFAULT '0',
  `closeTime` bigint(20) NOT NULL DEFAULT '0',
  `firstId` int(10) NOT NULL DEFAULT '0',
  `lastId` int(10) NOT NULL DEFAULT '0',
  `count` int(10) NOT NULL DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=utf8;


CREATE TABLE `livefeed_prices` (
  `symbol` varchar(50) COLLATE utf8mb4_hungarian_ci NOT NULL DEFAULT 'BTCUSDT',
  `price` double NOT NULL,
  `time` bigint(20) NOT NULL DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_hungarian_ci;


CREATE TABLE `livefeed_tradeinfo` (
  `symbol` varchar(50) COLLATE utf8mb4_hungarian_ci NOT NULL DEFAULT 'BTCUSDT',
  `stepsize` double NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_hungarian_ci;



CREATE TABLE `sentiments` (
  `type` char(10) NOT NULL DEFAULT 'twitter',
  `name` varchar(255) NOT NULL DEFAULT ''
) ENGINE=InnoDB DEFAULT CHARSET=latin1;



CREATE TABLE `sentiment_reddit` (
  `time` bigint(20) NOT NULL DEFAULT '0',
  `subreddit` varchar(40) NOT NULL DEFAULT '',
  `sum_ups` int(11) NOT NULL DEFAULT '0',
  `sum_comments` int(11) NOT NULL DEFAULT '0',
  `titles` text CHARACTER SET utf8mb4 COLLATE utf8mb4_hungarian_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;



CREATE TABLE `sentiment_twitter` (
  `time` bigint(20) NOT NULL DEFAULT '0',
  `created_at` varchar(60) NOT NULL DEFAULT 'Fri May 03 11:00:11 +0000 2019',
  `asset` varchar(20) NOT NULL DEFAULT 'None',
  `text` text CHARACTER SET utf8mb4 COLLATE utf8mb4_hungarian_ci,
  `id` bigint(20) NOT NULL DEFAULT '0',
  `user` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_hungarian_ci NOT NULL DEFAULT '',
  `followers` int(10) NOT NULL DEFAULT '0',
  `listed` int(10) NOT NULL DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=latin1;



CREATE TABLE `tradepairs` (
  `guid` int(10) NOT NULL,
  `exchange` varchar(20) NOT NULL DEFAULT 'binance',
  `symbol` varchar(20) NOT NULL DEFAULT 'BTCUSDT',
  `asset` varchar(20) NOT NULL DEFAULT 'BTC',
  `quote` varchar(20) NOT NULL DEFAULT 'USDT',
  `interval_sec` int(10) NOT NULL DEFAULT '300'
) ENGINE=InnoDB DEFAULT CHARSET=latin1;



CREATE TABLE `trade_advice` (
  `strategy` varchar(64) COLLATE utf8mb4_hungarian_ci NOT NULL DEFAULT 'NEO',
  `strategy_guid` int(10) NOT NULL DEFAULT '0',
  `strategy_config` json DEFAULT NULL,
  `symbol` varchar(20) COLLATE utf8mb4_hungarian_ci NOT NULL DEFAULT '',
  `exchange` varchar(50) COLLATE utf8mb4_hungarian_ci NOT NULL DEFAULT '',
  `action` varchar(20) COLLATE utf8mb4_hungarian_ci NOT NULL DEFAULT '',
  `prevActionIfNotIdle` varchar(20) COLLATE utf8mb4_hungarian_ci NOT NULL DEFAULT '',
  `time` bigint(20) NOT NULL DEFAULT '0',
  `close` double NOT NULL DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_hungarian_ci;



CREATE TABLE `trade_strategies` (
  `guid` int(10) NOT NULL,
  `strategy` varchar(120) NOT NULL DEFAULT 'data_gen2',
  `strategy_config` json DEFAULT NULL,
  `exchange` varchar(20) NOT NULL DEFAULT 'Binance',
  `symbol` varchar(20) NOT NULL DEFAULT 'BTCUSDT',
  `asset` varchar(20) NOT NULL DEFAULT 'BTC',
  `quote` varchar(20) NOT NULL DEFAULT 'USDT',
  `interval_sec` int(10) NOT NULL DEFAULT '300'
) ENGINE=InnoDB DEFAULT CHARSET=latin1;



CREATE TABLE `trade_strategies_evaluation` (
  `symbol` varchar(20) NOT NULL DEFAULT 'BTCUSDT',
  `exchange` varchar(20) NOT NULL DEFAULT 'Binance',
  `interval_sec` int(10) NOT NULL DEFAULT '300',
  `candle_limit` int(10) NOT NULL DEFAULT '400',
  `strategy` varchar(120) NOT NULL DEFAULT 'data_gen2',
  `strategy_config` json DEFAULT NULL,
  `performance` float NOT NULL DEFAULT '1000',
  `actions` json DEFAULT NULL,
  `time` bigint(20) NOT NULL DEFAULT '0',
  `guid` int(10) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;



CREATE TABLE `market_datas` (
  `exchange` varchar(30) NOT NULL DEFAULT '',
  `limits` text NOT NULL,
  `precision_data` text NOT NULL,
  `tierBased` int(10) NOT NULL DEFAULT '0',
  `percentage` int(10) NOT NULL DEFAULT '0',
  `taker` float NOT NULL DEFAULT '0',
  `maker` float NOT NULL DEFAULT '0',
  `id` varchar(255) NOT NULL,
  `symbol` varchar(255) NOT NULL,
  `baseId` varchar(255) NOT NULL,
  `quoteId` varchar(255) NOT NULL,
  `base` varchar(255) NOT NULL,
  `quote` varchar(255) NOT NULL,
  `active` int(10) NOT NULL DEFAULT '0',
  `info` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;


ALTER TABLE `market_datas`
  ADD UNIQUE KEY `exchange` (`exchange`,`id`);
COMMIT;


--
-- A tábla indexei `accounts`
--
ALTER TABLE `accounts`
  ADD PRIMARY KEY (`guid`);

--
-- A tábla indexei `account_balance`
--
ALTER TABLE `account_balance`
  ADD PRIMARY KEY (`symbol`);

--
-- A tábla indexei `account_options`
--
ALTER TABLE `account_options`
  ADD UNIQUE KEY `owner_guid` (`owner_guid`,`name`);

--
-- A tábla indexei `account_orders`
--
ALTER TABLE `account_orders`
  ADD PRIMARY KEY (`clientOrderId`);

--
-- A tábla indexei `account_trader_instances`
--
ALTER TABLE `account_trader_instances`
  ADD PRIMARY KEY (`guid`);

--
-- A tábla indexei `account_trades`
--
ALTER TABLE `account_trades`
  ADD PRIMARY KEY (`clientOrderId`),
  ADD KEY `orderId` (`orderId`),
  ADD KEY `instance_id` (`instance_id`),
  ADD KEY `type` (`type`);


ALTER TABLE `def_def_def`
  ADD UNIQUE KEY `time` (`time`);

--
-- A tábla indexei `livefeed_binance_5m`
--
ALTER TABLE `livefeed_binance_5m`
  ADD UNIQUE KEY `time_2` (`time`,`symbol`),
  ADD KEY `startTime` (`startTime`),
  ADD KEY `final` (`final`);

--
-- A tábla indexei `livefeed_binance_symbols`
--
ALTER TABLE `livefeed_binance_symbols`
  ADD UNIQUE KEY `symbol` (`symbol`),
  ADD KEY `count` (`count`);

--
-- A tábla indexei `livefeed_prices`
--
ALTER TABLE `livefeed_prices`
  ADD PRIMARY KEY (`symbol`);

--
-- A tábla indexei `livefeed_tradeinfo`
--
ALTER TABLE `livefeed_tradeinfo`
  ADD UNIQUE KEY `symbol` (`symbol`);

--
-- A tábla indexei `sentiments`
--
ALTER TABLE `sentiments`
  ADD UNIQUE KEY `type` (`type`,`name`);

--
-- A tábla indexei `sentiment_reddit`
--
ALTER TABLE `sentiment_reddit`
  ADD UNIQUE KEY `time` (`time`,`subreddit`);

--
-- A tábla indexei `sentiment_twitter`
--
ALTER TABLE `sentiment_twitter`
  ADD UNIQUE KEY `asset` (`asset`,`id`),
  ADD KEY `time` (`time`),
  ADD KEY `id` (`id`);

--
-- A tábla indexei `tradepairs`
--
ALTER TABLE `tradepairs`
  ADD UNIQUE KEY `guid` (`guid`),
  ADD UNIQUE KEY `exchange` (`exchange`,`symbol`,`interval_sec`),
  ADD KEY `symbol` (`symbol`);

--
-- A tábla indexei `trade_advice`
--
ALTER TABLE `trade_advice`
  ADD UNIQUE KEY `strategy_guid` (`strategy_guid`,`symbol`,`time`);

--
-- A tábla indexei `trade_strategies`
--
ALTER TABLE `trade_strategies`
  ADD UNIQUE KEY `guid` (`guid`);

--
-- A tábla indexei `trade_strategies_evaluation`
--
ALTER TABLE `trade_strategies_evaluation`
  ADD UNIQUE KEY `guid` (`guid`),
  ADD KEY `time` (`time`),
  ADD KEY `symbol` (`symbol`,`exchange`,`interval_sec`),
  ADD KEY `performance` (`performance`);

--
-- A kiírt táblák AUTO_INCREMENT értéke
--

--
-- AUTO_INCREMENT a táblához `accounts`
--
ALTER TABLE `accounts`
  MODIFY `guid` int(10) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT a táblához `account_trader_instances`
--
ALTER TABLE `account_trader_instances`
  MODIFY `guid` int(10) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT a táblához `tradepairs`
--
ALTER TABLE `tradepairs`
  MODIFY `guid` int(10) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT a táblához `trade_strategies`
--
ALTER TABLE `trade_strategies`
  MODIFY `guid` int(10) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT a táblához `trade_strategies_evaluation`
--
ALTER TABLE `trade_strategies_evaluation`
  MODIFY `guid` int(10) NOT NULL AUTO_INCREMENT;
COMMIT;


