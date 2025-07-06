const { Pool } = require('pg');

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'To_Do_List',
  password: 'vidhya',
  port: 5432,
});

module.exports = pool;
