"use strict";

const mysql = require("mysql2/promise");

const pool = mysql.createPool({
  host: process.env.MYSQL_HOST,
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASS,
  database: process.env.MYSQL_DB,
  charset: "utf8mb4",
  waitForConnections: true,
  multipleStatements: true,
  connectionLimit: 10,
  queueLimit: 0
});

module.exports = pool;
