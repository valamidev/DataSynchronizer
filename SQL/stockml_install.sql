CREATE DATABASE `stockml`;

USE `stockml`;

/*Table structure for table `account_balance` */

DROP TABLE IF EXISTS `account_balance`;

CREATE TABLE `account_balance` (
  `symbol` varchar(30) COLLATE utf8mb4_hungarian_ci NOT NULL DEFAULT '',
  `available` double NOT NULL,
  `onOrder` double NOT NULL,
  `time` bigint(20) NOT NULL DEFAULT '0',
  PRIMARY KEY (`symbol`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_hungarian_ci;

/*Table structure for table `account_orders` */

DROP TABLE IF EXISTS `account_orders`;

CREATE TABLE `account_orders` (
  `id` varchar(255) NOT NULL,
  `instance_id` int(10) NOT NULL DEFAULT '0',
  `time` bigint(20) NOT NULL DEFAULT '0',
  `timestamp` bigint(20) DEFAULT NULL,
  `datetime` varchar(255) DEFAULT NULL,
  `lastTradeTimestamp` bigint(20) DEFAULT NULL,
  `symbol` varchar(255) DEFAULT NULL,
  `type` varchar(255) DEFAULT NULL,
  `side` varchar(255) DEFAULT NULL,
  `price` double DEFAULT NULL,
  `amount` double DEFAULT NULL,
  `cost` double DEFAULT NULL,
  `average` double DEFAULT NULL,
  `filled` double DEFAULT NULL,
  `remaining` double DEFAULT NULL,
  `status` varchar(255) DEFAULT NULL,
  `fee` double DEFAULT NULL,
  `trades` int(10) DEFAULT NULL,
  `info` json DEFAULT NULL,
  `closed` tinyint(1) NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`),
  KEY `id` (`id`,`time`,`closed`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

/*Table structure for table `account_trader_instances` */

DROP TABLE IF EXISTS `account_trader_instances`;

CREATE TABLE `account_trader_instances` (
  `guid` int(10) NOT NULL AUTO_INCREMENT,
  `acc_guid` int(10) NOT NULL DEFAULT '0',
  `name` varchar(255) COLLATE utf8mb4_hungarian_ci NOT NULL DEFAULT '',
  `strategy_guid` int(10) NOT NULL DEFAULT '0',
  `limit_order` tinyint(1) NOT NULL DEFAULT '0',
  `exchange` varchar(255) COLLATE utf8mb4_hungarian_ci NOT NULL DEFAULT 'binance',
  `symbol` varchar(50) COLLATE utf8mb4_hungarian_ci NOT NULL DEFAULT '',
  `asset` varchar(50) COLLATE utf8mb4_hungarian_ci NOT NULL DEFAULT '',
  `quote` varchar(50) COLLATE utf8mb4_hungarian_ci NOT NULL DEFAULT '',
  `asset_balance` double NOT NULL DEFAULT '0',
  `quote_balance` double NOT NULL DEFAULT '0',
  `order_asset_balance` double NOT NULL DEFAULT '0',
  `order_quote_balance` double NOT NULL DEFAULT '0',
  PRIMARY KEY (`guid`)
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_hungarian_ci;

/*Table structure for table `accounts` */

DROP TABLE IF EXISTS `accounts`;

CREATE TABLE `accounts` (
  `guid` int(10) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) COLLATE utf8mb4_hungarian_ci NOT NULL,
  `label` varchar(255) COLLATE utf8mb4_hungarian_ci NOT NULL,
  PRIMARY KEY (`guid`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_hungarian_ci;

/*Table structure for table `market_datas` */

DROP TABLE IF EXISTS `market_datas`;

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
  `info` text NOT NULL,
  UNIQUE KEY `exchange` (`exchange`,`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

/*Table structure for table `price_tickers` */

DROP TABLE IF EXISTS `price_tickers`;

CREATE TABLE `price_tickers` (
  `exchange` varchar(255) NOT NULL,
  `symbol` varchar(255) NOT NULL,
  `timestamp` bigint(20) NOT NULL DEFAULT '0',
  `high` float NOT NULL DEFAULT '0',
  `low` float NOT NULL DEFAULT '0',
  `bid` float NOT NULL DEFAULT '0',
  `ask` float NOT NULL DEFAULT '0',
  `last` float NOT NULL DEFAULT '0',
  `change` float DEFAULT '0',
  `percentage` float DEFAULT '0',
  `baseVolume` float DEFAULT '0',
  `quoteVolume` float DEFAULT '0',
  `info` text,
  UNIQUE KEY `exchange` (`exchange`,`symbol`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

/*Table structure for table `quotes` */

DROP TABLE IF EXISTS `quotes`;

CREATE TABLE `quotes` (
  `guid` int(10) NOT NULL AUTO_INCREMENT,
  `name` varchar(30) NOT NULL DEFAULT 'BTC',
  PRIMARY KEY (`guid`)
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=latin1;

/*Table structure for table `sentiment_reddit` */

DROP TABLE IF EXISTS `sentiment_reddit`;

CREATE TABLE `sentiment_reddit` (
  `time` bigint(20) NOT NULL DEFAULT '0',
  `subreddit` varchar(40) NOT NULL DEFAULT '',
  `sum_ups` int(11) NOT NULL DEFAULT '0',
  `sum_comments` int(11) NOT NULL DEFAULT '0',
  `titles` text CHARACTER SET utf8mb4 COLLATE utf8mb4_hungarian_ci NOT NULL,
  UNIQUE KEY `time` (`time`,`subreddit`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

/*Table structure for table `sentiment_twitter` */

DROP TABLE IF EXISTS `sentiment_twitter`;

CREATE TABLE `sentiment_twitter` (
  `time` bigint(20) NOT NULL DEFAULT '0',
  `created_at` varchar(60) NOT NULL DEFAULT 'Fri May 03 11:00:11 +0000 2019',
  `asset` varchar(20) NOT NULL DEFAULT 'None',
  `text` text CHARACTER SET utf8mb4 COLLATE utf8mb4_hungarian_ci,
  `id` bigint(20) NOT NULL DEFAULT '0',
  `user` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_hungarian_ci NOT NULL DEFAULT '',
  `followers` int(10) NOT NULL DEFAULT '0',
  `listed` int(10) NOT NULL DEFAULT '0',
  UNIQUE KEY `asset` (`asset`,`id`),
  KEY `time` (`time`),
  KEY `id` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

/*Table structure for table `sentiments` */

DROP TABLE IF EXISTS `sentiments`;

CREATE TABLE `sentiments` (
  `type` char(10) NOT NULL DEFAULT 'twitter',
  `name` varchar(255) NOT NULL DEFAULT '',
  UNIQUE KEY `type` (`type`,`name`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

/*Table structure for table `trade_advice` */

DROP TABLE IF EXISTS `trade_advice`;

CREATE TABLE `trade_advice` (
  `strategy` varchar(64) COLLATE utf8mb4_hungarian_ci NOT NULL DEFAULT 'NEO',
  `strategy_guid` int(10) NOT NULL DEFAULT '0',
  `strategy_config` json DEFAULT NULL,
  `symbol` varchar(20) COLLATE utf8mb4_hungarian_ci NOT NULL DEFAULT '',
  `exchange` varchar(50) COLLATE utf8mb4_hungarian_ci NOT NULL DEFAULT '',
  `action` varchar(20) COLLATE utf8mb4_hungarian_ci NOT NULL DEFAULT '',
  `prevActionIfNotIdle` varchar(20) COLLATE utf8mb4_hungarian_ci NOT NULL DEFAULT '',
  `time` bigint(20) NOT NULL DEFAULT '0',
  `close` double NOT NULL DEFAULT '0',
  UNIQUE KEY `strategy_guid` (`strategy_guid`,`symbol`,`time`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_hungarian_ci;

/*Table structure for table `trade_strategies` */

DROP TABLE IF EXISTS `trade_strategies`;

CREATE TABLE `trade_strategies` (
  `guid` int(10) NOT NULL AUTO_INCREMENT,
  `strategy` varchar(120) NOT NULL DEFAULT 'data_gen2',
  `strategy_config` json DEFAULT NULL,
  `exchange` varchar(20) NOT NULL DEFAULT 'Binance',
  `symbol` varchar(20) NOT NULL DEFAULT 'BTCUSDT',
  `asset` varchar(20) NOT NULL DEFAULT 'BTC',
  `quote` varchar(20) NOT NULL DEFAULT 'USDT',
  `interval_sec` int(10) NOT NULL DEFAULT '300',
  UNIQUE KEY `guid` (`guid`)
) ENGINE=InnoDB AUTO_INCREMENT=107 DEFAULT CHARSET=latin1;

/*Table structure for table `trade_strategies_evaluation` */

DROP TABLE IF EXISTS `trade_strategies_evaluation`;

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
  `guid` int(10) NOT NULL AUTO_INCREMENT,
  UNIQUE KEY `guid` (`guid`),
  KEY `time` (`time`),
  KEY `symbol` (`symbol`,`exchange`,`interval_sec`),
  KEY `performance` (`performance`)
) ENGINE=InnoDB AUTO_INCREMENT=44633 DEFAULT CHARSET=latin1;

/*Table structure for table `tradepairs` */

DROP TABLE IF EXISTS `tradepairs`;

CREATE TABLE `tradepairs` (
  `exchange` varchar(20) NOT NULL DEFAULT 'Binance',
  `symbol` varchar(20) NOT NULL DEFAULT 'BTCTUSD',
  `id` varchar(50) DEFAULT NULL,
  `asset` varchar(20) NOT NULL DEFAULT 'BTC',
  `quote` varchar(20) NOT NULL DEFAULT 'TUSD',
  `is_warden` tinyint(1) NOT NULL DEFAULT '0',
  `time` bigint(20) NOT NULL DEFAULT '0',
  UNIQUE KEY `exchange` (`exchange`,`symbol`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

