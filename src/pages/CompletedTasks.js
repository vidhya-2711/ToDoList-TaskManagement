import React from 'react';
import Navbar from '../components/Navbar';
import TaskItem from '../components/TaskItem';

function CompletedTasks() {
  const tasks = [
    { _id: 1, title: 'Finish Hackathon', status: 'complete' },
  ];

  return (
    <div style={{ padding: '2rem' }}>
      <Navbar />
      <h2>Completed Tasks</h2>
      {tasks.map((task) => (
        <TaskItem key={task._id} task={task} setTasks={() => {}} />
      ))}
    </div>
  );
}

export default CompletedTasks;
