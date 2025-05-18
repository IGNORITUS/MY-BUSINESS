import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  CardMedia,
  IconButton,
  Grid,
  Divider,
  CircularProgress
} from '@mui/material';
import {
  Add as AddIcon,
  Remove as RemoveIcon,
  Delete as DeleteIcon,
  ShoppingCart as ShoppingCartIcon
} from '@mui/icons-material';
import { FaTrash, FaMinus, FaPlus } from 'react-icons/fa';
import './Cart.css';

const Cart = () => {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchCart();
  }, []);

  const fetchCart = async () => {
    try {
      const response = await fetch('/api/cart', {
        credentials: 'include'
      });
      if (!response.ok) {
        throw new Error('Ошибка при загрузке корзины');
      }
      const data = await response.json();
      setCartItems(data.items);
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  const updateQuantity = async (itemId, newQuantity) => {
    try {
      const response = await fetch(`/api/cart/${itemId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ quantity: newQuantity }),
        credentials: 'include'
      });

      if (!response.ok) {
        throw new Error('Ошибка при обновлении количества');
      }

      fetchCart();
    } catch (err) {
      setError(err.message);
    }
  };

  const removeItem = async (itemId) => {
    try {
      const response = await fetch(`/api/cart/${itemId}`, {
        method: 'DELETE',
        credentials: 'include'
      });

      if (!response.ok) {
        throw new Error('Ошибка при удалении товара');
      }

      fetchCart();
    } catch (err) {
      setError(err.message);
    }
  };

  const clearCart = async () => {
    try {
      const response = await fetch('/api/cart', {
        method: 'DELETE',
        credentials: 'include'
      });

      if (!response.ok) {
        throw new Error('Ошибка при очистке корзины');
      }

      setCartItems([]);
    } catch (err) {
      setError(err.message);
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center" minHeight="400px">
        <Typography variant="h6" color="error" gutterBottom>
          {error}
        </Typography>
        <Button variant="contained" onClick={fetchCart}>
          Попробовать снова
        </Button>
      </Box>
    );
  }

  if (cartItems.length === 0) {
    return (
      <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center" minHeight="400px">
        <ShoppingCartIcon sx={{ fontSize: 60, color: 'text.secondary', mb: 2 }} />
        <Typography variant="h5" gutterBottom>
          Корзина пуста
        </Typography>
        <Typography variant="body1" color="text.secondary" gutterBottom>
          Добавьте товары из каталога, чтобы сделать заказ
        </Typography>
        <Button
          variant="contained"
          color="primary"
          onClick={() => navigate('/catalog')}
          sx={{ mt: 2 }}
        >
          Перейти в каталог
        </Button>
      </Box>
    );
  }

  const total = cartItems.reduce((sum, item) => sum + item.totalPrice, 0);

  return (
    <div className="cart">
      <h1>Корзина</h1>
      
      {cartItems.length > 0 ? (
        <>
          <div className="cart-items">
            {cartItems.map(item => (
              <div key={item.id} className="cart-item">
                <div className="item-image">
                  <img src={item.product.image} alt={item.product.name} />
                </div>
                
                <div className="item-info">
                  <h3>{item.product.name}</h3>
                  <div className="item-price">{item.product.discountPrice ? (
                    <>
                      <Typography
                        component="span"
                        sx={{ textDecoration: 'line-through', color: 'text.secondary', mr: 1 }}
                      >
                        {item.product.price} ₽
                      </Typography>
                      <Typography component="span" color="error">
                        {item.product.discountPrice} ₽
                      </Typography>
                    </>
                  ) : (
                    item.product.price
                  )}</div>
                </div>
                
                <div className="item-quantity">
                  <button 
                    className="quantity-btn"
                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                  >
                    <FaMinus />
                  </button>
                  <span>{item.quantity}</span>
                  <button 
                    className="quantity-btn"
                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                  >
                    <FaPlus />
                  </button>
                </div>
                
                <div className="item-total">
                  {item.totalPrice} ₽
                </div>
                
                <button 
                  className="remove-item"
                  onClick={() => removeItem(item.id)}
                >
                  <FaTrash />
                </button>
              </div>
            ))}
          </div>
          
          <div className="cart-summary">
            <div className="cart-total">
              <span>Итого:</span>
              <span>{total} ₽</span>
            </div>
            
            <button className="checkout-btn" onClick={() => navigate('/checkout')}>
              Оформить заказ
            </button>
          </div>
        </>
      ) : (
        <div className="empty-cart">
          <p>Ваша корзина пуста</p>
        </div>
      )}
    </div>
  );
};

export default Cart; 