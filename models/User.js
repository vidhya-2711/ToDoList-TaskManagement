const pool = require('../db');

async function findUserByUsername(username) {
  const result = await pool.query('SELECT * FROM users WHERE username = $1', [username]);
  return result.rows[0];
}

async function createUser(data) {
  const { username, email, password, provider } = data;
  const result = await pool.query(
    `INSERT INTO users (username, email, password, provider)
     VALUES ($1, $2, $3, $4) RETURNING *`,
    [username, email, password, provider]
  );
  return result.rows[0];
}

module.exports = {
  findUserByUsername,
  createUser
};
