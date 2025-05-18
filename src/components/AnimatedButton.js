import React from 'react';
import { Button } from '@mui/material';
import { motion } from 'framer-motion';

const AnimatedButton = ({ children, ...props }) => {
  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      transition={{ duration: 0.2 }}
    >
      <Button {...props}>
        {children}
      </Button>
    </motion.div>
  );
};

export default AnimatedButton; 