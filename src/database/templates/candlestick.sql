CREATE TABLE ?? (
  `time` bigint(20) NOT NULL DEFAULT '0',
  `open` double NOT NULL DEFAULT '0',
  `high` double NOT NULL DEFAULT '0',
  `low` double NOT NULL DEFAULT '0',
  `close` double NOT NULL DEFAULT '0',
  `volume` double NOT NULL DEFAULT '0',
  UNIQUE KEY `time` (`time`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;