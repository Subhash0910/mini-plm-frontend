import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

// Contexts
import { AuthProvider } from './context/AuthContext';
import { NotificationProvider } from './context/NotificationContext';

// Layouts
import MainLayout from './layouts/MainLayout';
import AuthLayout from './layouts/AuthLayout';

// Pages - Auth
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';

// Pages - Dashboard
import DashboardPage from './pages/dashboard/DashboardPage';

// Pages - Products
import ProductsPage from './pages/products/ProductsPage';
import ProductDetailPage from './pages/products/ProductDetailPage';
import CreateProductPage from './pages/products/CreateProductPage';

// Pages - Changes
import ChangesPage from './pages/changes/ChangesPage';
import ChangeDetailPage from './pages/changes/ChangeDetailPage';
import CreateChangePage from './pages/changes/CreateChangePage';

// Pages - Parts
import PartsPage from './pages/parts/PartsPage';
import PartDetailPage from './pages/parts/PartDetailPage';
import CreatePartPage from './pages/parts/CreatePartPage';

// Pages - Documents
import DocumentsPage from './pages/documents/DocumentsPage';

// Pages - Admin
import SettingsPage from './pages/settings/SettingsPage';
import UsersPage from './pages/admin/UsersPage';

// Components
import ProtectedRoute from './components/ProtectedRoute';
import LoadingScreen from './components/LoadingScreen';

// Define Windchill-inspired theme
const lightTheme = createTheme({
  palette: {
    primary: {
      main: '#003d5c', // Windchill dark blue
      light: '#005a8c',
      dark: '#002a40',
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#f57c00', // Orange accent
      light: '#ffb74d',
      dark: '#e65100',
    },
    success: {
      main: '#4caf50',
      light: '#81c784',
      dark: '#388e3c',
    },
    warning: {
      main: '#ff9800',
      light: '#ffb74d',
      dark: '#f57c00',
    },
    error: {
      main: '#f44336',
      light: '#ef5350',
      dark: '#d32f2f',
    },
    info: {
      main: '#2196f3',
      light: '#64b5f6',
      dark: '#1976d2',
    },
    background: {
      default: '#f5f5f5',
      paper: '#ffffff',
    },
    text: {
      primary: '#212121',
      secondary: '#757575',
    },
    divider: '#e0e0e0',
  },
  typography: {
    fontFamily: [
      '-apple-system',
      'BlinkMacSystemFont',
      '"Segoe UI"',
      'Roboto',
      '"Helvetica Neue"',
      'Arial',
      'sans-serif',
    ].join(','),
    h1: {
      fontSize: '2rem',
      fontWeight: 600,
      color: '#003d5c',
    },
    h2: {
      fontSize: '1.5rem',
      fontWeight: 600,
      color: '#003d5c',
    },
    h3: {
      fontSize: '1.25rem',
      fontWeight: 600,
      color: '#003d5c',
    },
    button: {
      textTransform: 'none',
      fontWeight: 500,
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: '4px',
          textTransform: 'none',
          fontWeight: 500,
          transition: 'all 0.3s ease',
        },
        contained: {
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
          '&:hover': {
            boxShadow: '0 4px 8px rgba(0,0,0,0.15)',
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: '4px',
          boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
          border: '1px solid #e0e0e0',
          '&:hover': {
            boxShadow: '0 2px 8px rgba(0,0,0,0.12)',
          },
        },
      },
    },
    MuiTextField: {
      defaultProps: {
        variant: 'outlined',
        size: 'small',
      },
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            '&:hover fieldset': {
              borderColor: '#003d5c',
            },
          },
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: '#003d5c',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          backgroundColor: '#f5f5f5',
          borderRight: '1px solid #e0e0e0',
        },
      },
    },
  },
});

const darkTheme = createTheme({
  ...lightTheme,
  palette: {
    ...lightTheme.palette,
    mode: 'dark',
    background: {
      default: '#121212',
      paper: '#1e1e1e',
    },
    text: {
      primary: '#ffffff',
      secondary: '#b0b0b0',
    },
  },
});

function App() {
  const [themeMode, setThemeMode] = useState('light');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const savedTheme = localStorage.getItem('themeMode');
    if (savedTheme) {
      setThemeMode(savedTheme);
    } else {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      setThemeMode(prefersDark ? 'dark' : 'light');
    }
    setIsLoading(false);
  }, []);

  const handleThemeChange = (newMode) => {
    setThemeMode(newMode);
    localStorage.setItem('themeMode', newMode);
  };

  const currentTheme = themeMode === 'dark' ? darkTheme : lightTheme;

  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <ThemeProvider theme={currentTheme}>
      <CssBaseline />
      <AuthProvider>
        <NotificationProvider>
          <Router>
            <Routes>
              <Route element={<AuthLayout />}>
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
              </Route>

              <Route element={<MainLayout onThemeChange={handleThemeChange} themeMode={themeMode} />}>
                <Route element={<ProtectedRoute />}>
                  <Route path="/" element={<DashboardPage />} />
                  <Route path="/products" element={<ProductsPage />} />
                  <Route path="/products/create" element={<CreateProductPage />} />
                  <Route path="/products/:id" element={<ProductDetailPage />} />
                  <Route path="/changes" element={<ChangesPage />} />
                  <Route path="/changes/create" element={<CreateChangePage />} />
                  <Route path="/changes/:id" element={<ChangeDetailPage />} />
                  <Route path="/parts" element={<PartsPage />} />
                  <Route path="/parts/create" element={<CreatePartPage />} />
                  <Route path="/parts/:id" element={<PartDetailPage />} />
                  <Route path="/documents" element={<DocumentsPage />} />
                  <Route path="/admin/users" element={<UsersPage />} />
                  <Route path="/settings" element={<SettingsPage />} />
                </Route>
              </Route>

              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </Router>
        </NotificationProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
