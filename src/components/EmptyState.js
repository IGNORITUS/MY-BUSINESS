import React from 'react';
import { Box, Typography, Button } from '@mui/material';
import { motion } from 'framer-motion';

const EmptyState = ({ 
  icon: Icon,
  title,
  description,
  action,
  actionText
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
    >
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center',
          py: 6
        }}
      >
        {Icon && (
          <Box
            sx={{
              width: 120,
              height: 120,
              mb: 3,
              color: 'text.secondary',
              opacity: 0.7
            }}
          >
            <Icon sx={{ width: '100%', height: '100%' }} />
          </Box>
        )}
        <Typography variant="h5" gutterBottom>
          {title}
        </Typography>
        <Typography variant="body1" color="text.secondary" paragraph>
          {description}
        </Typography>
        {action && actionText && (
          <Button
            variant="contained"
            color="primary"
            onClick={action}
            sx={{ mt: 2 }}
          >
            {actionText}
          </Button>
        )}
      </Box>
    </motion.div>
  );
};

export default EmptyState; 