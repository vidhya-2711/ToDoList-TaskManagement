import React from 'react';
import Navbar from '../components/Navbar';
import TaskItem from '../components/TaskItem';

function InProgressTasks() {
  const tasks = [
    { _id: 2, title: 'Build Backend API', status: 'in progress' },
  ];

  return (
    <div style={{ padding: '2rem' }}>
      <Navbar />
      <h2>In Progress Tasks</h2>
      {tasks.map((task) => (
        <TaskItem key={task._id} task={task} setTasks={() => {}} />
      ))}
    </div>
  );
}

export default InProgressTasks;
