import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import Cart from '../../components/cart/Cart';
import { addToCart, removeFromCart, updateQuantity } from '../../store/slices/cartSlice';

const mockStore = configureStore([thunk]);

describe('Cart Integration', () => {
  const mockProducts = [
    {
      id: '1',
      name: 'Product 1',
      price: 1000,
      image: 'product1.jpg',
      quantity: 1
    },
    {
      id: '2',
      name: 'Product 2',
      price: 2000,
      image: 'product2.jpg',
      quantity: 2
    }
  ];

  let store: any;

  beforeEach(() => {
    store = mockStore({
      cart: {
        items: mockProducts,
        total: 5000
      }
    });
  });

  it('renders cart items correctly', () => {
    render(
      <Provider store={store}>
        <Cart />
      </Provider>
    );

    expect(screen.getByText('Product 1')).toBeInTheDocument();
    expect(screen.getByText('Product 2')).toBeInTheDocument();
    expect(screen.getByText('5 000 ₽')).toBeInTheDocument();
  });

  it('handles quantity update', async () => {
    render(
      <Provider store={store}>
        <Cart />
      </Provider>
    );

    const quantityInput = screen.getAllByRole('spinbutton')[0];
    fireEvent.change(quantityInput, { target: { value: '3' } });

    await waitFor(() => {
      const actions = store.getActions();
      expect(actions[0]).toEqual(updateQuantity({ id: '1', quantity: 3 }));
    });
  });

  it('handles remove item', async () => {
    render(
      <Provider store={store}>
        <Cart />
      </Provider>
    );

    const removeButtons = screen.getAllByText('Удалить');
    fireEvent.click(removeButtons[0]);

    await waitFor(() => {
      const actions = store.getActions();
      expect(actions[0]).toEqual(removeFromCart('1'));
    });
  });

  it('calculates total correctly', () => {
    render(
      <Provider store={store}>
        <Cart />
      </Provider>
    );

    const total = screen.getByText('5 000 ₽');
    expect(total).toBeInTheDocument();
  });

  it('handles empty cart state', () => {
    store = mockStore({
      cart: {
        items: [],
        total: 0
      }
    });

    render(
      <Provider store={store}>
        <Cart />
      </Provider>
    );

    expect(screen.getByText('Корзина пуста')).toBeInTheDocument();
  });
}); 