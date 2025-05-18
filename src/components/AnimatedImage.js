import React from 'react';
import { motion } from 'framer-motion';

const AnimatedImage = ({ src, alt, ...props }) => {
  return (
    <motion.img
      src={src}
      alt={alt}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      whileHover={{ scale: 1.05 }}
      {...props}
    />
  );
};

export default AnimatedImage; 