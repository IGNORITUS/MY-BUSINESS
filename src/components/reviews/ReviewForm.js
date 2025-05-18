import React, { useState } from 'react';
import {
  Box,
  TextField,
  Button,
  Rating,
  Typography,
  IconButton,
  Paper
} from '@mui/material';
import { PhotoCamera, Close } from '@mui/icons-material';

const ReviewForm = ({ onSubmit, onCancel }) => {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [images, setImages] = useState([]);
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};

    if (rating === 0) {
      newErrors.rating = 'Пожалуйста, поставьте оценку';
    }

    if (!comment.trim()) {
      newErrors.comment = 'Пожалуйста, напишите комментарий';
    } else if (comment.length < 10) {
      newErrors.comment = 'Комментарий должен содержать минимум 10 символов';
    } else if (comment.length > 1000) {
      newErrors.comment = 'Комментарий не должен превышать 1000 символов';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (validateForm()) {
      onSubmit({
        rating,
        comment,
        images
      });
    }
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    const newImages = [];

    files.forEach(file => {
      const reader = new FileReader();
      reader.onloadend = () => {
        newImages.push(reader.result);
        if (newImages.length === files.length) {
          setImages(prev => [...prev, ...newImages]);
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (index) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  return (
    <Paper elevation={3} sx={{ p: 3 }}>
      <Typography variant="h6" gutterBottom>
        Написать отзыв
      </Typography>

      <form onSubmit={handleSubmit}>
        <Box mb={3}>
          <Typography component="legend">Ваша оценка</Typography>
          <Rating
            value={rating}
            onChange={(_, newValue) => setRating(newValue)}
            size="large"
          />
          {errors.rating && (
            <Typography color="error" variant="caption">
              {errors.rating}
            </Typography>
          )}
        </Box>

        <TextField
          fullWidth
          multiline
          rows={4}
          label="Ваш отзыв"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          error={!!errors.comment}
          helperText={errors.comment}
          sx={{ mb: 3 }}
        />

        <Box mb={3}>
          <input
            accept="image/*"
            style={{ display: 'none' }}
            id="image-upload"
            type="file"
            multiple
            onChange={handleImageChange}
          />
          <label htmlFor="image-upload">
            <Button
              variant="outlined"
              component="span"
              startIcon={<PhotoCamera />}
            >
              Добавить фото
            </Button>
          </label>

          {images.length > 0 && (
            <Box display="flex" gap={1} mt={2} flexWrap="wrap">
              {images.map((image, index) => (
                <Box
                  key={index}
                  position="relative"
                  sx={{
                    width: 100,
                    height: 100,
                    borderRadius: 1,
                    overflow: 'hidden'
                  }}
                >
                  <img
                    src={image}
                    alt={`Фото ${index + 1}`}
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover'
                    }}
                  />
                  <IconButton
                    size="small"
                    onClick={() => removeImage(index)}
                    sx={{
                      position: 'absolute',
                      top: 4,
                      right: 4,
                      bgcolor: 'rgba(255, 255, 255, 0.8)',
                      '&:hover': {
                        bgcolor: 'rgba(255, 255, 255, 0.9)'
                      }
                    }}
                  >
                    <Close fontSize="small" />
                  </IconButton>
                </Box>
              ))}
            </Box>
          )}
        </Box>

        <Box display="flex" gap={2}>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            size="large"
          >
            Отправить отзыв
          </Button>
          <Button
            variant="outlined"
            onClick={onCancel}
            size="large"
          >
            Отмена
          </Button>
        </Box>
      </form>
    </Paper>
  );
};

export default ReviewForm; 