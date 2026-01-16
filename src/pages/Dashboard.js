import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { healthService } from '../services/api';

/**
 * Dashboard Page
 * Main application dashboard after login
 */
const Dashboard = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [systemStatus, setSystemStatus] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch system status on mount
  useEffect(() => {
    const fetchStatus = async () => {
      try {
        setLoading(true);
        const response = await healthService.checkStatus();
        setSystemStatus(response.data);
        setError(null);
      } catch (err) {
        console.error('Failed to fetch status:', err);
        setError('Failed to fetch system status');
      } finally {
        setLoading(false);
      }
    };

    fetchStatus();
    // Refresh every 30 seconds
    const interval = setInterval(fetchStatus, 30000);
    return () => clearInterval(interval);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login', { replace: true });
  };

  // Helper function to get role color
  const getRoleColor = (role) => {
    switch (role?.toUpperCase()) {
      case 'ADMIN':
        return 'bg-red-100 text-red-800';
      case 'MANAGER':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-blue-100 text-blue-800';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <header className="bg-white shadow-md">
        <div className="max-w-6xl mx-auto px-4 py-6 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Mini PLM</h1>
            <p className="text-gray-600">Product Lifecycle Management System</p>
          </div>
          <button
            onClick={handleLogout}
            className="px-6 py-2 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg transition duration-200"
          >
            Logout
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 py-8">
        {/* Welcome Section */}
        <div className="bg-white rounded-lg shadow-md p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            Welcome, {user?.username}!
          </h2>
          <p className="text-gray-600 mb-4">
            You are successfully logged in to the Mini PLM system.
          </p>

          {/* User Info Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-gray-600 text-sm font-semibold">Username</p>
              <p className="text-gray-800 text-lg font-bold mt-1">{user?.username}</p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-gray-600 text-sm font-semibold">Role</p>
              <div className="mt-1">
                <span
                  className={`inline-block px-4 py-1 rounded-full text-sm font-semibold ${getRoleColor(
                    user?.role
                  )}`}
                >
                  {user?.role?.toUpperCase() || 'USER'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* System Status Section */}
        <div className="bg-white rounded-lg shadow-md p-8 mb-8">
          <h3 className="text-xl font-bold text-gray-800 mb-6">System Status</h3>

          {loading && (
            <div className="text-center py-8">
              <div className="inline-block">
                <svg className="animate-spin h-8 w-8 text-blue-600" viewBox="0 0 24 24">
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                    fill="none"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
              </div>
              <p className="mt-4 text-gray-600">Fetching system status...</p>
            </div>
          )}

          {error && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-700">{error}</p>
            </div>
          )}

          {systemStatus && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {/* Status Items */}
              <div className="bg-green-50 border border-green-200 p-4 rounded-lg">
                <p className="text-green-700 font-semibold">Service Status</p>
                <p className="text-green-900 text-lg font-bold mt-2">✓ Online</p>
              </div>
              <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg">
                <p className="text-blue-700 font-semibold">API Version</p>
                <p className="text-blue-900 text-lg font-bold mt-2">
                  {systemStatus.version || 'v1.0.0'}
                </p>
              </div>
              <div className="bg-purple-50 border border-purple-200 p-4 rounded-lg">
                <p className="text-purple-700 font-semibold">Environment</p>
                <p className="text-purple-900 text-lg font-bold mt-2">
                  {systemStatus.environment || 'Production'}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-lg shadow-md p-8">
          <h3 className="text-xl font-bold text-gray-800 mb-6">Quick Actions</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <button className="p-6 bg-gradient-to-br from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-lg transition duration-200">
              <div className="text-2xl mb-2">📋</div>
              <p className="font-semibold">View Products</p>
            </button>
            <button className="p-6 bg-gradient-to-br from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white rounded-lg transition duration-200">
              <div className="text-2xl mb-2">➕</div>
              <p className="font-semibold">Create New</p>
            </button>
            <button className="p-6 bg-gradient-to-br from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white rounded-lg transition duration-200">
              <div className="text-2xl mb-2">⚙️</div>
              <p className="font-semibold">Settings</p>
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
