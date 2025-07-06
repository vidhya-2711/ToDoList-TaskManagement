import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000';

  const handleManualLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await axios.post(
        `${API_BASE_URL}/auth/login`,
        { email, password }, // ✅ Fix: use email not username
        { withCredentials: true }
      );

      console.log('Login success', res.data);
      navigate('/dashboard');
    } catch (err) {
      console.error(err);
      setError('Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    window.location.href = `${API_BASE_URL}/auth/google`;
  };

  const handleFacebookLogin = () => {
    window.location.href = `${API_BASE_URL}/auth/facebook`;
  };

  const handleGithubLogin = () => {
    window.location.href = `${API_BASE_URL}/auth/github`;
  };

  return (
    <div style={styles.container}>
      <div style={styles.heading}>Sign In</div>

      <form onSubmit={handleManualLogin} style={styles.form}>
        <input
          required
          style={styles.input}
          type="email"
          placeholder="E-mail"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          required
          style={styles.input}
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <input
          style={styles.loginButton}
          type="submit"
          value={loading ? 'Signing in...' : 'Sign In'}
          disabled={loading}
        />

        {error && <p style={{ color: 'red', textAlign: 'center', fontSize: '13px' }}>{error}</p>}
      </form>

      <div style={styles.socialContainer}>
        <span style={styles.socialTitle}>Or Sign in with</span>
        <div style={styles.socialAccounts}>
          <button style={styles.socialButton} onClick={handleGoogleLogin}>G</button>
          <button style={styles.socialButton} onClick={handleFacebookLogin}>f</button>
          <button style={styles.socialButton} onClick={handleGithubLogin}>GH</button>
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: {
    maxWidth: '350px',
    background: '#fff',
    borderRadius: '20px',
    padding: '25px 35px',
    boxShadow: 'rgba(133, 189, 215, 0.88) 0px 30px 30px -20px',
    margin: '40px auto',
    fontFamily: 'Arial, sans-serif',
  },
  heading: {
    textAlign: 'center',
    fontWeight: 900,
    fontSize: '30px',
    color: '#1089D3',
  },
  form: {
    marginTop: '20px',
  },
  input: {
    width: '100%',
    background: '#f9f9f9',
    padding: '15px 20px',
    borderRadius: '10px',
    marginTop: '15px',
    border: '1px solid #ccc',
    fontSize: '14px',
  },
  loginButton: {
    width: '100%',
    fontWeight: 'bold',
    background: '#1089D3',
    color: 'white',
    padding: '15px',
    marginTop: '20px',
    borderRadius: '10px',
    border: 'none',
    cursor: 'pointer',
  },
  socialContainer: {
    marginTop: '25px',
  },
  socialTitle: {
    display: 'block',
    textAlign: 'center',
    fontSize: '12px',
    color: '#999',
    marginBottom: '10px',
  },
  socialAccounts: {
    display: 'flex',
    justifyContent: 'center',
    gap: '10px',
  },
  socialButton: {
    width: '40px',
    height: '40px',
    borderRadius: '50%',
    border: 'none',
    backgroundColor: '#333',
    color: 'white',
    fontWeight: 'bold',
    fontSize: '14px',
    cursor: 'pointer',
  },
};

export default LoginPage;
