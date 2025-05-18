import { useEffect, useState, useRef } from 'react';

interface UseLazyLoadOptions {
  threshold?: number;
  rootMargin?: string;
}

export function useLazyLoad<T extends HTMLElement>({
  threshold = 0,
  rootMargin = '0px'
}: UseLazyLoadOptions = {}) {
  const [isVisible, setIsVisible] = useState(false);
  const elementRef = useRef<T>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      {
        threshold,
        rootMargin
      }
    );

    const currentElement = elementRef.current;

    if (currentElement) {
      observer.observe(currentElement);
    }

    return () => {
      if (currentElement) {
        observer.unobserve(currentElement);
      }
    };
  }, [threshold, rootMargin]);

  return { elementRef, isVisible };
} 