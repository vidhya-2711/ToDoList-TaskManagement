const pool = require('../db');

async function createTask({ title, status, dueDate, createdBy }) {
  const result = await pool.query(
    `INSERT INTO tasks (title, status, due_date, created_by)
     VALUES ($1, $2, $3, $4) RETURNING *`,
    [title, status, dueDate, createdBy]
  );
  return result.rows[0];
}

module.exports = { createTask };
