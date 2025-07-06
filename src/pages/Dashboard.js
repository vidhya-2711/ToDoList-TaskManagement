import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import TaskForm from '../components/TaskForm';
import TaskItem from '../components/TaskItem';
import Navbar from '../components/Navbar';
import { getTasks } from '../services/api';
import axios from 'axios';

function Dashboard() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [authChecked, setAuthChecked] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  // 🔎 Get filter from URL path (e.g., "/completed" → "completed")
  const filterPath = location.pathname.split('/')[1];
  const filter = filterPath === 'dashboard' ? 'all' : 
                 filterPath === 'completed' ? 'complete' :
                 filterPath === 'in-progress' ? 'incomplete' :
                 filterPath === 'collaborated' ? 'collaborated' :
                 'all';

  useEffect(() => {
    const checkLoginAndLoad = async () => {
      try {
        const res = await axios.get('http://localhost:5000/auth/me', {
          withCredentials: true,
        });

        if (res.data) {
          const taskData = await getTasks();
          setTasks(taskData);
        } else {
          navigate('/');
        }
      } catch (err) {
        console.error('Not logged in:', err);
        navigate('/');
      } finally {
        setAuthChecked(true);
        setLoading(false);
      }
    };

    checkLoginAndLoad();
  }, [navigate]);

  const filteredTasks = tasks.filter((task) => {
    if (filter === 'all') return true;
    if (filter === 'collaborated') return task.shared_with?.length > 0;
    return task.status === filter;
  });

  if (!authChecked) return <p>Verifying session...</p>;

  return (
    <div style={{ padding: '2rem' }}>
      <Navbar />
      <h2>Your Tasks</h2>

      {/* Task Form */}
      <TaskForm setTasks={setTasks} />

      {/* Tasks */}
      {loading ? (
        <p>Loading tasks...</p>
      ) : filteredTasks.length > 0 ? (
        filteredTasks.map((task) => (
          <TaskItem key={task.id} task={task} setTasks={setTasks} />
        ))
      ) : (
        <p>No tasks in this filter.</p>
      )}
    </div>
  );
}

export default Dashboard;
