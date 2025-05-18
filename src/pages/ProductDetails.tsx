import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import {
  Box,
  Container,
  Grid,
  Typography,
  Rating,
  Chip,
  Button,
  IconButton,
  Divider,
  TextField,
  Avatar,
  useTheme,
  useMediaQuery,
  Tabs,
  Tab,
  Paper,
} from '@mui/material';
import { motion } from 'framer-motion';
import { styled } from '@mui/material/styles';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import axios from 'axios';

const ProductImage = styled('img')(({ theme }) => ({
  width: '100%',
  height: 'auto',
  maxHeight: '500px',
  objectFit: 'contain',
  borderRadius: theme.shape.borderRadius,
}));

const ThumbnailImage = styled('img')(({ theme }) => ({
  width: '80px',
  height: '80px',
  objectFit: 'contain',
  borderRadius: theme.shape.borderRadius,
  cursor: 'pointer',
  border: `2px solid ${theme.palette.grey[200]}`,
  transition: 'all 0.3s ease',
  '&:hover': {
    borderColor: theme.palette.primary.main,
  },
}));

const ReviewCard = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  marginBottom: theme.spacing(2),
}));

const ProductDetails: React.FC = () => {
  const { id } = useParams();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const [product, setProduct] = useState(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const [currency, setCurrency] = useState('RUB');
  const [quantity, setQuantity] = useState(1);
  const [favorites, setFavorites] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [activeTab, setActiveTab] = useState(0);
  const [loading, setLoading] = useState(true);

  const exchangeRates = {
    RUB: 1,
    USD: 0.011,
    EUR: 0.01,
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [productRes, favoritesRes, reviewsRes] = await Promise.all([
          axios.get(`http://localhost:5000/api/products/${id}`),
          axios.get('http://localhost:5000/api/favorites'),
          axios.get(`http://localhost:5000/api/products/${id}/reviews`),
        ]);
        setProduct(productRes.data);
        setFavorites(favoritesRes.data);
        setReviews(reviewsRes.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  const handleAddToCart = async () => {
    try {
      await axios.post('http://localhost:5000/api/cart/add', {
        productId: id,
        quantity,
      });
      // Показать уведомление об успешном добавлении
    } catch (error) {
      console.error('Error adding to cart:', error);
    }
  };

  const handleToggleFavorite = async () => {
    try {
      if (favorites.includes(id)) {
        await axios.delete(`http://localhost:5000/api/favorites/${id}`);
        setFavorites(favorites.filter(favId => favId !== id));
      } else {
        await axios.post('http://localhost:5000/api/favorites', { productId: id });
        setFavorites([...favorites, id]);
      }
    } catch (error) {
      console.error('Error toggling favorite:', error);
    }
  };

  const handleQuantityChange = (event) => {
    const value = parseInt(event.target.value);
    if (value > 0 && value <= product.stock) {
      setQuantity(value);
    }
  };

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  if (loading || !product) {
    return (
      <Box sx={{ py: 8 }}>
        <Container maxWidth="lg">
          <Typography>Загрузка...</Typography>
        </Container>
      </Box>
    );
  }

  const price = product.price * exchangeRates[currency];
  const formattedPrice = new Intl.NumberFormat('ru-RU', {
    style: 'currency',
    currency,
  }).format(price);

  return (
    <Box sx={{ py: 8 }}>
      <Container maxWidth="lg">
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => window.history.back()}
          sx={{ mb: 4 }}
        >
          Назад
        </Button>

        <Grid container spacing={4}>
          <Grid item xs={12} md={6}>
            <Box sx={{ position: 'relative' }}>
              <ProductImage
                src={product.images[selectedImage]}
                alt={product.name}
              />
              <Box sx={{ display: 'flex', gap: 2, mt: 2, overflowX: 'auto' }}>
                {product.images.map((image, index) => (
                  <ThumbnailImage
                    key={index}
                    src={image}
                    alt={`${product.name} - ${index + 1}`}
                    onClick={() => setSelectedImage(index)}
                    sx={{
                      borderColor: selectedImage === index ? 'primary.main' : 'grey.200',
                    }}
                  />
                ))}
              </Box>
            </Box>
          </Grid>

          <Grid item xs={12} md={6}>
            <Typography variant="h4" gutterBottom>
              {product.name}
            </Typography>

            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <Rating value={product.rating} precision={0.5} readOnly />
              <Typography variant="body2" color="text.secondary" sx={{ ml: 1 }}>
                ({product.reviewsCount} отзывов)
              </Typography>
            </Box>

            <Box sx={{ mb: 3 }}>
              <Typography variant="h5" color="primary" gutterBottom>
                {formattedPrice}
              </Typography>
              {product.discount > 0 && (
                <Chip
                  label={`-${product.discount}%`}
                  color="error"
                  size="small"
                  sx={{ ml: 1 }}
                />
              )}
            </Box>

            <Box sx={{ mb: 3 }}>
              <Typography variant="subtitle1" gutterBottom>
                Валюта
              </Typography>
              <Box sx={{ display: 'flex', gap: 1 }}>
                {Object.keys(exchangeRates).map((curr) => (
                  <Chip
                    key={curr}
                    label={curr}
                    onClick={() => setCurrency(curr)}
                    color={currency === curr ? 'primary' : 'default'}
                    variant={currency === curr ? 'filled' : 'outlined'}
                  />
                ))}
              </Box>
            </Box>

            <Box sx={{ mb: 3 }}>
              <Typography variant="subtitle1" gutterBottom>
                Количество
              </Typography>
              <TextField
                type="number"
                value={quantity}
                onChange={handleQuantityChange}
                inputProps={{ min: 1, max: product.stock }}
                sx={{ width: 100 }}
              />
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                В наличии: {product.stock} шт.
              </Typography>
            </Box>

            <Box sx={{ display: 'flex', gap: 2, mb: 4 }}>
              <Button
                variant="contained"
                size="large"
                startIcon={<ShoppingCartIcon />}
                onClick={handleAddToCart}
                fullWidth
              >
                В корзину
              </Button>
              <IconButton
                onClick={handleToggleFavorite}
                sx={{ border: `1px solid ${theme.palette.divider}` }}
              >
                {favorites.includes(id) ? (
                  <FavoriteIcon color="error" />
                ) : (
                  <FavoriteBorderIcon />
                )}
              </IconButton>
            </Box>

            <Tabs value={activeTab} onChange={handleTabChange}>
              <Tab label="Описание" />
              <Tab label="Характеристики" />
              <Tab label="Отзывы" />
            </Tabs>

            <Box sx={{ mt: 3 }}>
              {activeTab === 0 && (
                <Typography variant="body1" paragraph>
                  {product.description}
                </Typography>
              )}

              {activeTab === 1 && (
                <Grid container spacing={2}>
                  {Object.entries(product.specifications).map(([key, value]) => (
                    <Grid item xs={12} sm={6} key={key}>
                      <Paper sx={{ p: 2 }}>
                        <Typography variant="subtitle2" color="text.secondary">
                          {key}
                        </Typography>
                        <Typography variant="body1">{value}</Typography>
                      </Paper>
                    </Grid>
                  ))}
                </Grid>
              )}

              {activeTab === 2 && (
                <Box>
                  {reviews.map((review) => (
                    <ReviewCard key={review.id}>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                        <Avatar src={review.user.avatar} alt={review.user.name} />
                        <Box sx={{ ml: 2 }}>
                          <Typography variant="subtitle1">
                            {review.user.name}
                          </Typography>
                          <Rating value={review.rating} size="small" readOnly />
                        </Box>
                        <Typography
                          variant="caption"
                          color="text.secondary"
                          sx={{ ml: 'auto' }}
                        >
                          {new Date(review.createdAt).toLocaleDateString('ru-RU')}
                        </Typography>
                      </Box>
                      <Typography variant="body1">{review.text}</Typography>
                    </ReviewCard>
                  ))}
                </Box>
              )}
            </Box>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default ProductDetails; 