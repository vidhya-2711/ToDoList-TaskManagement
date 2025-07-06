import React from 'react';
import { Link } from 'react-router-dom';

function Navbar() {
  const handleLogout = () => {
    window.location.href = 'http://localhost:5000/auth/logout';
  };

  return (
    <nav style={styles.nav}>
      <div style={styles.links}>
        <Link to="/dashboard" style={styles.link}>All Tasks</Link>
        <Link to="/completed" style={styles.link}>Completed</Link>
        <Link to="/in-progress" style={styles.link}>In Progress</Link>
        <Link to="/collaborated" style={styles.link}>Collaborated</Link>
      </div>
      <button style={styles.logout} onClick={handleLogout}>
        Logout
      </button>
    </nav>
  );
}

const styles = {
  nav: {
    padding: '10px 20px',
    backgroundColor: '#f5f5f5',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '20px',
    borderBottom: '1px solid #ccc',
  },
  links: {
    display: 'flex',
    gap: '20px',
  },
  link: {
    textDecoration: 'none',
    color: '#333',
    fontWeight: 'bold',
  },
  logout: {
    backgroundColor: '#ff4d4f',
    color: 'white',
    border: 'none',
    padding: '6px 12px',
    borderRadius: '4px',
    cursor: 'pointer',
  },
};

export default Navbar;
