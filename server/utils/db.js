// server/utils/db.js
import mysql from 'mysql2/promise';

export const createConnection = async () => {
  return mysql.createConnection({
    host: process.env.MYSQL_HOST || 'localhost',
    user: process.env.MYSQL_USER || 'root',
    password: process.env.MYSQL_PASSWORD || '1234',
    database: process.env.MYSQL_DATABASE || 'todo',
  });
};