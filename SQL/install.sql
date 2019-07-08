-- Default Candlestick

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


ALTER TABLE `def_def_def`
  ADD UNIQUE KEY `time` (`time`);
COMMIT;

-- Tradepairs
CREATE TABLE `tradepairs` (
  `guid` int(10) NOT NULL,
  `exchange` varchar(20) NOT NULL DEFAULT 'Binance',
  `symbol` varchar(20) NOT NULL DEFAULT 'BTCTUSD',
  `asset` varchar(20) NOT NULL DEFAULT '',
  `quote` varchar(20) NOT NULL DEFAULT '',
  `interval_sec` int(10) NOT NULL DEFAULT '3600'
) ENGINE=InnoDB DEFAULT CHARSET=latin1;


ALTER TABLE `tradepairs`
  ADD UNIQUE KEY `guid` (`guid`);


ALTER TABLE `tradepairs`
  MODIFY `guid` int(10) NOT NULL AUTO_INCREMENT;
COMMIT;


CREATE TABLE `account_balance` (
  `symbol` varchar(30) COLLATE utf8mb4_hungarian_ci NOT NULL DEFAULT '',
  `available` double NOT NULL,
  `onOrder` double NOT NULL,
  `time` bigint(20) NOT NULL DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_hungarian_ci;


ALTER TABLE `account_balance`
  ADD PRIMARY KEY (`symbol`);
COMMIT;

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

ALTER TABLE `account_orders`
  ADD PRIMARY KEY (`clientOrderId`);
COMMIT;