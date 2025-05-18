import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import {
  Box,
  Container,
  Grid,
  Typography,
  Card,
  CardContent,
  CardMedia,
  CardActions,
  Button,
  IconButton,
  useTheme,
} from '@mui/material';
import {
  ShoppingCart as CartIcon,
  Favorite as FavoriteIcon,
  Delete as DeleteIcon,
} from '@mui/icons-material';
import { removeFromFavorites, fetchFavorites } from '../store/slices/favoritesSlice';
import { addToCart } from '../store/slices/cartSlice';
import { formatPrice } from '../utils/format';
import './Favorites.css';

const Favorites = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const theme = useTheme();
  const favorites = useSelector((state) => state.favorites);
  const cart = useSelector((state) => state.cart);

  useEffect(() => {
    dispatch(fetchFavorites());
  }, [dispatch]);

  const handleRemoveFromFavorites = (id) => {
    dispatch(removeFromFavorites(id));
  };

  const handleAddToCart = (product) => {
    dispatch(addToCart({ ...product, quantity: 1 }));
  };

  if (favorites.loading) {
    return (
      <Container maxWidth="lg">
        <Box sx={{ py: 8, textAlign: 'center' }}>
          <Typography variant="h5" sx={{ fontFamily: 'Playfair Display, serif' }}>
            Загрузка...
          </Typography>
        </Box>
      </Container>
    );
  }

  if (favorites.error) {
    return (
      <Container maxWidth="lg">
        <Box sx={{ py: 8, textAlign: 'center' }}>
          <Typography variant="h5" color="error" sx={{ fontFamily: 'Playfair Display, serif' }}>
            {favorites.error}
          </Typography>
        </Box>
      </Container>
    );
  }

  if (!favorites.items || favorites.items.length === 0) {
    return (
      <div className="favorites-empty">
        <h2>В избранном пока ничего нет</h2>
        <p>Добавляйте понравившиеся товары в избранное, чтобы не потерять их</p>
      </div>
    );
  }

  return (
    <div className="favorites">
      <h2>Избранное</h2>
      <div className="favorites-grid">
        {favorites.items.map(item => (
          <div key={item.id} className="favorite-item">
            <img src={item.images[0]} alt={item.name} />
            <div className="item-details">
              <h3>{item.name}</h3>
              <p className="price">{formatPrice(item.price)} ₽</p>
              <button className="remove-btn" onClick={() => handleRemoveFromFavorites(item.id)}>
                Удалить из избранного
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Favorites; 