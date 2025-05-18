import '@testing-library/jest-dom';
import { configure } from '@testing-library/react';

// Настройка таймаута для тестов
configure({ asyncUtilTimeout: 5000 });

// Мок для IntersectionObserver
class IntersectionObserver {
  observe = jest.fn();
  unobserve = jest.fn();
  disconnect = jest.fn();
}

Object.defineProperty(window, 'IntersectionObserver', {
  writable: true,
  configurable: true,
  value: IntersectionObserver
});

// Мок для ResizeObserver
class ResizeObserver {
  observe = jest.fn();
  unobserve = jest.fn();
  disconnect = jest.fn();
}

Object.defineProperty(window, 'ResizeObserver', {
  writable: true,
  configurable: true,
  value: ResizeObserver
}); 