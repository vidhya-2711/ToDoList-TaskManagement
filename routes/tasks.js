const express = require('express');
const router = express.Router();
const pool = require('../db'); // PostgreSQL connection

// 🔐 Middleware to check if logged in
function isAuthenticated(req, res, next) {
  if (req.isAuthenticated()) return next();
  return res.status(401).json({ message: 'Not authenticated' });
}

// ✅ GET /tasks - All tasks of logged-in user
router.get('/', isAuthenticated, async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT * FROM tasks
       WHERE created_by = $1
       ORDER BY created_at DESC`,
      [req.user.id]
    );
    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching tasks:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// ✅ POST /tasks - Create task
router.post('/', isAuthenticated, async (req, res) => {
  const { title, status, dueDate } = req.body;
  try {
    const result = await pool.query(
      `INSERT INTO tasks (title, status, due_date, created_by)
       VALUES ($1, $2, $3, $4) RETURNING *`,
      [title, status, dueDate, req.user.id]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('Error creating task:', err);
    res.status(500).json({ error: 'Task creation failed' });
  }
});

// ✅ PUT /tasks/:id - Update task
router.put('/:id', isAuthenticated, async (req, res) => {
  const { title, status, dueDate } = req.body;
  try {
    const result = await pool.query(
      `UPDATE tasks SET title = $1, status = $2, due_date = $3
       WHERE id = $4 AND created_by = $5 RETURNING *`,
      [title, status, dueDate, req.params.id, req.user.id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Task not found or not yours' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error('Error updating task:', err);
    res.status(500).json({ error: 'Task update failed' });
  }
});

// ✅ DELETE /tasks/:id - Delete task
router.delete('/:id', isAuthenticated, async (req, res) => {
  try {
    const result = await pool.query(
      `DELETE FROM tasks WHERE id = $1 AND created_by = $2 RETURNING *`,
      [req.params.id, req.user.id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Task not found or not yours' });
    }
    res.json({ message: 'Task deleted' });
  } catch (err) {
    console.error('Error deleting task:', err);
    res.status(500).json({ error: 'Task deletion failed' });
  }
});

module.exports = router;
