import React from 'react';
import { Box, CircularProgress, Typography } from '@mui/material';
import { motion } from 'framer-motion';

const LoadingProgress = ({ message = 'Загрузка...' }) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          py: 4
        }}
      >
        <CircularProgress
          size={60}
          thickness={4}
          sx={{
            color: 'primary.main',
            mb: 2
          }}
        />
        <Typography
          variant="body1"
          color="text.secondary"
          sx={{
            animation: 'pulse 1.5s ease-in-out infinite'
          }}
        >
          {message}
        </Typography>
      </Box>
    </motion.div>
  );
};

export default LoadingProgress; 