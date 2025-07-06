import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import Dashboard from './pages/Dashboard';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/completed" element={<Dashboard />} />
        <Route path="/in-progress" element={<Dashboard />} />
        <Route path="/collaborated" element={<Dashboard />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;