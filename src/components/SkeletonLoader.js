import React from 'react';
import { Skeleton, Grid, Card, CardContent, Box } from '@mui/material';

const ProductSkeleton = () => (
  <Card>
    <Skeleton variant="rectangular" height={200} />
    <CardContent>
      <Skeleton variant="text" height={30} />
      <Skeleton variant="text" height={20} width="60%" />
      <Box sx={{ mt: 2 }}>
        <Skeleton variant="rectangular" height={40} />
      </Box>
    </CardContent>
  </Card>
);

const CategorySkeleton = () => (
  <Card>
    <Skeleton variant="rectangular" height={150} />
    <CardContent>
      <Skeleton variant="text" height={24} />
    </CardContent>
  </Card>
);

const SkeletonLoader = ({ type, count = 4 }) => {
  const renderSkeleton = () => {
    switch (type) {
      case 'product':
        return <ProductSkeleton />;
      case 'category':
        return <CategorySkeleton />;
      default:
        return <ProductSkeleton />;
    }
  };

  return (
    <Grid container spacing={3}>
      {[...Array(count)].map((_, index) => (
        <Grid item xs={12} sm={6} md={3} key={index}>
          {renderSkeleton()}
        </Grid>
      ))}
    </Grid>
  );
};

export default SkeletonLoader; 