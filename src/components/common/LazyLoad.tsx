import React, { Suspense } from 'react';
import { useLazyLoad } from '../../hooks/useLazyLoad';
import LoadingSpinner from './LoadingSpinner';

interface LazyLoadProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  threshold?: number;
  rootMargin?: string;
}

const LazyLoad: React.FC<LazyLoadProps> = ({
  children,
  fallback = <LoadingSpinner size="medium" />,
  threshold = 0,
  rootMargin = '0px'
}) => {
  const { elementRef, isVisible } = useLazyLoad<HTMLDivElement>({
    threshold,
    rootMargin
  });

  return (
    <div ref={elementRef}>
      {isVisible ? (
        <Suspense fallback={fallback}>
          {children}
        </Suspense>
      ) : (
        fallback
      )}
    </div>
  );
};

export default LazyLoad; 