import React from 'react';
import Navbar from '../components/Navbar';
import TaskItem from '../components/TaskItem';

function CollaboratedTasks() {
  const tasks = [
    { _id: 3, title: 'Shared Task by teammate@example.com', status: 'incomplete' },
  ];

  return (
    <div style={{ padding: '2rem' }}>
      <Navbar />
      <h2>Collaborated Tasks</h2>
      {tasks.map((task) => (
        <TaskItem key={task._id} task={task} setTasks={() => {}} />
      ))}
    </div>
  );
}

export default CollaboratedTasks;
