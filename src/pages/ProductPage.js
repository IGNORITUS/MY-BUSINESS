import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  Container,
  Grid,
  Typography,
  Box,
  Button,
  Divider,
  Paper,
  CircularProgress
} from '@mui/material';
import { fetchProduct } from '../store/slices/productSlice';
import { fetchReviews } from '../store/slices/reviewSlice';
import ReviewForm from '../components/reviews/ReviewForm';
import ReviewList from '../components/reviews/ReviewList';
import { formatPrice } from '../utils/helpers';
import { addToCart } from '../store/slices/cartSlice';

const ProductPage = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { product, loading, error } = useSelector(state => state.products);
  const { reviews, loading: reviewsLoading } = useSelector(state => state.reviews);
  const { user } = useSelector(state => state.auth);
  const [showReviewForm, setShowReviewForm] = useState(false);

  useEffect(() => {
    dispatch(fetchProduct(id));
    dispatch(fetchReviews({ productId: id }));
  }, [dispatch, id]);

  const handleAddToCart = () => {
    dispatch(addToCart({ productId: id, quantity: 1 }));
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
        <Typography color="error" variant="h6">
          {error}
        </Typography>
      </Container>
    );
  }

  if (!product) {
    return (
      <Container>
        <Typography variant="h6">
          Товар не найден
        </Typography>
      </Container>
    );
  }

  return (
    <Container>
      <Grid container spacing={4}>
        {/* Информация о товаре */}
        <Grid item xs={12} md={6}>
          <Paper elevation={2} sx={{ p: 2 }}>
            <img
              src={product.изображение}
              alt={product.название}
              style={{ width: '100%', height: 'auto' }}
            />
          </Paper>
        </Grid>
        <Grid item xs={12} md={6}>
          <Typography variant="h4" gutterBottom>
            {product.название}
          </Typography>
          <Typography variant="h5" color="primary" gutterBottom>
            {formatPrice(product.цена)}
          </Typography>
          <Typography variant="body1" paragraph>
            {product.описание}
          </Typography>
          <Button
            variant="contained"
            color="primary"
            size="large"
            onClick={handleAddToCart}
            sx={{ mt: 2 }}
          >
            Добавить в корзину
          </Button>
        </Grid>

        {/* Отзывы */}
        <Grid item xs={12}>
          <Divider sx={{ my: 4 }} />
          <Typography variant="h5" gutterBottom>
            Отзывы
          </Typography>

          {user && !showReviewForm && (
            <Button
              variant="outlined"
              onClick={() => setShowReviewForm(true)}
              sx={{ mb: 3 }}
            >
              Написать отзыв
            </Button>
          )}

          {showReviewForm && (
            <ReviewForm
              productId={id}
              onSuccess={() => setShowReviewForm(false)}
            />
          )}

          {reviewsLoading ? (
            <Box display="flex" justifyContent="center" my={4}>
              <CircularProgress />
            </Box>
          ) : (
            <ReviewList reviews={reviews} />
          )}
        </Grid>
      </Grid>
    </Container>
  );
};

export default ProductPage; 