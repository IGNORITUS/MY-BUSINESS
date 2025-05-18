import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Grid,
  Typography,
  Button,
  Rating,
  TextField,
  Divider,
  Paper,
  ImageList,
  ImageListItem,
  Chip,
  Alert,
  Snackbar,
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProductById } from '../redux/slices/productSlice';
import { addToCart } from '../redux/slices/cartSlice';
import { RootState } from '../redux/store';
import { Product } from '../types/product';

const ProductDetail: React.FC = () => {
  const { t } = useTranslation();
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { product, loading, error } = useSelector(
    (state: RootState) => state.products
  );

  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success' as 'success' | 'error',
  });

  useEffect(() => {
    if (id) {
      dispatch(fetchProductById(id));
    }
  }, [dispatch, id]);

  const handleQuantityChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(event.target.value);
    if (value > 0 && value <= (product?.stock || 0)) {
      setQuantity(value);
    }
  };

  const handleAddToCart = () => {
    if (product) {
      dispatch(addToCart({ product, quantity }));
      setSnackbar({
        open: true,
        message: t('addedToCart'),
        severity: 'success',
      });
    }
  };

  const handleBuyNow = () => {
    if (product) {
      dispatch(addToCart({ product, quantity }));
      navigate('/checkout');
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <Typography>{t('loading')}</Typography>
      </Box>
    );
  }

  if (error || !product) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <Typography color="error">{error || t('productNotFound')}</Typography>
      </Box>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Grid container spacing={4}>
        {/* Product Images */}
        <Grid item xs={12} md={6}>
          <Paper elevation={3} sx={{ p: 2 }}>
            <Box
              component="img"
              src={product.images[selectedImage]}
              alt={product.name}
              sx={{
                width: '100%',
                height: 'auto',
                maxHeight: 400,
                objectFit: 'contain',
                mb: 2,
              }}
            />
            <ImageList cols={4} rowHeight={100}>
              {product.images.map((image, index) => (
                <ImageListItem
                  key={index}
                  sx={{
                    cursor: 'pointer',
                    border: selectedImage === index ? '2px solid #1976d2' : 'none',
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

        {/* Product Info */}
        <Grid item xs={12} md={6}>
          <Paper elevation={3} sx={{ p: 3 }}>
            <Typography variant="h4" gutterBottom>
              {product.name}
            </Typography>

            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <Rating value={product.rating} readOnly precision={0.5} />
              <Typography variant="body2" color="text.secondary" sx={{ ml: 1 }}>
                ({product.numReviews} {t('reviews')})
              </Typography>
            </Box>

            <Typography variant="h5" color="primary" gutterBottom>
              ${product.price}
            </Typography>

            <Box sx={{ mb: 2 }}>
              {product.stock > 0 ? (
                <Chip
                  label={t('inStock')}
                  color="success"
                  sx={{ mr: 1 }}
                />
              ) : (
                <Chip
                  label={t('outOfStock')}
                  color="error"
                  sx={{ mr: 1 }}
                />
              )}
              {product.featured && (
                <Chip
                  label={t('featured')}
                  color="secondary"
                />
              )}
            </Box>

            <Typography variant="body1" paragraph>
              {product.description}
            </Typography>

            <Divider sx={{ my: 2 }} />

            {/* Quantity and Add to Cart */}
            <Box sx={{ mb: 3 }}>
              <TextField
                type="number"
                label={t('quantity')}
                value={quantity}
                onChange={handleQuantityChange}
                inputProps={{ min: 1, max: product.stock }}
                sx={{ width: 100, mr: 2 }}
              />
              <Button
                variant="contained"
                color="primary"
                onClick={handleAddToCart}
                disabled={product.stock === 0}
                sx={{ mr: 2 }}
              >
                {t('addToCart')}
              </Button>
              <Button
                variant="contained"
                color="secondary"
                onClick={handleBuyNow}
                disabled={product.stock === 0}
              >
                {t('buyNow')}
              </Button>
            </Box>

            {/* Additional Info */}
            <Box sx={{ mt: 3 }}>
              <Typography variant="subtitle1" gutterBottom>
                {t('productDetails')}:
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <Typography variant="body2" color="text.secondary">
                    {t('category')}:
                  </Typography>
                  <Typography variant="body1">{product.category}</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body2" color="text.secondary">
                    {t('brand')}:
                  </Typography>
                  <Typography variant="body1">{product.brand}</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body2" color="text.secondary">
                    {t('sku')}:
                  </Typography>
                  <Typography variant="body1">{product.sku}</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body2" color="text.secondary">
                    {t('weight')}:
                  </Typography>
                  <Typography variant="body1">{product.weight} kg</Typography>
                </Grid>
              </Grid>
            </Box>
          </Paper>
        </Grid>
      </Grid>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default ProductDetail; 