import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  Box,
  Container,
  Grid,
  Typography,
  IconButton,
  Divider,
  Rating,
  Breadcrumbs,
  Link,
  TextField,
  Paper,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Alert
} from '@mui/material';
import ShoppingBagIcon from '@mui/icons-material/ShoppingBag';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import SecurityIcon from '@mui/icons-material/Security';
import SupportIcon from '@mui/icons-material/Support';
import CurrencyRubleIcon from '@mui/icons-material/CurrencyRuble';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import EuroIcon from '@mui/icons-material/Euro';
import CurrencyPoundIcon from '@mui/icons-material/CurrencyPound';
import { addToCart } from '../store/slices/cartSlice';
import { addToFavorites, removeFromFavorites } from '../store/slices/favoritesSlice';
import { motion } from 'framer-motion';
import AnimatedButton from '../components/AnimatedButton';
import AnimatedGallery from '../components/AnimatedGallery';
import { trackProductInteraction } from '../utils/analytics';
import axios from 'axios';
import './ProductDetails.css';

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [quantity, setQuantity] = useState(1);
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isFavorite, setIsFavorite] = useState(false);
  const [error, setError] = useState(null);
  const [selectedCurrency, setSelectedCurrency] = useState('RUB');
  const [exchangeRates] = useState({
    USD: 0.011,
    EUR: 0.010,
    BYN: 0.035,
  });

  const { items: favoriteItems } = useSelector((state) => state.favorites);

  const isFavoriteInRedux = favoriteItems.some((item) => item.id === id);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`/api/products/${id}`);
        setProduct(response.data);
        trackProductInteraction(id, 'View');
      } catch (err) {
        setError('Error loading product details');
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const handleQuantityChange = (value) => {
    if (value >= 1 && value <= product?.stock) {
      setQuantity(value);
    }
  };

  const handleAddToCart = () => {
    if (product) {
      dispatch(addToCart(product));
      trackProductInteraction(id, 'Add to Cart');
    }
  };

  const handleBuyNow = () => {
    dispatch(addToCart({ ...product, quantity }));
    navigate('/checkout');
  };

  const toggleFavorite = () => {
    if (isFavoriteInRedux) {
      dispatch(removeFromFavorites(id));
    } else {
      dispatch(addToFavorites(product));
    }
    setIsFavorite(!isFavorite);
  };

  const convertPrice = (price) => {
    const rates = {
      RUB: 1,
      USD: exchangeRates.USD,
      EUR: exchangeRates.EUR,
      BYN: exchangeRates.BYN,
    };

    const convertedPrice = price * rates[selectedCurrency];
    return convertedPrice.toFixed(2);
  };

  const getCurrencySymbol = (currency) => {
    const symbols = {
      RUB: '₽',
      USD: '$',
      EUR: '€',
      BYN: 'Br',
    };
    return symbols[currency];
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Container>
        <Alert severity="error">{error}</Alert>
      </Container>
    );
  }

  if (!product) {
    return (
      <Container>
        <Alert severity="info">Product not found</Alert>
      </Container>
    );
  }

  return (
    <Box>
      <Container>
        <Breadcrumbs sx={{ mb: 4 }}>
          <Link
            component="button"
            variant="body1"
            onClick={() => navigate('/')}
            sx={{ textDecoration: 'none' }}
          >
            Главная
          </Link>
          <Link
            component="button"
            variant="body1"
            onClick={() => navigate('/catalog')}
            sx={{ textDecoration: 'none' }}
          >
            Каталог
          </Link>
          <Typography color="text.primary">{product.name}</Typography>
        </Breadcrumbs>

        <Grid container spacing={4}>
          <Grid item xs={12} md={6}>
            <AnimatedGallery images={product.images} />
          </Grid>

          <Grid item xs={12} md={6}>
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Typography variant="h4" gutterBottom>
                {product.name}
              </Typography>

              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Rating value={product.rating} readOnly precision={0.5} />
                <Typography variant="body2" color="text.secondary" sx={{ ml: 1 }}>
                  ({product.reviewsCount} отзывов)
                </Typography>
              </Box>

              <Typography variant="h5" color="primary" gutterBottom>
                {getCurrencySymbol(selectedCurrency)}{convertPrice(product.price)}
              </Typography>

              <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
                <Button
                  variant={selectedCurrency === 'RUB' ? 'contained' : 'outlined'}
                  onClick={() => setSelectedCurrency('RUB')}
                  startIcon={<CurrencyRubleIcon />}
                >
                  RUB
                </Button>
                <Button
                  variant={selectedCurrency === 'USD' ? 'contained' : 'outlined'}
                  onClick={() => setSelectedCurrency('USD')}
                  startIcon={<AttachMoneyIcon />}
                >
                  USD
                </Button>
                <Button
                  variant={selectedCurrency === 'EUR' ? 'contained' : 'outlined'}
                  onClick={() => setSelectedCurrency('EUR')}
                  startIcon={<EuroIcon />}
                >
                  EUR
                </Button>
                <Button
                  variant={selectedCurrency === 'BYN' ? 'contained' : 'outlined'}
                  onClick={() => setSelectedCurrency('BYN')}
                  startIcon={<CurrencyRubleIcon />}
                >
                  BYN
                </Button>
              </Box>

              <Typography variant="body1" paragraph>
                {product.description}
              </Typography>

              <Box sx={{ mb: 3 }}>
                <Typography variant="body2" color={product.inStock ? 'success.main' : 'error.main'}>
                  {product.inStock ? 'В наличии' : 'Нет в наличии'}
                </Typography>
              </Box>

              <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                <IconButton
                  onClick={() => handleQuantityChange(quantity - 1)}
                  disabled={quantity <= 1}
                >
                  <RemoveIcon />
                </IconButton>
                <TextField
                  value={quantity}
                  onChange={(e) => handleQuantityChange(Number(e.target.value))}
                  type="number"
                  inputProps={{ min: 1, max: product.stock }}
                  sx={{ width: 60, mx: 1 }}
                />
                <IconButton
                  onClick={() => handleQuantityChange(quantity + 1)}
                  disabled={quantity >= product.stock}
                >
                  <AddIcon />
                </IconButton>
              </Box>

              <Box sx={{ display: 'flex', gap: 2, mb: 4 }}>
                <AnimatedButton
                  variant="contained"
                  startIcon={<ShoppingBagIcon />}
                  onClick={handleAddToCart}
                  disabled={product.stock === 0}
                  sx={{
                    backgroundColor: 'primary.main',
                    '&:hover': {
                      backgroundColor: 'primary.dark',
                    },
                  }}
                >
                  {product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
                </AnimatedButton>
                <AnimatedButton
                  variant="outlined"
                  startIcon={<LocalShippingIcon />}
                  onClick={handleBuyNow}
                  disabled={product.stock === 0}
                  sx={{
                    borderColor: 'primary.main',
                    color: 'primary.main',
                    '&:hover': {
                      borderColor: 'primary.dark',
                      backgroundColor: 'rgba(25, 118, 210, 0.04)',
                    },
                  }}
                >
                  Купить сейчас
                </AnimatedButton>
                <IconButton 
                  onClick={toggleFavorite} 
                  color="primary"
                  sx={{
                    '&:hover': {
                      transform: 'scale(1.1)',
                      transition: 'transform 0.2s ease-in-out',
                    },
                  }}
                >
                  {isFavorite ? <FavoriteIcon /> : <FavoriteBorderIcon />}
                </IconButton>
              </Box>

              <Divider sx={{ my: 4 }} />

              <Typography variant="h6" gutterBottom>
                Характеристики
              </Typography>
              <Grid container spacing={2}>
                {Object.entries(product.specifications).map(([key, value]) => (
                  <Grid item xs={12} sm={6} key={key}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Typography variant="body2" color="text.secondary">
                        {key}
                      </Typography>
                      <Typography variant="body2">{value}</Typography>
                    </Box>
                  </Grid>
                ))}
              </Grid>
            </motion.div>
          </Grid>
        </Grid>

        <Grid container spacing={4} sx={{ mt: 4 }}>
          <Grid item xs={12}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <Paper
                elevation={3}
                sx={{
                  p: 3,
                  borderRadius: 2,
                  mt: 2,
                }}
              >
                <Typography variant="h6" gutterBottom>
                  Additional Information
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6} md={3}>
                    <Card sx={{ height: '100%' }}>
                      <CardContent>
                        <LocalShippingIcon color="primary" sx={{ fontSize: 40 }} />
                        <Typography variant="h6">Free Shipping</Typography>
                        <Typography variant="body2" color="text.secondary">
                          Free delivery for all orders
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                  <Grid item xs={12} sm={6} md={3}>
                    <Card sx={{ height: '100%' }}>
                      <CardContent>
                        <SecurityIcon color="primary" sx={{ fontSize: 40 }} />
                        <Typography variant="h6">Secure Payment</Typography>
                        <Typography variant="body2" color="text.secondary">
                          100% secure payment
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                  <Grid item xs={12} sm={6} md={3}>
                    <Card sx={{ height: '100%' }}>
                      <CardContent>
                        <SupportIcon color="primary" sx={{ fontSize: 40 }} />
                        <Typography variant="h6">24/7 Support</Typography>
                        <Typography variant="body2" color="text.secondary">
                          Dedicated support
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                  <Grid item xs={12} sm={6} md={3}>
                    <Card sx={{ height: '100%' }}>
                      <CardContent>
                        <FavoriteIcon color="primary" sx={{ fontSize: 40 }} />
                        <Typography variant="h6">Quality Guarantee</Typography>
                        <Typography variant="body2" color="text.secondary">
                          Quality checked products
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                </Grid>
              </Paper>
            </motion.div>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default ProductDetails; 