import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  Container,
  Typography,
  Paper,
  Button,
  TextField,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Box,
} from '@mui/material';
import { Add as AddIcon, Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { fetchCategories, createCategory, updateCategory, deleteCategory } from '../store/slices/categorySlice';
import Loading from '../components/Loading';
import Error from '../components/Error';
import Pagination from '../components/Pagination';

const validationSchema = yup.object({
  name: yup.string().required('Обязательное поле'),
  description: yup.string().required('Обязательное поле'),
  image: yup.string().url('Неверный формат URL').required('Обязательное поле'),
});

const AdminCategories = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { items: categories, loading, error } = useSelector((state) => state.categories);
  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(1);
  const [openDialog, setOpenDialog] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const itemsPerPage = 10;

  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  const formik = useFormik({
    initialValues: {
      name: '',
      description: '',
      image: '',
    },
    validationSchema,
    onSubmit: async (values) => {
      try {
        if (editingCategory) {
          await dispatch(updateCategory({ id: editingCategory.id, ...values })).unwrap();
        } else {
          await dispatch(createCategory(values)).unwrap();
        }
        handleCloseDialog();
      } catch {}
    },
  });

  const handleOpenDialog = (category = null) => {
    setEditingCategory(category);
    if (category) {
      formik.setValues({
        name: category.name,
        description: category.description,
        image: category.image,
      });
    } else {
      formik.resetForm();
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingCategory(null);
    formik.resetForm();
  };

  const handleDelete = async (id) => {
    if (window.confirm('Вы уверены, что хотите удалить эту категорию?')) {
      try {
        await dispatch(deleteCategory(id)).unwrap();
      } catch {}
    }
  };

  const filteredCategories = categories.filter(
    (category) =>
      category.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      category.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const paginatedCategories = filteredCategories.slice(
    (page - 1) * itemsPerPage,
    page * itemsPerPage
  );

  if (loading) return <Loading />;
  if (error) return <Error message={error} onRetry={() => dispatch(fetchCategories())} />;

  return (
    <Container>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4">Управление категориями</Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={() => handleOpenDialog()}
        >
          Добавить категорию
        </Button>
      </Box>

      <Paper sx={{ p: 2, mb: 3 }}>
        <TextField
          fullWidth
          label="Поиск категорий"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </Paper>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Название</TableCell>
              <TableCell>Описание</TableCell>
              <TableCell>Количество товаров</TableCell>
              <TableCell align="right">Действия</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedCategories.map((category) => (
              <TableRow key={category.id}>
                <TableCell>{category.name}</TableCell>
                <TableCell>{category.description}</TableCell>
                <TableCell>{category.productCount || 0}</TableCell>
                <TableCell align="right">
                  <IconButton onClick={() => handleOpenDialog(category)} color="primary">
                    <EditIcon />
                  </IconButton>
                  <IconButton onClick={() => handleDelete(category.id)} color="error">
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Box sx={{ mt: 2, display: 'flex', justifyContent: 'center' }}>
        <Pagination
          count={Math.ceil(filteredCategories.length / itemsPerPage)}
          page={page}
          onChange={(e, value) => setPage(value)}
        />
      </Box>

      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>{editingCategory ? 'Редактирование категории' : 'Создание категории'}</DialogTitle>
        <form onSubmit={formik.handleSubmit}>
          <DialogContent>
            <TextField
              fullWidth
              name="name"
              label="Название"
              value={formik.values.name}
              onChange={formik.handleChange}
              error={formik.touched.name && Boolean(formik.errors.name)}
              helperText={formik.touched.name && formik.errors.name}
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              name="description"
              label="Описание"
              multiline
              rows={3}
              value={formik.values.description}
              onChange={formik.handleChange}
              error={formik.touched.description && Boolean(formik.errors.description)}
              helperText={formik.touched.description && formik.errors.description}
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              name="image"
              label="URL изображения"
              value={formik.values.image}
              onChange={formik.handleChange}
              error={formik.touched.image && Boolean(formik.errors.image)}
              helperText={formik.touched.image && formik.errors.image}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialog}>Отмена</Button>
            <Button type="submit" variant="contained" color="primary">
              {editingCategory ? 'Сохранить' : 'Создать'}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </Container>
  );
};

export default AdminCategories; 