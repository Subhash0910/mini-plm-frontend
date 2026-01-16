import React from 'react';
import { Box, Button, Typography } from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';

const UsersPage = () => {
  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" sx={{ fontWeight: 700 }}>
          Users Management
        </Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
        >
          Add User
        </Button>
      </Box>
      <Typography color="textSecondary">Users management module - Coming soon</Typography>
    </Box>
  );
};

export default UsersPage;
