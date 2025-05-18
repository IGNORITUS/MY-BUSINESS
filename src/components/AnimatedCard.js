import React from 'react';
import { Card } from '@mui/material';
import { motion } from 'framer-motion';

const AnimatedCard = ({ children, ...props }) => {
  return (
    <motion.div
      whileHover={{ y: -5 }}
      transition={{ duration: 0.2 }}
    >
      <Card {...props}>
        {children}
      </Card>
    </motion.div>
  );
};

export default AnimatedCard; 