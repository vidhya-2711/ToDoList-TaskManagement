import React, { useState } from 'react';
import { updateTask, deleteTask } from '../services/api';

function TaskItem({ task, setTasks }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState(task.title);
  const [editedStatus, setEditedStatus] = useState(task.status);

  const handleStatusToggle = async () => {
    try {
      const updated = await updateTask(task._id, {
        status: task.status === 'complete' ? 'incomplete' : 'complete',
      });
      setTasks((prev) => prev.map((t) => (t._id === task._id ? updated : t)));
    } catch (err) {
      console.error('Error toggling task status:', err);
    }
  };

  const handleDelete = async () => {
    try {
      await deleteTask(task._id);
      setTasks((prev) => prev.filter((t) => t._id !== task._id));
    } catch (err) {
      console.error('Error deleting task:', err);
    }
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditedTitle(task.title);
    setEditedStatus(task.status);
  };

  const handleSave = async () => {
    try {
      const updated = await updateTask(task._id, {
        title: editedTitle,
        status: editedStatus,
      });
      setTasks((prev) => prev.map((t) => (t._id === task._id ? updated : t)));
      setIsEditing(false);
    } catch (err) {
      console.error('Error saving task:', err);
    }
  };

  return (
    <div style={{ padding: '10px', margin: '10px 0', border: '1px solid #ccc' }}>
      {isEditing ? (
        <>
          <input
            type="text"
            value={editedTitle}
            onChange={(e) => setEditedTitle(e.target.value)}
            style={{ marginRight: '10px' }}
          />
          <select
            value={editedStatus}
            onChange={(e) => setEditedStatus(e.target.value)}
          >
            <option value="incomplete">Incomplete</option>
            <option value="in progress">In Progress</option>
            <option value="complete">Complete</option>
          </select>
          <div style={{ marginTop: '10px' }}>
            <button onClick={handleSave}>Save</button>
            <button onClick={handleCancel} style={{ marginLeft: '10px' }}>
              Cancel
            </button>
          </div>
        </>
      ) : (
        <>
          <h4>{task.title}</h4>
          <p>Status: {task.status}</p>
          <button onClick={handleStatusToggle}>Toggle Status</button>
          <button onClick={handleEdit} style={{ marginLeft: '10px' }}>Edit</button>
          <button onClick={handleDelete} style={{ marginLeft: '10px', color: 'red' }}>
            Delete
          </button>
        </>
      )}
    </div>
  );
}

export default TaskItem;
