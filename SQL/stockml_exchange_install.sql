
CREATE DATABASE `stockml_exchange`;

USE `stockml_exchange`;

/*Table structure for table `candlestick_def` */

DROP TABLE IF EXISTS `candlestick_def`;

CREATE TABLE `candlestick_def` (
  `time` bigint(20) NOT NULL DEFAULT '0',
  `open` float NOT NULL DEFAULT '0',
  `high` float NOT NULL DEFAULT '0',
  `low` float NOT NULL DEFAULT '0',
  `close` float NOT NULL DEFAULT '0',
  `volume` float NOT NULL DEFAULT '0',
  UNIQUE KEY `time` (`time`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

/*Table structure for table `orderbook_def` */

DROP TABLE IF EXISTS `orderbook_def`;

CREATE TABLE `orderbook_def` (
  `time` bigint(20) NOT NULL,
  `orderbook` json DEFAULT NULL,
  PRIMARY KEY (`time`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;

/*Table structure for table `trades_def` */

DROP TABLE IF EXISTS `trades_def`;

CREATE TABLE `trades_def` (
  `time` bigint(20) NOT NULL DEFAULT '0',
  `side` varchar(5) DEFAULT NULL,
  `quantity` double DEFAULT NULL,
  `price` double DEFAULT NULL,
  `tradeId` varchar(30) DEFAULT NULL,
  UNIQUE KEY `time` (`time`,`tradeId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

