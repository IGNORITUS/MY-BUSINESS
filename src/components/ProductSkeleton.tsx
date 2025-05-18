import React from 'react';
import { Card, CardContent, Skeleton, Box } from '@mui/material';

const ProductSkeleton: React.FC = () => {
  return (
    <Card sx={{ height: '100%' }}>
      <Skeleton
        variant="rectangular"
        height={200}
        animation="wave"
        sx={{ bgcolor: 'grey.100' }}
      />
      <CardContent>
        <Skeleton
          variant="text"
          height={24}
          width="80%"
          animation="wave"
          sx={{ mb: 1 }}
        />
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
          <Skeleton
            variant="rectangular"
            height={20}
            width={100}
            animation="wave"
            sx={{ mr: 1 }}
          />
          <Skeleton
            variant="text"
            height={20}
            width={40}
            animation="wave"
          />
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Skeleton
            variant="text"
            height={28}
            width={100}
            animation="wave"
          />
          <Skeleton
            variant="rectangular"
            height={24}
            width={60}
            animation="wave"
          />
        </Box>
      </CardContent>
    </Card>
  );
};

export default ProductSkeleton; 