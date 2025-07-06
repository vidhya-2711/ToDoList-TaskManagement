import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:5000', // Update to your deployed backend
  withCredentials: true,
});

export const getTasks = async () => {
  const res = await API.get('/tasks');
  return res.data;
};

export const createTask = async (task) => {
  try {
    const res = await API.post('/tasks', task);
    return res.data; // Make sure backend returns the full task object
  } catch (err) {
    console.error('createTask error:', err);
    return null;
  }
};


export const updateTask = async (id, updates) => {
  const res = await API.put(`/tasks/${id}`, updates);
  return res.data;
};

export const deleteTask = async (id) => {
  const res = await API.delete(`/tasks/${id}`);
  return res.data;
};
