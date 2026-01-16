import React, { useState, useEffect } from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  CardHeader,
  Typography,
  Avatar,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Button,
  CircularProgress,
  useTheme,
  alpha,
} from '@mui/material';
import {
  TrendingUp as TrendingUpIcon,
  CheckCircle as CheckCircleIcon,
  Warning as WarningIcon,
  Schedule as ScheduleIcon,
  Inventory as InventoryIcon,
  SwapHoriz as ChangeIcon,
  AccessTime as AccessTimeIcon,
  Done as DoneIcon,
} from '@mui/icons-material';
import { dashboardAPI } from '../../services/api';
import { useNotification } from '../../context/NotificationContext';

const StatCard = ({ title, value, icon, color, trend, unit = '' }) => {
  const theme = useTheme();

  return (
    <Card
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        background: `linear-gradient(135deg, ${alpha(color, 0.1)} 0%, ${alpha(color, 0.05)} 100%)`,
        borderLeft: `4px solid ${color}`,
        transition: 'all 0.3s ease',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: theme.shadows[8],
        },
      }}
    >
      <CardContent sx={{ flex: 1 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <Box>
            <Typography color="textSecondary" gutterBottom variant="body2" sx={{ fontWeight: 600 }}>
              {title}
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 1, mt: 1 }}>
              <Typography variant="h5" sx={{ fontWeight: 700, color }}>
                {value}
              </Typography>
              <Typography variant="caption" sx={{ opacity: 0.7 }}>
                {unit}
              </Typography>
            </Box>
            {trend && (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mt: 1 }}>
                <TrendingUpIcon sx={{ fontSize: '1rem', color: 'success.main' }} />
                <Typography variant="caption" sx={{ color: 'success.main', fontWeight: 600 }}>
                  {trend}
                </Typography>
              </Box>
            )}
          </Box>
          <Avatar sx={{ width: 48, height: 48, backgroundColor: alpha(color, 0.2), color }}>
            {icon}
          </Avatar>
        </Box>
      </CardContent>
    </Card>
  );
};

