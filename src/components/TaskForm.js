import React, { useState } from 'react';
import { createTask } from '../services/api';

function TaskForm({ setTasks }) {
  const [title, setTitle] = useState('');

  const handleAddTask = async (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    try {
      const newTask = await createTask({ title, status: 'incomplete' });

      if (newTask) {
        setTasks((prev) => [newTask, ...prev]);
        setTitle('');
      } else {
        console.error('No task returned from API.');
      }
    } catch (error) {
      console.error('Error creating task:', error);
    }
  };

  return (
    <form onSubmit={handleAddTask} style={{ marginBottom: '1rem' }}>
      <input
        type="text"
        placeholder="Enter task title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        style={{ padding: '8px', marginRight: '10px', width: '250px' }}
      />
      <button type="submit">Add Task</button>
    </form>
  );
}

export default TaskForm;
