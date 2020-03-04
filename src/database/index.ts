/* tslint:disable */

import { createPool } from 'mysql2/promise';

export const BaseDB = createPool({
  host: process.env.MYSQL_HOST,
  port: process.env.MYSQL_PORT === undefined ? 3306 : parseInt(process.env.MYSQL_PORT, 10),
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASS,
  database: process.env.MYSQL_DB,
  charset: 'utf8mb4',
  waitForConnections: true,
  multipleStatements: true,
  connectionLimit: 10,
  queueLimit: 0,
});

export const ExchangeDB = createPool({
  host: process.env.MYSQL_HOST_EXCHANGE,
  port: process.env.MYSQL_PORT_EXCHANGE === undefined ? 3306 : parseInt(process.env.MYSQL_PORT_EXCHANGE, 10),
  user: process.env.MYSQL_USER_EXCHANGE,
  password: process.env.MYSQL_PASS_EXCHANGE,
  database: process.env.MYSQL_DB_EXCHANGE,
  charset: 'utf8mb4',
  waitForConnections: true,
  multipleStatements: true,
  connectionLimit: 10,
  queueLimit: 0,
});
