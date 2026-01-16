import React from 'react';
import { Box, Button, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { Add as AddIcon } from '@mui/icons-material';

const PartsPage = () => {
  const navigate = useNavigate();

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" sx={{ fontWeight: 700 }}>
          Parts
        </Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={() => navigate('/parts/create')}
        >
          New Part
        </Button>
      </Box>
      <Typography color="textSecondary">Parts module - Coming soon</Typography>
    </Box>
  );
};

export default PartsPage;
