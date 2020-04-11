export enum TableTemplates {
  Candlestick = `CREATE TABLE ?? (
  time bigint(20) NOT NULL DEFAULT '0',
  open double NOT NULL DEFAULT '0',
  high double NOT NULL DEFAULT '0',
  low double NOT NULL DEFAULT '0',
  close double NOT NULL DEFAULT '0',
  volume double NOT NULL DEFAULT '0',
  UNIQUE KEY time (time)
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8;`,

  Orderbook = `CREATE TABLE ?? (
  time bigint(20) NOT NULL,
  orderbook MEDIUMTEXT DEFAULT NULL,
  PRIMARY KEY (time)
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;`,

  Trades = `CREATE TABLE ?? (
  time bigint(20) NOT NULL DEFAULT '0',
  side varchar(5) DEFAULT NULL,
  quantity double DEFAULT NULL,
  price double DEFAULT NULL,
  tradeId varchar(30) DEFAULT NULL,
  UNIQUE KEY time (time,tradeId)
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8;`,
}
