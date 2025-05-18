import React from 'react';
import { Alert } from '@mui/material';

const ValidationError = ({ error }) => {
  if (!error) return null;

  return (
    <Alert severity="error" sx={{ mt: 1, mb: 2 }}>
      {error}
    </Alert>
  );
};

export default ValidationError; 