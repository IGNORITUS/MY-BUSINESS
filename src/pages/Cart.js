import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { removeFromCart, updateQuantity } from '../store/slices/cartSlice';
import './Cart.css';

const Cart = () => {
  const dispatch = useDispatch();
  const cartItems = useSelector(state => state.cart.items);
  const total = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const handleQuantityChange = (itemId, newQuantity) => {
    if (newQuantity > 0) {
      dispatch(updateQuantity({ id: itemId, quantity: newQuantity }));
    }
  };

  const handleRemoveItem = (itemId) => {
    dispatch(removeFromCart(itemId));
  };

  if (cartItems.length === 0) {
    return (
      <div className="cart-empty">
        <h2>Ваша корзина пуста</h2>
        <p>Добавьте товары из каталога</p>
      </div>
    );
  }

  return (
    <div className="cart-container">
      <h2>Корзина</h2>
      
      <div className="cart-items">
        {cartItems.map(item => (
          <div key={item.id} className="cart-item">
            <div className="item-image">
              <img src={item.image} alt={item.name} />
            </div>
            
            <div className="item-details">
              <h3>{item.name}</h3>
              <p className="item-price">{item.price} ₽</p>
            </div>
            
            <div className="item-quantity">
              <button 
                onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                disabled={item.quantity <= 1}
              >
                -
              </button>
              <span>{item.quantity}</span>
              <button 
                onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
              >
                +
              </button>
            </div>
            
            <div className="item-total">
              {item.price * item.quantity} ₽
            </div>
            
            <button 
              className="remove-item"
              onClick={() => handleRemoveItem(item.id)}
            >
              ✕
            </button>
          </div>
        ))}
      </div>
      
      <div className="cart-summary">
        <div className="summary-row">
          <span>Итого:</span>
          <span className="total-amount">{total} ₽</span>
        </div>
        
        <button className="checkout-button">
          Оформить заказ
        </button>
      </div>
    </div>
  );
};

export default Cart; 