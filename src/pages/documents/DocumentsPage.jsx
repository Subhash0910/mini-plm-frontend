import React from 'react';
import { Box, Button, Typography } from '@mui/material';
import { Upload as UploadIcon } from '@mui/icons-material';

const DocumentsPage = () => {
  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" sx={{ fontWeight: 700 }}>
          Documents
        </Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<UploadIcon />}
        >
          Upload Document
        </Button>
      </Box>
      <Typography color="textSecondary">Documents module - Coming soon</Typography>
    </Box>
  );
};

export default DocumentsPage;
