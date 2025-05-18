import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Avatar,
  Rating,
  IconButton,
  Button,
  Divider,
  CircularProgress,
  Alert
} from '@mui/material';
import { ThumbUp, ThumbUpOutlined } from '@mui/icons-material';
import { useSelector, useDispatch } from 'react-redux';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';
import ReviewForm from './ReviewForm';

const ReviewList = ({ productId }) => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  const fetchReviews = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/reviews/product/${productId}?page=${page}`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message);
      }

      setReviews(data.reviews);
      setTotalPages(data.totalPages);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, [productId, page]);

  const handleLike = async (reviewId) => {
    try {
      const response = await fetch(`/api/reviews/${reviewId}/like`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (!response.ok) {
        throw new Error('Ошибка при обработке лайка');
      }

      // Обновляем список отзывов
      fetchReviews();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleReviewSubmit = async (reviewData) => {
    try {
      const response = await fetch(`/api/reviews/product/${productId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(reviewData)
      });

      if (!response.ok) {
        throw new Error('Ошибка при создании отзыва');
      }

      setShowReviewForm(false);
      fetchReviews();
    } catch (err) {
      setError(err.message);
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" my={4}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ my: 2 }}>
        {error}
      </Alert>
    );
  }

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h5" component="h2">
          Отзывы ({reviews.length})
        </Typography>
        {user && (
          <Button
            variant="contained"
            color="primary"
            onClick={() => setShowReviewForm(true)}
          >
            Написать отзыв
          </Button>
        )}
      </Box>

      {showReviewForm && (
        <Box mb={4}>
          <ReviewForm
            onSubmit={handleReviewSubmit}
            onCancel={() => setShowReviewForm(false)}
          />
        </Box>
      )}

      {reviews.length === 0 ? (
        <Typography variant="body1" color="textSecondary">
          Пока нет отзывов. Будьте первым, кто оставит отзыв!
        </Typography>
      ) : (
        <>
          {reviews.map((review) => (
            <Card key={review._id} sx={{ mb: 2 }}>
              <CardContent>
                <Box display="flex" alignItems="center" mb={2}>
                  <Avatar
                    src={review.user.avatar}
                    alt={review.user.name}
                    sx={{ mr: 2 }}
                  />
                  <Box>
                    <Typography variant="subtitle1">
                      {review.user.name}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      {format(new Date(review.createdAt), 'd MMMM yyyy', { locale: ru })}
                    </Typography>
                  </Box>
                </Box>

                <Box display="flex" alignItems="center" mb={2}>
                  <Rating value={review.rating} readOnly />
                  <Typography variant="body2" color="textSecondary" sx={{ ml: 1 }}>
                    {review.rating} из 5
                  </Typography>
                </Box>

                <Typography variant="body1" paragraph>
                  {review.comment}
                </Typography>

                {review.images && review.images.length > 0 && (
                  <Box display="flex" gap={1} mb={2}>
                    {review.images.map((image, index) => (
                      <img
                        key={index}
                        src={image}
                        alt={`Фото ${index + 1}`}
                        style={{
                          width: 100,
                          height: 100,
                          objectFit: 'cover',
                          borderRadius: 4
                        }}
                      />
                    ))}
                  </Box>
                )}

                <Box display="flex" alignItems="center">
                  <IconButton
                    onClick={() => handleLike(review._id)}
                    disabled={!user}
                  >
                    {review.likes.includes(user?._id) ? (
                      <ThumbUp color="primary" />
                    ) : (
                      <ThumbUpOutlined />
                    )}
                  </IconButton>
                  <Typography variant="body2" color="textSecondary">
                    {review.likes.length}
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          ))}

          {totalPages > 1 && (
            <Box display="flex" justifyContent="center" mt={3}>
              <Button
                disabled={page === 1}
                onClick={() => setPage(page - 1)}
                sx={{ mr: 1 }}
              >
                Назад
              </Button>
              <Typography variant="body1" sx={{ mx: 2 }}>
                Страница {page} из {totalPages}
              </Typography>
              <Button
                disabled={page === totalPages}
                onClick={() => setPage(page + 1)}
                sx={{ ml: 1 }}
              >
                Вперед
              </Button>
            </Box>
          )}
        </>
      )}
    </Box>
  );
};

export default ReviewList; 