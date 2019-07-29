

CREATE TABLE `livefeed_binance_trades` (
  `time` bigint(20) NOT NULL DEFAULT '0',
  `symbol` varchar(30) DEFAULT NULL,
  `side` varchar(5) DEFAULT NULL,
  `quantity` double DEFAULT NULL,
  `price` double DEFAULT NULL,
  `tradeId` varchar(30) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;


CREATE TABLE `livefeed_kucoin_trades` (
  `time` bigint(20) NOT NULL DEFAULT '0',
  `symbol` varchar(30) DEFAULT NULL,
  `side` varchar(5) DEFAULT NULL,
  `quantity` double DEFAULT NULL,
  `price` double DEFAULT NULL,
  `tradeId` varchar(30) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;


ALTER TABLE `livefeed_binance_trades`
  ADD UNIQUE KEY `tradeId` (`tradeId`);


ALTER TABLE `livefeed_kucoin_trades`
  ADD UNIQUE KEY `tradeId` (`tradeId`);
COMMIT;



CREATE TABLE `livefeed_binance_1m` (
  `time` bigint(20) NOT NULL DEFAULT '0',
  `symbol` varchar(50) NOT NULL DEFAULT '',
  `startTime` bigint(20) NOT NULL,
  `open` double NOT NULL DEFAULT '0',
  `high` double NOT NULL DEFAULT '0',
  `low` double NOT NULL DEFAULT '0',
  `close` double NOT NULL DEFAULT '0',
  `volume` double NOT NULL DEFAULT '0',
  `trades` int(10) NOT NULL DEFAULT '0',
  `final` tinyint(1) NOT NULL DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=utf8;


ALTER TABLE `livefeed_binance_1m`
  ADD UNIQUE KEY `time_2` (`time`,`symbol`),
  ADD KEY `final` (`final`);
COMMIT;