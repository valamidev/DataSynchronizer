CREATE TABLE ?? (
  `time` bigint(20) NOT NULL DEFAULT '0',
  `side` varchar(5) DEFAULT NULL,
  `quantity` double DEFAULT NULL,
  `price` double DEFAULT NULL,
  `tradeId` varchar(30) DEFAULT NULL,
  UNIQUE KEY `time` (`time`,`tradeId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;