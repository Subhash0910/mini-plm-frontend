import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { default as api } from '../services/api';
import '../styles/Dashboard.css';

const Dashboard = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [systemStatus, setSystemStatus] = useState(null);
  const [loading, setLoading] = useState(true);
  const [stats] = useState({
    totalParts: 0,
    totalChanges: 0,
    activeProjects: 0,
    pendingApprovals: 0
  });

  useEffect(() => {
    const fetchSystemStatus = async () => {
      try {
        const response = await api.get('/health');
        setSystemStatus(response.data);
      } catch (error) {
        console.error('Health check failed:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchSystemStatus();
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="dashboard-container">
      {/* Header */}
      <header className="dashboard-header">
        <div className="header-top">
          <div className="header-brand">
            <div className="logo-icon">⚙️</div>
            <h1>MiniPLM</h1>
            <span className="subtitle">Product Lifecycle Management</span>
          </div>
          <div className="header-actions">
            <div className="user-info">
              <div className="user-avatar">{user?.name?.[0].toUpperCase()}</div>
              <div className="user-details">
                <p className="user-name">{user?.name || 'User'}</p>
                <p className="user-role">{user?.role || 'USER'}</p>
              </div>
            </div>
            <button className="btn btn-outline" onClick={handleLogout}>
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="dashboard-main">
        <div className="container">
          {/* Welcome Section */}
          <section className="welcome-section">
            <div className="welcome-content">
              <h2>Welcome back, <span className="highlight">{user?.name || 'User'}</span></h2>
              <p>Manage your product lifecycle efficiently with our enterprise-grade PLM system</p>
            </div>
            <div className="system-status">
              {loading ? (
                <div className="spinner"></div>
              ) : systemStatus ? (
                <div className="status-badge badge-success">
                  ✓ System Status: Online
                </div>
              ) : (
                <div className="status-badge badge-danger">
                  ✗ System Status: Offline
                </div>
              )}
            </div>
          </section>

          {/* Stats Grid */}
          <section className="stats-section">
            <div className="stats-grid">
              <div className="stat-card">
                <div className="stat-icon icon-parts">📦</div>
                <div className="stat-content">
                  <h4>Total Parts</h4>
                  <p className="stat-value">{stats.totalParts}</p>
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-icon icon-changes">📋</div>
                <div className="stat-content">
                  <h4>Changes</h4>
                  <p className="stat-value">{stats.totalChanges}</p>
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-icon icon-projects">🏗️</div>
                <div className="stat-content">
                  <h4>Active Projects</h4>
                  <p className="stat-value">{stats.activeProjects}</p>
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-icon icon-approvals">✅</div>
                <div className="stat-content">
                  <h4>Pending Approvals</h4>
                  <p className="stat-value">{stats.pendingApprovals}</p>
                </div>
              </div>
            </div>
          </section>

          {/* Quick Actions */}
          <section className="quick-actions-section">
            <h3>Quick Actions</h3>
            <div className="actions-grid">
              <div className="action-card">
                <div className="action-icon">📝</div>
                <h4>Create New Part</h4>
                <p>Define a new product component</p>
                <button className="btn btn-primary btn-sm">Start</button>
              </div>
              <div className="action-card">
                <div className="action-icon">🔄</div>
                <h4>Manage Changes</h4>
                <p>Create and track change requests</p>
                <button className="btn btn-primary btn-sm">Open</button>
              </div>
              <div className="action-card">
                <div className="action-icon">📊</div>
                <h4>View BOM</h4>
                <p>Review bill of materials</p>
                <button className="btn btn-primary btn-sm">Browse</button>
              </div>
              <div className="action-card">
                <div className="action-icon">👥</div>
                <h4>Team Collaboration</h4>
                <p>Work with your team</p>
                <button className="btn btn-primary btn-sm">Connect</button>
              </div>
            </div>
          </section>

          {/* Features Overview */}
          <section className="features-section">
            <div className="features-header">
              <h3>System Features</h3>
              <p>Powerful PLM capabilities at your fingertips</p>
            </div>
            <div className="features-grid">
              <div className="feature-item">
                <div className="feature-number">01</div>
                <h4>Parts Management</h4>
                <p>Create, organize, and manage product components with complete traceability</p>
              </div>
              <div className="feature-item">
                <div className="feature-number">02</div>
                <h4>Change Control</h4>
                <p>Track design changes with approval workflows and audit trails</p>
              </div>
              <div className="feature-item">
                <div className="feature-number">03</div>
                <h4>BOM Management</h4>
                <p>Create and maintain accurate bills of materials</p>
              </div>
              <div className="feature-item">
                <div className="feature-number">04</div>
                <h4>Workflow Engine</h4>
                <p>Automated approvals and notifications for efficiency</p>
              </div>
              <div className="feature-item">
                <div className="feature-number">05</div>
                <h4>Role-Based Access</h4>
                <p>Security through granular permission controls</p>
              </div>
              <div className="feature-item">
                <div className="feature-number">06</div>
                <h4>Real-time Collaboration</h4>
                <p>Team sync with instant notifications and updates</p>
              </div>
            </div>
          </section>
        </div>
      </main>

      {/* Footer */}
      <footer className="dashboard-footer">
        <div className="container">
          <div className="footer-content">
            <p>&copy; 2026 MiniPLM. Enterprise-grade Product Lifecycle Management.</p>
            <div className="footer-links">
              <button className="footer-link" onClick={() => {}} type="button">Documentation</button>
              <button className="footer-link" onClick={() => {}} type="button">Support</button>
              <button className="footer-link" onClick={() => {}} type="button">Terms</button>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Dashboard;