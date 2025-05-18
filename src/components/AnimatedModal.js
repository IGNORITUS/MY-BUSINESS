import React from 'react';
import { Modal, Box, IconButton } from '@mui/material';
import { Close } from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';

const AnimatedModal = ({ open, onClose, children }) => {
  return (
    <AnimatePresence>
      {open && (
        <Modal
          open={open}
          onClose={onClose}
          closeAfterTransition
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.3 }}
          >
            <Box
              sx={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                width: '90%',
                maxWidth: 600,
                bgcolor: 'background.paper',
                boxShadow: 24,
                p: 4,
                borderRadius: 2
              }}
            >
              <IconButton
                onClick={onClose}
                sx={{
                  position: 'absolute',
                  right: 8,
                  top: 8
                }}
              >
                <Close />
              </IconButton>
              {children}
            </Box>
          </motion.div>
        </Modal>
      )}
    </AnimatePresence>
  );
};

export default AnimatedModal; 