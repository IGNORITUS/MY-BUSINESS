import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  Rating,
  TextField,
  Button,
  Avatar,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert
} from '@mui/material';
import { useSelector, useDispatch } from 'react-redux';
import { createReview, fetchReviews, updateReview, deleteReview } from '../redux/slices/reviewSlice';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import './Reviews.css';

const Reviews = ({ productId }) => {
  const dispatch = useDispatch();
  const { reviews, status, error } = useSelector((state) => state.reviews);
  const { user } = useSelector((state) => state.auth);
  const [newReview, setNewReview] = useState({
    rating: 5,
    comment: '',
    name: ''
  });
  const [editingReview, setEditingReview] = useState(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);

  useEffect(() => {
    dispatch(fetchReviews());
  }, [dispatch]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const review = {
      id: Date.now(),
      ...newReview,
      date: new Date().toLocaleDateString()
    };
    dispatch(createReview(newReview));
    setNewReview({ rating: 5, comment: '', name: '' });
  };

  const handleEdit = (review) => {
    setEditingReview(review);
    setEditDialogOpen(true);
  };

  const handleUpdate = () => {
    if (editingReview.rating === 0) {
      alert('Пожалуйста, выберите оценку');
      return;
    }
    dispatch(updateReview(editingReview));
    setEditDialogOpen(false);
    setEditingReview(null);
  };

  const handleDelete = (reviewId) => {
    if (window.confirm('Вы уверены, что хотите удалить этот отзыв?')) {
      dispatch(deleteReview(reviewId));
    }
  };

  return (
    <div className="reviews-section">
      <h2>Отзывы</h2>
      
      <form onSubmit={handleSubmit} className="review-form">
        <div className="form-group">
          <label>Ваше имя:</label>
          <input
            type="text"
            value={newReview.name}
            onChange={(e) => setNewReview({...newReview, name: e.target.value})}
            required
          />
        </div>
        
        <div className="form-group">
          <label>Оценка:</label>
          <select
            value={newReview.rating}
            onChange={(e) => setNewReview({...newReview, rating: Number(e.target.value)})}
          >
            {[5, 4, 3, 2, 1].map(num => (
              <option key={num} value={num}>{num} звезд</option>
            ))}
          </select>
        </div>
        
        <div className="form-group">
          <label>Комментарий:</label>
          <textarea
            value={newReview.comment}
            onChange={(e) => setNewReview({...newReview, comment: e.target.value})}
            required
          />
        </div>
        
        <button type="submit" className="submit-review">Оставить отзыв</button>
      </form>

      <div className="reviews-list">
        {reviews.map(review => (
          <div key={review._id} className="review-item">
            <div className="review-header">
              <span className="review-author">{review.user.name}</span>
              <span className="review-date">{new Date(review.createdAt).toLocaleDateString()}</span>
            </div>
            <div className="review-rating">
              {'★'.repeat(review.rating)}{'☆'.repeat(5 - review.rating)}
            </div>
            <p className="review-comment">{review.comment}</p>
            {user && user._id === review.user._id && (
              <div className="review-actions">
                <IconButton onClick={() => handleEdit(review)}>
                  <EditIcon />
                </IconButton>
                <IconButton onClick={() => handleDelete(review._id)}>
                  <DeleteIcon />
                </IconButton>
              </div>
            )}
          </div>
        ))}
      </div>

      <Dialog open={editDialogOpen} onClose={() => setEditDialogOpen(false)}>
        <DialogTitle>Редактировать отзыв</DialogTitle>
        <DialogContent>
          <Rating
            value={editingReview?.rating || 0}
            onChange={(event, newValue) => {
              setEditingReview({ ...editingReview, rating: newValue });
            }}
            sx={{ mb: 2, mt: 1 }}
          />
          <TextField
            fullWidth
            multiline
            rows={4}
            variant="outlined"
            label="Ваш отзыв"
            value={editingReview?.comment || ''}
            onChange={(e) =>
              setEditingReview({ ...editingReview, comment: e.target.value })
            }
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditDialogOpen(false)}>Отмена</Button>
          <Button onClick={handleUpdate} variant="contained" color="primary">
            Сохранить
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default Reviews; 