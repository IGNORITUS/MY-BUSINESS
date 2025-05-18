import React from 'react';
import { motion } from 'framer-motion';

const shimmer = {
  initial: { x: '-100%' },
  animate: {
    x: '100%',
    transition: {
      repeat: Infinity,
      duration: 1.5,
      ease: 'linear'
    }
  }
};

const SkeletonLoader = ({ type = 'text', width = '100%', height = '20px', className = '' }) => {
  const getStyles = () => {
    switch (type) {
      case 'circle':
        return {
          width: height,
          height: height,
          borderRadius: '50%'
        };
      case 'image':
        return {
          width: width,
          height: height,
          borderRadius: '8px'
        };
      case 'text':
      default:
        return {
          width: width,
          height: height,
          borderRadius: '4px'
        };
    }
  };

  return (
    <div
      className={`relative overflow-hidden bg-gray-200 ${className}`}
      style={getStyles()}
    >
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent"
        variants={shimmer}
        initial="initial"
        animate="animate"
      />
    </div>
  );
};

export const ProductSkeleton = () => (
  <div className="p-4 border rounded-lg shadow-sm">
    <SkeletonLoader type="image" height="200px" className="mb-4" />
    <SkeletonLoader width="80%" className="mb-2" />
    <SkeletonLoader width="60%" className="mb-4" />
    <div className="flex justify-between items-center">
      <SkeletonLoader width="40%" />
      <SkeletonLoader type="circle" height="40px" />
    </div>
  </div>
);

export const CategorySkeleton = () => (
  <div className="p-4 border rounded-lg">
    <SkeletonLoader type="image" height="150px" className="mb-4" />
    <SkeletonLoader width="70%" className="mb-2" />
    <SkeletonLoader width="50%" />
  </div>
);

export const CartItemSkeleton = () => (
  <div className="flex items-center p-4 border-b">
    <SkeletonLoader type="image" width="100px" height="100px" className="mr-4" />
    <div className="flex-1">
      <SkeletonLoader width="60%" className="mb-2" />
      <SkeletonLoader width="40%" className="mb-4" />
      <div className="flex justify-between">
        <SkeletonLoader width="30%" />
        <SkeletonLoader type="circle" height="30px" />
      </div>
    </div>
  </div>
);

export default SkeletonLoader; 