const DashboardPage = () => {
  const theme = useTheme();
  const { showNotification } = useNotification();

  const [loading, setLoading] = useState(false);

  return (
    <Box>
      <Box sx={{ mb: 3 }}>
        <Typography variant="h4" sx={{ fontWeight: 700, mb: 0.5 }}>
          Dashboard
        </Typography>
        <Typography color="textSecondary">Welcome back! Here's your PLM system overview.</Typography>
      </Box>

      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Total Products"
            value={24}
            icon={<InventoryIcon />}
            color="#003d5c"
            trend="+12% this month"
            unit="items"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Active Changes"
            value={8}
            icon={<ChangeIcon />}
            color="#f57c00"
            trend="+5 this week"
            unit="requests"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Total Parts"
            value={156}
            icon={<InventoryIcon />}
            color="#4caf50"
            trend="+8% last month"
            unit="parts"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Pending Approvals"
            value={5}
            icon={<ScheduleIcon />}
            color="#f44336"
            unit="awaiting"
          />
        </Grid>
      </Grid>

      <Grid container spacing={2}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardHeader
              title="Pending Approvals"
              subheader="Changes awaiting your approval"
              avatar={<Avatar sx={{ backgroundColor: '#f44336' }}><ScheduleIcon /></Avatar>}
            />
            <CardContent>
              <List sx={{ p: 0 }}>
                <ListItem
                  sx={{
                    py: 1.5,
                    px: 0,
                    borderBottom: `1px solid ${theme.palette.divider}`,
                    '&:hover': { backgroundColor: alpha(theme.palette.primary.main, 0.05) },
                  }}
                >
                  <ListItemIcon sx={{ minWidth: 40 }}>
                    <WarningIcon sx={{ color: '#f57c00' }} />
                  </ListItemIcon>
                  <ListItemText
                    primary={
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>
                        Change Request ECN-001
                      </Typography>
                    }
                    secondary={<Typography variant="caption">Submitted 2 hours ago</Typography>}
                  />
                  <Button size="small" variant="contained" color="primary">
                    Review
                  </Button>
                </ListItem>
                <ListItem
                  sx={{
                    py: 1.5,
                    px: 0,
                    borderBottom: `1px solid ${theme.palette.divider}`,
                  }}
                >
                  <ListItemIcon sx={{ minWidth: 40 }}>
                    <WarningIcon sx={{ color: '#f57c00' }} />
                  </ListItemIcon>
                  <ListItemText
                    primary={
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>
                        Configuration Update
                      </Typography>
                    }
                    secondary={<Typography variant="caption">Submitted 5 hours ago</Typography>}
                  />
                  <Button size="small" variant="contained" color="primary">
                    Review
                  </Button>
                </ListItem>
              </List>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card>
            <CardHeader
              title="Recent Activity"
              subheader="Latest changes and updates"
              avatar={<Avatar sx={{ backgroundColor: '#4caf50' }}><AccessTimeIcon /></Avatar>}
            />
            <CardContent>
              <List sx={{ p: 0 }}>
                <ListItem sx={{ py: 1.5, px: 0, borderBottom: `1px solid ${theme.palette.divider}` }}>
                  <ListItemIcon sx={{ minWidth: 40 }}>
                    <Avatar sx={{ width: 32, height: 32, backgroundColor: alpha(theme.palette.primary.main, 0.2) }}>
                      <CheckCircleIcon />
                    </Avatar>
                  </ListItemIcon>
                  <ListItemText
                    primary={<Typography variant="body2" sx={{ fontWeight: 500 }}>Product PRD-021 approved</Typography>}
                    secondary={<Typography variant="caption">2 minutes ago</Typography>}
                  />
                </ListItem>
                <ListItem sx={{ py: 1.5, px: 0, borderBottom: `1px solid ${theme.palette.divider}` }}>
                  <ListItemIcon sx={{ minWidth: 40 }}>
                    <Avatar sx={{ width: 32, height: 32, backgroundColor: alpha(theme.palette.primary.main, 0.2) }}>
                      <DoneIcon />
                    </Avatar>
                  </ListItemIcon>
                  <ListItemText
                    primary={<Typography variant="body2" sx={{ fontWeight: 500 }}>New part variant created</Typography>}
                    secondary={<Typography variant="caption">15 minutes ago</Typography>}
                  />
                </ListItem>
                <ListItem sx={{ py: 1.5, px: 0 }}>
                  <ListItemIcon sx={{ minWidth: 40 }}>
                    <Avatar sx={{ width: 32, height: 32, backgroundColor: alpha(theme.palette.primary.main, 0.2) }}>
                      <CheckCircleIcon />
                    </Avatar>
                  </ListItemIcon>
                  <ListItemText
                    primary={<Typography variant="body2" sx={{ fontWeight: 500 }}>Change ECN-001 submitted</Typography>}
                    secondary={<Typography variant="caption">1 hour ago</Typography>}
                  />
                </ListItem>
              </List>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12}>
          <Card>
            <CardHeader
              title="Change Status Overview"
              subheader="Distribution of active change requests"
              avatar={<Avatar sx={{ backgroundColor: '#2196f3' }}><ChangeIcon /></Avatar>}
            />
            <CardContent>
              <Grid container spacing={2}>
                {[
                  { label: 'In Progress', value: 65, color: '#4caf50', count: 13 },
                  { label: 'Pending Review', value: 25, color: '#2196f3', count: 5 },
                  { label: 'Approved', value: 80, color: '#ff9800', count: 16 },
                  { label: 'Rejected', value: 10, color: '#f44336', count: 2 },
                ].map((item) => (
                  <Grid item xs={12} sm={6} md={3} key={item.label}>
                    <Box sx={{ textAlign: 'center' }}>
                      <Box sx={{ position: 'relative', display: 'inline-flex', mb: 1 }}>
                        <CircularProgress variant="determinate" value={item.value} size={100} sx={{ color: item.color }} />
                        <Box
                          sx={{
                            top: 0,
                            left: 0,
                            bottom: 0,
                            right: 0,
                            position: 'absolute',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                          }}
                        >
                          <Typography variant="body2" sx={{ fontWeight: 700 }}>
                            {item.value}%
                          </Typography>
                        </Box>
                      </Box>
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>
                        {item.label}
                      </Typography>
                      <Typography variant="caption" color="textSecondary">
                        {item.count} changes
                      </Typography>
                    </Box>
                  </Grid>
                ))}
              </Grid>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default DashboardPage;
