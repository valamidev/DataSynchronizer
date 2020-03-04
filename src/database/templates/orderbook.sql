CREATE TABLE ?? (
  `time` bigint(20) NOT NULL,
  `orderbook` json DEFAULT NULL,
  PRIMARY KEY (`time`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;