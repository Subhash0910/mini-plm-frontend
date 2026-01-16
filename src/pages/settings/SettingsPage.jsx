import React from 'react';
import { Box, Card, CardContent, CardHeader, TextField, Button, Typography } from '@mui/material';

const SettingsPage = () => {
  return (
    <Box>
      <Typography variant="h4" sx={{ fontWeight: 700, mb: 3 }}>
        Settings
      </Typography>
      <Card>
        <CardHeader title="User Profile" />
        <CardContent>
          <TextField fullWidth label="Full Name" margin="normal" />
          <TextField fullWidth label="Email" type="email" margin="normal" />
          <TextField fullWidth label="Phone" margin="normal" />
          <Button variant="contained" color="primary" sx={{ mt: 2 }}>
            Save Changes
          </Button>
        </CardContent>
      </Card>
    </Box>
  );
};

export default SettingsPage;
