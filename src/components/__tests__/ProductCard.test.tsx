import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { ProductCard } from '../ProductCard';
import { CartProvider } from '../../contexts/CartContext';
import { useA11y } from '../../components/A11yProvider';

// Mock the useA11y hook
jest.mock('../../components/A11yProvider', () => ({
  useA11y: jest.fn(),
}));

describe('ProductCard', () => {
  const mockProduct = {
    id: '1',
    name: 'Test Product',
    price: 99.99,
    description: 'Test Description',
    image: '/test-image.jpg',
    category: 'Test Category',
    stock: 10,
    rating: 4.5,
    reviews: 100,
  };

  const mockAddToCart = jest.fn();
  const mockAnnounceToScreenReader = jest.fn();

  beforeEach(() => {
    (useA11y as jest.Mock).mockReturnValue({
      announceToScreenReader: mockAnnounceToScreenReader,
    });
  });

  it('renders product information correctly', () => {
    render(
      <CartProvider>
        <ProductCard product={mockProduct} />
      </CartProvider>
    );

    expect(screen.getByText(mockProduct.name)).toBeInTheDocument();
    expect(screen.getByText(`$${mockProduct.price}`)).toBeInTheDocument();
    expect(screen.getByText(mockProduct.description)).toBeInTheDocument();
    expect(screen.getByAltText(mockProduct.name)).toHaveAttribute('src', mockProduct.image);
  });

  it('handles add to cart click', () => {
    render(
      <CartProvider>
        <ProductCard product={mockProduct} />
      </CartProvider>
    );

    const addToCartButton = screen.getByRole('button', { name: /add to cart/i });
    fireEvent.click(addToCartButton);

    expect(mockAnnounceToScreenReader).toHaveBeenCalledWith('Added Test Product to cart');
  });

  it('displays out of stock message when stock is 0', () => {
    const outOfStockProduct = { ...mockProduct, stock: 0 };

    render(
      <CartProvider>
        <ProductCard product={outOfStockProduct} />
      </CartProvider>
    );

    expect(screen.getByText(/out of stock/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /add to cart/i })).toBeDisabled();
  });

  it('displays rating and reviews', () => {
    render(
      <CartProvider>
        <ProductCard product={mockProduct} />
      </CartProvider>
    );

    expect(screen.getByText(`${mockProduct.rating} (${mockProduct.reviews} reviews)`)).toBeInTheDocument();
  });

  it('handles image loading error', () => {
    render(
      <CartProvider>
        <ProductCard product={mockProduct} />
      </CartProvider>
    );

    const image = screen.getByAltText(mockProduct.name);
    fireEvent.error(image);

    expect(image).toHaveAttribute('src', '/placeholder.jpg');
  });

  it('applies discount when available', () => {
    const discountedProduct = {
      ...mockProduct,
      originalPrice: 149.99,
      discount: 33,
    };

    render(
      <CartProvider>
        <ProductCard product={discountedProduct} />
      </CartProvider>
    );

    expect(screen.getByText('$149.99')).toHaveStyle('text-decoration: line-through');
    expect(screen.getByText('33% OFF')).toBeInTheDocument();
  });

  it('handles quick view functionality', () => {
    render(
      <CartProvider>
        <ProductCard product={mockProduct} />
      </CartProvider>
    );

    const quickViewButton = screen.getByRole('button', { name: /quick view/i });
    fireEvent.click(quickViewButton);

    expect(screen.getByRole('dialog')).toBeInTheDocument();
    expect(screen.getByText('Product Details')).toBeInTheDocument();
  });

  it('handles wishlist functionality', () => {
    render(
      <CartProvider>
        <ProductCard product={mockProduct} />
      </CartProvider>
    );

    const wishlistButton = screen.getByRole('button', { name: /add to wishlist/i });
    fireEvent.click(wishlistButton);

    expect(mockAnnounceToScreenReader).toHaveBeenCalledWith('Added Test Product to wishlist');
  });

  it('handles share functionality', () => {
    const mockShare = jest.fn();
    Object.assign(navigator, {
      share: mockShare,
    });

    render(
      <CartProvider>
        <ProductCard product={mockProduct} />
      </CartProvider>
    );

    const shareButton = screen.getByRole('button', { name: /share/i });
    fireEvent.click(shareButton);

    expect(mockShare).toHaveBeenCalledWith({
      title: mockProduct.name,
      text: mockProduct.description,
      url: window.location.href,
    });
  });

  it('handles keyboard navigation', () => {
    render(
      <CartProvider>
        <ProductCard product={mockProduct} />
      </CartProvider>
    );

    const card = screen.getByRole('article');
    fireEvent.keyDown(card, { key: 'Enter' });

    expect(mockAnnounceToScreenReader).toHaveBeenCalledWith('Viewing Test Product details');
  });
}); 