import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import ProductCard from '../ProductCard';

const mockStore = configureStore([]);

describe('ProductCard', () => {
  const mockProduct = {
    id: '1',
    name: 'Test Product',
    description: 'Test Description',
    price: 1000,
    image: 'test.jpg',
    category: 'Test Category',
    stock: 10,
    rating: 4.5
  };

  let store: any;

  beforeEach(() => {
    store = mockStore({
      favorites: {
        items: []
      }
    });
  });

  it('renders product information correctly', () => {
    render(
      <Provider store={store}>
        <ProductCard {...mockProduct} />
      </Provider>
    );

    expect(screen.getByText(mockProduct.name)).toBeInTheDocument();
    expect(screen.getByText(mockProduct.description)).toBeInTheDocument();
    expect(screen.getByText(mockProduct.category)).toBeInTheDocument();
    expect(screen.getByText('1 000 ₽')).toBeInTheDocument();
    expect(screen.getByText('В корзину')).toBeInTheDocument();
  });

  it('displays out of stock message when stock is 0', () => {
    render(
      <Provider store={store}>
        <ProductCard {...mockProduct} stock={0} />
      </Provider>
    );

    expect(screen.getByText('Нет в наличии')).toBeInTheDocument();
    expect(screen.getByText('Нет в наличии')).toBeDisabled();
  });

  it('handles add to cart click', () => {
    render(
      <Provider store={store}>
        <ProductCard {...mockProduct} />
      </Provider>
    );

    fireEvent.click(screen.getByText('В корзину'));

    const actions = store.getActions();
    expect(actions[0]).toEqual({
      type: 'cart/addToCart',
      payload: {
        id: mockProduct.id,
        name: mockProduct.name,
        price: mockProduct.price,
        image: mockProduct.image
      }
    });
  });

  it('handles favorite button click', () => {
    render(
      <Provider store={store}>
        <ProductCard {...mockProduct} />
      </Provider>
    );

    const favoriteButton = screen.getByRole('button', { name: /🤍/ });
    fireEvent.click(favoriteButton);

    const actions = store.getActions();
    expect(actions[0]).toEqual({
      type: 'favorites/addToFavorites',
      payload: {
        id: mockProduct.id,
        name: mockProduct.name,
        price: mockProduct.price,
        image: mockProduct.image
      }
    });
  });

  it('calls onProductClick when card is clicked', () => {
    const handleClick = jest.fn();
    render(
      <Provider store={store}>
        <ProductCard {...mockProduct} onProductClick={handleClick} />
      </Provider>
    );

    fireEvent.click(screen.getByText(mockProduct.name));
    expect(handleClick).toHaveBeenCalledWith(mockProduct.id);
  });
}); 