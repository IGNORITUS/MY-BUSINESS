import React from 'react';
import { Box, Collapse } from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';

const AnimatedFilter = ({ open, children }) => {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Box
            sx={{
              overflow: 'hidden',
              p: 2,
              bgcolor: 'background.paper',
              borderRadius: 1,
              boxShadow: 1
            }}
          >
            {children}
          </Box>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default AnimatedFilter; 