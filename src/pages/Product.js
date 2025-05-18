import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  Box,
  Container,
  Grid,
  Typography,
  Button,
  Rating,
  Divider,
  Paper,
  ImageList,
  ImageListItem,
  TextField,
  Alert,
} from '@mui/material';
import {
  ShoppingCart as CartIcon,
  Favorite as FavoriteIcon,
  FavoriteBorder as FavoriteBorderIcon,
} from '@mui/icons-material';
import { fetchProduct } from '../redux/slices/productsSlice';
import { addToCart } from '../redux/slices/cartSlice';
import { addToFavorites, removeFromFavorites } from '../redux/slices/favoritesSlice';
import Loading from '../components/Loading';
import Error from '../components/Error';

const Product = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);

  const { product, loading, error } = useSelector((state) => state.products);
  const { items: cartItems } = useSelector((state) => state.cart);
  const { items: favoriteItems } = useSelector((state) => state.favorites);

  const isInCart = cartItems.some((item) => item._id === id);
  const isFavorite = favoriteItems.some((item) => item._id === id);

  useEffect(() => {
    dispatch(fetchProduct(id));
  }, [dispatch, id]);

  const handleAddToCart = () => {
    dispatch(addToCart({ ...product, quantity }));
  };

  const handleToggleFavorite = () => {
    if (isFavorite) {
      dispatch(removeFromFavorites(id));
    } else {
      dispatch(addToFavorites(product));
    }
  };

  const handleQuantityChange = (event) => {
    const value = parseInt(event.target.value);
    if (value > 0) {
      setQuantity(value);
    }
  };

  if (loading) {
    return <Loading />;
  }

  if (error) {
    return <Error message={error} />;
  }

  if (!product) {
    return <Error message="Товар не найден" />;
  }

  return (
    <Container maxWidth="lg">
      <Box sx={{ py: 4 }}>
        <Grid container spacing={4}>
          {/* Галерея изображений */}
          <Grid item xs={12} md={6}>
            <Paper
              sx={{
                p: 2,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
              }}
            >
              <Box
                component="img"
                src={product.images[selectedImage]}
                alt={product.name}
                sx={{
                  width: '100%',
                  height: 400,
                  objectFit: 'contain',
                  mb: 2,
                }}
              />
              <ImageList
                sx={{ width: '100%', height: 100 }}
                cols={4}
                rowHeight={100}
              >
                {product.images.map((image, index) => (
                  <ImageListItem
                    key={index}
                    sx={{
                      cursor: 'pointer',
                      border: selectedImage === index ? 2 : 0,
                      borderColor: 'primary.main',
                    }}
                    onClick={() => setSelectedImage(index)}
                  >
                    <img
                      src={image}
                      alt={`${product.name} ${index + 1}`}
                      loading="lazy"
                    />
                  </ImageListItem>
                ))}
              </ImageList>
            </Paper>
          </Grid>

          {/* Информация о товаре */}
          <Grid item xs={12} md={6}>
            <Typography variant="h4" component="h1" gutterBottom>
              {product.name}
            </Typography>

            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <Rating value={product.rating} readOnly precision={0.5} />
              <Typography variant="body2" color="text.secondary" sx={{ ml: 1 }}>
                ({product.reviewsCount} отзывов)
              </Typography>
            </Box>

            <Typography variant="h5" color="primary" gutterBottom>
              {product.price.toLocaleString('ru-RU')} ₽
            </Typography>

            <Box sx={{ my: 3 }}>
              <Typography variant="subtitle1" gutterBottom>
                Количество:
              </Typography>
              <TextField
                type="number"
                value={quantity}
                onChange={handleQuantityChange}
                inputProps={{ min: 1 }}
                sx={{ width: 100 }}
              />
            </Box>

            <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
              <Button
                variant="contained"
                size="large"
                startIcon={<CartIcon />}
                onClick={handleAddToCart}
                disabled={isInCart}
                fullWidth
              >
                {isInCart ? 'В корзине' : 'Добавить в корзину'}
              </Button>
              <Button
                variant="outlined"
                size="large"
                onClick={handleToggleFavorite}
                startIcon={isFavorite ? <FavoriteIcon /> : <FavoriteBorderIcon />}
              >
                {isFavorite ? 'В избранном' : 'В избранное'}
              </Button>
            </Box>

            <Divider sx={{ my: 3 }} />

            <Typography variant="h6" gutterBottom>
              Описание
            </Typography>
            <Typography variant="body1" paragraph>
              {product.description}
            </Typography>

            {product.specifications && (
              <>
                <Typography variant="h6" gutterBottom>
                  Характеристики
                </Typography>
                <Grid container spacing={2}>
                  {Object.entries(product.specifications).map(([key, value]) => (
                    <Grid item xs={12} key={key}>
                      <Box
                        sx={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          py: 1,
                          borderBottom: 1,
                          borderColor: 'divider',
                        }}
                      >
                        <Typography variant="body2" color="text.secondary">
                          {key}
                        </Typography>
                        <Typography variant="body2">{value}</Typography>
                      </Box>
                    </Grid>
                  ))}
                </Grid>
              </>
            )}

            {product.stock <= 5 && product.stock > 0 && (
              <Alert severity="warning" sx={{ mt: 2 }}>
                Осталось всего {product.stock} шт.
              </Alert>
            )}

            {product.stock === 0 && (
              <Alert severity="error" sx={{ mt: 2 }}>
                Товар закончился
              </Alert>
            )}
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
};

export default Product; 