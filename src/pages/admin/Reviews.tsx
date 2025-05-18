import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Chip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Grid,
  Rating,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Visibility as VisibilityIcon,
  Check as CheckIcon,
  Close as CloseIcon,
} from '@mui/icons-material';
import { useDispatch, useSelector } from 'react-redux';
import { useNotification } from '../../hooks/useNotification';
import { motion } from 'framer-motion';

interface Review {
  id: string;
  productId: string;
  productName: string;
  userId: string;
  userName: string;
  rating: number;
  comment: string;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: string;
  updatedAt: string;
}

const Reviews: React.FC = () => {
  const dispatch = useDispatch();
  const { showNotification } = useNotification();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedReview, setSelectedReview] = useState<Review | null>(null);
  const [formData, setFormData] = useState<Partial<Review>>({
    rating: 0,
    comment: '',
    status: 'pending',
  });

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleOpenDialog = (review?: Review) => {
    if (review) {
      setSelectedReview(review);
      setFormData(review);
    } else {
      setSelectedReview(null);
      setFormData({
        rating: 0,
        comment: '',
        status: 'pending',
      });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedReview(null);
    setFormData({
      rating: 0,
      comment: '',
      status: 'pending',
    });
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleRatingChange = (event: React.SyntheticEvent, newValue: number | null) => {
    if (newValue !== null) {
      setFormData((prev) => ({
        ...prev,
        rating: newValue,
      }));
    }
  };

  const handleSubmit = async () => {
    try {
      if (selectedReview) {
        await dispatch(updateReview({ id: selectedReview.id, ...formData }));
        showNotification('Отзыв успешно обновлен', 'success');
      } else {
        await dispatch(createReview(formData));
        showNotification('Отзыв успешно создан', 'success');
      }
      handleCloseDialog();
    } catch (error) {
      showNotification('Произошла ошибка при сохранении отзыва', 'error');
    }
  };

  const handleDeleteReview = async (reviewId: string) => {
    if (window.confirm('Вы уверены, что хотите удалить этот отзыв?')) {
      try {
        await dispatch(deleteReview(reviewId));
        showNotification('Отзыв успешно удален', 'success');
      } catch (error) {
        showNotification('Произошла ошибка при удалении отзыва', 'error');
      }
    }
  };

  const handleApproveReview = async (reviewId: string) => {
    try {
      await dispatch(updateReviewStatus({ id: reviewId, status: 'approved' }));
      showNotification('Отзыв успешно одобрен', 'success');
    } catch (error) {
      showNotification('Произошла ошибка при одобрении отзыва', 'error');
    }
  };

  const handleRejectReview = async (reviewId: string) => {
    try {
      await dispatch(updateReviewStatus({ id: reviewId, status: 'rejected' }));
      showNotification('Отзыв отклонен', 'success');
    } catch (error) {
      showNotification('Произошла ошибка при отклонении отзыва', 'error');
    }
  };

  const getStatusColor = (status: Review['status']) => {
    switch (status) {
      case 'approved':
        return 'success';
      case 'pending':
        return 'warning';
      case 'rejected':
        return 'error';
      default:
        return 'default';
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h4" component="h1">
          Управление отзывами
        </Typography>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Товар</TableCell>
              <TableCell>Пользователь</TableCell>
              <TableCell>Оценка</TableCell>
              <TableCell>Комментарий</TableCell>
              <TableCell>Статус</TableCell>
              <TableCell>Дата</TableCell>
              <TableCell>Действия</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {reviews.map((review) => (
              <TableRow key={review.id}>
                <TableCell>{review.productName}</TableCell>
                <TableCell>{review.userName}</TableCell>
                <TableCell>
                  <Rating value={review.rating} readOnly />
                </TableCell>
                <TableCell>{review.comment}</TableCell>
                <TableCell>
                  <Chip
                    label={review.status}
                    color={getStatusColor(review.status)}
                    size="small"
                  />
                </TableCell>
                <TableCell>
                  {new Date(review.createdAt).toLocaleDateString()}
                </TableCell>
                <TableCell>
                  <IconButton
                    size="small"
                    onClick={() => handleOpenDialog(review)}
                  >
                    <EditIcon />
                  </IconButton>
                  <IconButton
                    size="small"
                    onClick={() => handleDeleteReview(review.id)}
                  >
                    <DeleteIcon />
                  </IconButton>
                  <IconButton
                    size="small"
                    onClick={() => handleApproveReview(review.id)}
                    color="success"
                  >
                    <CheckIcon />
                  </IconButton>
                  <IconButton
                    size="small"
                    onClick={() => handleRejectReview(review.id)}
                    color="error"
                  >
                    <CloseIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={totalReviews}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </TableContainer>

      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>
          {selectedReview ? 'Редактировать отзыв' : 'Добавить отзыв'}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <Typography component="legend">Оценка</Typography>
              <Rating
                name="rating"
                value={formData.rating}
                onChange={handleRatingChange}
                precision={0.5}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Комментарий"
                name="comment"
                value={formData.comment}
                onChange={handleInputChange}
                multiline
                rows={4}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel>Статус</InputLabel>
                <Select
                  name="status"
                  value={formData.status}
                  onChange={handleInputChange}
                  label="Статус"
                >
                  <MenuItem value="pending">На модерации</MenuItem>
                  <MenuItem value="approved">Одобрен</MenuItem>
                  <MenuItem value="rejected">Отклонен</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Отмена</Button>
          <Button onClick={handleSubmit} variant="contained">
            {selectedReview ? 'Сохранить' : 'Создать'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Reviews; 