import React from 'react';
import { Box, Typography, Button } from '@mui/material';
import { Error as ErrorIcon } from '@mui/icons-material';
import { motion } from 'framer-motion';

const ErrorMessage = ({ message, onRetry }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
    >
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center',
          py: 4
        }}
      >
        <ErrorIcon
          color="error"
          sx={{ fontSize: 60, mb: 2 }}
        />
        <Typography variant="h6" color="error" gutterBottom>
          Произошла ошибка
        </Typography>
        <Typography variant="body1" color="text.secondary" paragraph>
          {message}
        </Typography>
        {onRetry && (
          <Button
            variant="contained"
            color="primary"
            onClick={onRetry}
            sx={{ mt: 2 }}
          >
            Попробовать снова
          </Button>
        )}
      </Box>
    </motion.div>
  );
};

export default ErrorMessage; 