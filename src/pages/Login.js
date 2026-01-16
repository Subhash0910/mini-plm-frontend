import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { api } from '../services/api';
import '../styles/Auth.css';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await api.post('/auth/login', { username, password });
      const { token, user } = response.data;
      login(token, user);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const demoCredentials = [
    { username: 'admin', password: 'admin123', role: 'Admin' },
    { username: 'user', password: 'user123', role: 'User' }
  ];

  const useDemoCredentials = (cred) => {
    setUsername(cred.username);
    setPassword(cred.password);
  };

  return (
    <div className="auth-container">
      {/* Animated Background */}
      <div className="auth-background">
        <div className="shape shape-1"></div>
        <div className="shape shape-2"></div>
        <div className="shape shape-3"></div>
      </div>

      <div className="auth-content">
        {/* Left Section */}
        <div className="auth-left">
          <div className="auth-brand">
            <div className="auth-logo">⚙️</div>
            <h1>MiniPLM</h1>
            <p>Enterprise Product Lifecycle Management</p>
          </div>
          <div className="auth-features">
            <div className="feature">
              <span className="icon">✓</span>
              <p>Advanced Parts Management</p>
            </div>
            <div className="feature">
              <span className="icon">✓</span>
              <p>Change Control & Workflow</p>
            </div>
            <div className="feature">
              <span className="icon">✓</span>
              <p>BOM & Document Control</p>
            </div>
            <div className="feature">
              <span className="icon">✓</span>
              <p>Team Collaboration Tools</p>
            </div>
          </div>
        </div>

        {/* Right Section */}
        <div className="auth-right">
          <div className="auth-card">
            <h2>Sign In</h2>
            <p className="auth-subtitle">Access your PLM workspace</p>

            {error && <div className="alert alert-danger">{error}</div>}

            <form onSubmit={handleLogin} className="auth-form">
              <div className="form-group">
                <label htmlFor="username">Username or Email</label>
                <input
                  id="username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Enter your username"
                  required
                  disabled={loading}
                />
              </div>

              <div className="form-group">
                <label htmlFor="password">Password</label>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  required
                  disabled={loading}
                />
              </div>

              <button type="submit" className="btn btn-primary btn-lg btn-block" disabled={loading}>
                {loading ? (
                  <>
                    <span className="spinner-small"></span>
                    Signing in...
                  </>
                ) : (
                  'Sign In'
                )}
              </button>
            </form>

            <div className="auth-divider">
              <span>Demo Credentials</span>
            </div>

            <div className="demo-credentials">
              {demoCredentials.map((cred, idx) => (
                <button
                  key={idx}
                  type="button"
                  className="btn btn-demo"
                  onClick={() => useDemoCredentials(cred)}
                >
                  <div className="demo-role">{cred.role}</div>
                  <div className="demo-username">{cred.username}</div>
                </button>
              ))}
            </div>

            <div className="auth-footer">
              <p>
                Don't have an account?{' '}
                <Link to="/register" className="link-primary">
                  Sign up here
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;