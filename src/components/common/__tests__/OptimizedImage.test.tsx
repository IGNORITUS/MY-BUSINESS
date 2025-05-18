import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import OptimizedImage from '../OptimizedImage';

describe('OptimizedImage', () => {
  const mockProps = {
    src: 'test.jpg',
    alt: 'Test Image'
  };

  it('renders with placeholder initially', () => {
    render(<OptimizedImage {...mockProps} />);
    const image = screen.getByAltText(mockProps.alt);
    expect(image).toHaveAttribute('src', expect.stringContaining('data:image/svg+xml'));
  });

  it('handles image load successfully', () => {
    render(<OptimizedImage {...mockProps} />);
    const image = screen.getByAltText(mockProps.alt);
    
    // Симулируем успешную загрузку изображения
    fireEvent.load(image);
    
    expect(image).toHaveAttribute('src', mockProps.src);
    expect(image).toHaveClass('loaded');
  });

  it('handles image load error', () => {
    const onError = jest.fn();
    render(<OptimizedImage {...mockProps} onError={onError} />);
    const image = screen.getByAltText(mockProps.alt);
    
    // Симулируем ошибку загрузки
    fireEvent.error(image);
    
    expect(onError).toHaveBeenCalled();
    expect(image).toHaveAttribute('src', expect.stringContaining('data:image/svg+xml'));
  });

  it('applies custom className', () => {
    const className = 'custom-class';
    render(<OptimizedImage {...mockProps} className={className} />);
    const container = screen.getByAltText(mockProps.alt).parentElement;
    expect(container).toHaveClass(className);
  });

  it('applies custom dimensions', () => {
    const width = 200;
    const height = 150;
    render(<OptimizedImage {...mockProps} width={width} height={height} />);
    const container = screen.getByAltText(mockProps.alt).parentElement;
    expect(container).toHaveStyle({
      width: `${width}px`,
      height: `${height}px`
    });
  });
}); 