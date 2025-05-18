import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import {
  Container,
  Grid,
  Typography,
  Box,
  Button,
  Rating,
  Chip,
  Divider,
  Tabs,
  Tab,
  Card,
  CardContent,
  CircularProgress,
  Alert,
  TextField
} from '@mui/material';
import {
  ShoppingCart as CartIcon,
  Favorite as FavoriteIcon,
  FavoriteBorder as FavoriteBorderIcon
} from '@mui/icons-material';
import { useDispatch } from 'react-redux';
import { addToCart } from '../../store/slices/cartSlice';

const ProductDetail = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState(0);
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    fetchProduct();
  }, [id]);

  const fetchProduct = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/products/${id}`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Ошибка при загрузке товара');
      }

      setProduct(data);
      setError(null);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleQuantityChange = (event) => {
    const value = parseInt(event.target.value);
    if (!isNaN(value) && value > 0) {
      setQuantity(value);
    }
  };

  const handleAddToCart = () => {
    dispatch(addToCart({ ...product, quantity }));
  };

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const toggleFavorite = () => {
    setIsFavorite(!isFavorite);
  };

  if (loading) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '60vh'
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Alert severity="error">{error}</Alert>
      </Container>
    );
  }

  if (!product) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Alert severity="info">Товар не найден</Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Grid container spacing={4}>
        <Grid item xs={12} md={6}>
          <Box
            component="img"
            src={product.image}
            alt={product.name}
            sx={{
              width: '100%',
              height: 'auto',
              objectFit: 'contain',
              borderRadius: 2
            }}
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <Box sx={{ mb: 2 }}>
            {product.isNew && (
              <Chip
                label="Новинка"
                color="primary"
                size="small"
                sx={{ mr: 1 }}
              />
            )}
            {product.discount > 0 && (
              <Chip
                label={`-${product.discount}%`}
                color="error"
                size="small"
              />
            )}
          </Box>

          <Typography variant="h4" component="h1" gutterBottom>
            {product.name}
          </Typography>

          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <Rating value={product.rating} precision={0.5} readOnly />
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ ml: 1 }}
            >
              ({product.reviewsCount} отзывов)
            </Typography>
          </Box>

          <Box sx={{ mb: 3 }}>
            {product.discount > 0 ? (
              <>
                <Typography
                  variant="h4"
                  color="error"
                  component="span"
                  sx={{ mr: 2 }}
                >
                  {Math.round(
                    product.price * (1 - product.discount / 100)
                  ).toLocaleString()}{' '}
                  ₽
                </Typography>
                <Typography
                  variant="h6"
                  color="text.secondary"
                  component="span"
                  sx={{ textDecoration: 'line-through' }}
                >
                  {product.price.toLocaleString()} ₽
                </Typography>
              </>
            ) : (
              <Typography variant="h4" component="span">
                {product.price.toLocaleString()} ₽
              </Typography>
            )}
          </Box>

          <Box sx={{ mb: 3 }}>
            <Typography variant="body1" paragraph>
              {product.description}
            </Typography>
          </Box>

          <Box sx={{ mb: 3 }}>
            <Grid container spacing={2} alignItems="center">
              <Grid item xs={12} sm={4}>
                <TextField
                  type="number"
                  label="Количество"
                  value={quantity}
                  onChange={handleQuantityChange}
                  inputProps={{ min: 1 }}
                  fullWidth
                />
              </Grid>
              <Grid item xs={12} sm={8}>
                <Button
                  variant="contained"
                  color="primary"
                  size="large"
                  startIcon={<CartIcon />}
                  onClick={handleAddToCart}
                  fullWidth
                >
                  Добавить в корзину
                </Button>
              </Grid>
            </Grid>
          </Box>

          <Button
            variant="outlined"
            color="primary"
            startIcon={isFavorite ? <FavoriteIcon /> : <FavoriteBorderIcon />}
            onClick={toggleFavorite}
            fullWidth
          >
            {isFavorite ? 'В избранном' : 'Добавить в избранное'}
          </Button>
        </Grid>
      </Grid>

      <Box sx={{ mt: 6 }}>
        <Tabs value={activeTab} onChange={handleTabChange}>
          <Tab label="Характеристики" />
          <Tab label="Отзывы" />
          <Tab label="Доставка" />
        </Tabs>

        <Box sx={{ mt: 3 }}>
          {activeTab === 0 && (
            <Grid container spacing={2}>
              {product.specifications.map((spec, index) => (
                <Grid item xs={12} sm={6} key={index}>
                  <Card>
                    <CardContent>
                      <Typography variant="subtitle1" gutterBottom>
                        {spec.name}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {spec.value}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          )}

          {activeTab === 1 && (
            <Box>
              {product.reviews.map((review, index) => (
                <Box key={index} sx={{ mb: 3 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <Rating value={review.rating} readOnly size="small" />
                    <Typography
                      variant="subtitle2"
                      sx={{ ml: 1 }}
                    >
                      {review.author}
                    </Typography>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ ml: 'auto' }}
                    >
                      {new Date(review.date).toLocaleDateString()}
                    </Typography>
                  </Box>
                  <Typography variant="body1">{review.text}</Typography>
                  {index < product.reviews.length - 1 && (
                    <Divider sx={{ my: 2 }} />
                  )}
                </Box>
              ))}
            </Box>
          )}

          {activeTab === 2 && (
            <Box>
              <Typography variant="h6" gutterBottom>
                Способы доставки
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  <Card>
                    <CardContent>
                      <Typography variant="subtitle1" gutterBottom>
                        Курьерская доставка
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Доставка курьером до двери в течение 1-3 дней
                      </Typography>
                      <Typography variant="h6" color="primary" sx={{ mt: 1 }}>
                        Бесплатно
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Card>
                    <CardContent>
                      <Typography variant="subtitle1" gutterBottom>
                        Самовывоз
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Получите заказ в ближайшем пункте выдачи
                      </Typography>
                      <Typography variant="h6" color="primary" sx={{ mt: 1 }}>
                        Бесплатно
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>
            </Box>
          )}
        </Box>
      </Box>
    </Container>
  );
};

export default ProductDetail; 