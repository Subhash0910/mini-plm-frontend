import React, { useState } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import {
  Box,
  AppBar,
  Toolbar,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Typography,
  Menu,
  MenuItem,
  Avatar,
  useTheme,
  useMediaQuery,
  Badge,
  Divider,
  Tooltip,
} from '@mui/material';
import {
  Menu as MenuIcon,
  Close as CloseIcon,
  Dashboard as DashboardIcon,
  Inventory as InventoryIcon,
  SwapHoriz as ChangeIcon,
  Description as DocumentIcon,
  Settings as SettingsIcon,
  Logout as LogoutIcon,
  Brightness4 as DarkIcon,
  Brightness7 as LightIcon,
  NotificationsActive as NotificationIcon,
  Person as PersonIcon,
} from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';

const DRAWER_WIDTH = 280;

const MainLayout = ({ themeMode, onThemeChange }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [mobileOpen, setMobileOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [notificationAnchor, setNotificationAnchor] = useState(null);

  const menuItems = [
    { title: 'Dashboard', icon: <DashboardIcon />, path: '/' },
    { title: 'Products', icon: <InventoryIcon />, path: '/products' },
    { title: 'Changes', icon: <ChangeIcon />, path: '/changes' },
    { title: 'Parts', icon: <InventoryIcon />, path: '/parts' },
    { title: 'Documents', icon: <DocumentIcon />, path: '/documents' },
    { title: 'Settings', icon: <SettingsIcon />, path: '/settings' },
  ];

  const handleDrawerToggle = () => setMobileOpen(!mobileOpen);
  const handleProfileClick = (event) => setAnchorEl(event.currentTarget);
  const handleProfileClose = () => setAnchorEl(null);
  const handleNotificationClick = (event) => setNotificationAnchor(event.currentTarget);
  const handleNotificationClose = () => setNotificationAnchor(null);

  const handleLogout = () => {
    logout();
    navigate('/login');
    handleProfileClose();
  };

  const handleNavigate = (path) => {
    navigate(path);
    if (isMobile) setMobileOpen(false);
  };

  const drawerContent = (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Box
        sx={{
          p: 2,
          backgroundColor: theme.palette.primary.main,
          color: 'white',
          textAlign: 'center',
        }}
      >
        <Typography variant="h6" sx={{ fontWeight: 700, letterSpacing: 1 }}>
          🏭 MINI PLM
        </Typography>
        <Typography variant="caption" sx={{ opacity: 0.8 }}>
          Product Lifecycle Manager
        </Typography>
      </Box>

      <Divider />

      <List sx={{ flex: 1, overflow: 'auto', py: 1 }}>
        {menuItems.map((item) => {
          const isActive =
            location.pathname === item.path ||
            (item.path !== '/' && location.pathname.startsWith(item.path));
          return (
            <ListItem
              button
              key={item.path}
              onClick={() => handleNavigate(item.path)}
              sx={{
                mb: 0.5,
                mx: 1,
                borderRadius: '4px',
                backgroundColor: isActive ? 'rgba(0, 61, 92, 0.1)' : 'transparent',
                borderLeft: isActive ? `4px solid ${theme.palette.primary.main}` : 'none',
                pl: isActive ? 1.5 : 2,
                color: isActive ? theme.palette.primary.main : 'inherit',
                transition: 'all 0.3s ease',
                '&:hover': {
                  backgroundColor: 'rgba(0, 61, 92, 0.08)',
                  pl: 2.5,
                },
              }}
            >
              <ListItemIcon sx={{ color: isActive ? theme.palette.primary.main : 'inherit', minWidth: 40 }}>
                {item.icon}
              </ListItemIcon>
              <ListItemText
                primary={item.title}
                primaryTypographyProps={{
                  fontSize: '0.95rem',
                  fontWeight: isActive ? 600 : 500,
                }}
              />
            </ListItem>
          );
        })}
      </List>

      <Divider />

      <Box sx={{ p: 2, backgroundColor: theme.palette.mode === 'dark' ? '#1e1e1e' : '#f5f5f5' }}>
        <Typography variant="caption" sx={{ opacity: 0.7 }}>
          LOGGED IN AS
        </Typography>
        <Typography variant="body2" sx={{ fontWeight: 600, mt: 0.5 }}>
          {user?.name || 'User'}
        </Typography>
        <Typography variant="caption" sx={{ opacity: 0.6 }}>
          {user?.email || 'user@example.com'}
        </Typography>
      </Box>
    </Box>
  );

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', backgroundColor: theme.palette.background.default }}>
      <AppBar
        position="fixed"
        sx={{
          zIndex: theme.zIndex.drawer + 1,
          backgroundColor: theme.palette.primary.main,
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        }}
      >
        <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            {isMobile && (
              <IconButton color="inherit" edge="start" onClick={handleDrawerToggle} sx={{ mr: 1 }}>
                {mobileOpen ? <CloseIcon /> : <MenuIcon />}
              </IconButton>
            )}
            <Typography variant="h6" sx={{ fontWeight: 700, fontSize: isMobile ? '1rem' : '1.25rem', letterSpacing: 0.5 }}>
              Mini PLM
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Tooltip title={`Switch to ${themeMode === 'light' ? 'dark' : 'light'} mode`}>
              <IconButton
                color="inherit"
                onClick={() => onThemeChange(themeMode === 'light' ? 'dark' : 'light')}
              >
                {themeMode === 'light' ? <DarkIcon /> : <LightIcon />}
              </IconButton>
            </Tooltip>

            <Tooltip title="Notifications">
              <IconButton color="inherit" onClick={handleNotificationClick}>
                <Badge badgeContent={3} color="error">
                  <NotificationIcon />
                </Badge>
              </IconButton>
            </Tooltip>

            <Menu
              anchorEl={notificationAnchor}
              open={Boolean(notificationAnchor)}
              onClose={handleNotificationClose}
              anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
              transformOrigin={{ vertical: 'top', horizontal: 'right' }}
            >
              <MenuItem sx={{ width: '300px' }}>
                <Typography variant="body2">📋 New change request awaiting approval</Typography>
              </MenuItem>
              <MenuItem>
                <Typography variant="body2">✅ Product update completed successfully</Typography>
              </MenuItem>
              <MenuItem>
                <Typography variant="body2">⚠️ Part version conflict detected</Typography>
              </MenuItem>
            </Menu>

            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Tooltip title="Profile">
                <IconButton onClick={handleProfileClick} size="small" sx={{ ml: 1 }}>
                  <Avatar sx={{ width: 32, height: 32, backgroundColor: theme.palette.secondary.main, cursor: 'pointer', fontSize: '0.875rem' }}>
                    {user?.name?.charAt(0).toUpperCase() || 'U'}
                  </Avatar>
                </IconButton>
              </Tooltip>
              <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleProfileClose}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                transformOrigin={{ vertical: 'top', horizontal: 'right' }}
              >
                <MenuItem
                  onClick={() => {
                    navigate('/settings');
                    handleProfileClose();
                  }}
                >
                  <PersonIcon sx={{ mr: 1 }} /> Profile Settings
                </MenuItem>
                <MenuItem onClick={handleLogout}>
                  <LogoutIcon sx={{ mr: 1 }} /> Logout
                </MenuItem>
              </Menu>
            </Box>
          </Box>
        </Toolbar>
      </AppBar>

      {!isMobile && (
        <Drawer
          variant="permanent"
          sx={{
            width: DRAWER_WIDTH,
            flexShrink: 0,
            '& .MuiDrawer-paper': {
              width: DRAWER_WIDTH,
              boxSizing: 'border-box',
              mt: '64px',
              height: 'calc(100vh - 64px)',
              border: 'none',
              borderRight: `1px solid ${theme.palette.divider}`,
            },
          }}
        >
          {drawerContent}
        </Drawer>
      )}

      {isMobile && (
        <Drawer
          variant="temporary"
          anchor="left"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          sx={{
            '& .MuiDrawer-paper': {
              width: DRAWER_WIDTH,
              mt: '64px',
            },
          }}
        >
          {drawerContent}
        </Drawer>
      )}

      <Box
        component="main"
        sx={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          mt: '64px',
          [theme.breakpoints.up('md')]: {
            ml: `${DRAWER_WIDTH}px`,
          },
        }}
      >
        <Box sx={{ flex: 1, p: { xs: 1.5, sm: 2, md: 3 }, overflow: 'auto' }}>
          <Outlet />
        </Box>

        <Box
          component="footer"
          sx={{
            backgroundColor: theme.palette.mode === 'dark' ? '#1e1e1e' : '#f5f5f5',
            borderTop: `1px solid ${theme.palette.divider}`,
            py: 2,
            px: 3,
            textAlign: 'center',
            mt: 'auto',
          }}
        >
          <Typography variant="caption" sx={{ opacity: 0.7 }}>
            © 2024 Mini PLM System. All rights reserved. | Version 1.0.0
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default MainLayout;
