import React from 'react';
import { Box, Typography } from '@mui/material';

const ProductDetailPage = () => {
  return (
    <Box>
      <Typography variant="h4" sx={{ fontWeight: 700, mb: 2 }}>
        Product Details
      </Typography>
      <Typography color="textSecondary">Product details - Coming soon</Typography>
    </Box>
  );
};

export default ProductDetailPage;
