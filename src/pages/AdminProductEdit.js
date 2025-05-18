import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  Container,
  Typography,
  Paper,
  Button,
  Grid,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
  IconButton,
} from '@mui/material';
import { Add as AddIcon, Delete as DeleteIcon } from '@mui/icons-material';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { fetchProductById, createProduct, updateProduct } from '../store/slices/productSlice';
import { fetchCategories } from '../store/slices/categorySlice';
import Loading from '../components/Loading';
import Error from '../components/Error';

const validationSchema = yup.object({
  name: yup.string().required('Обязательное поле'),
  description: yup.string().required('Обязательное поле'),
  price: yup.number().required('Обязательное поле').min(0, 'Цена не может быть отрицательной'),
  categoryId: yup.string().required('Обязательное поле'),
  images: yup.array().of(yup.string().url('Неверный формат URL')).min(1, 'Добавьте хотя бы одно изображение'),
  specifications: yup.object(),
  stock: yup.number().required('Обязательное поле').min(0, 'Количество не может быть отрицательным'),
});

const AdminProductEdit = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { currentProduct: product, loading, error } = useSelector((state) => state.products);
  const { items: categories } = useSelector((state) => state.categories);
  const isEdit = Boolean(id);

  useEffect(() => {
    dispatch(fetchCategories());
    if (isEdit) {
      dispatch(fetchProductById(id));
    }
  }, [dispatch, id, isEdit]);

  const formik = useFormik({
    initialValues: {
      name: product?.name || '',
      description: product?.description || '',
      price: product?.price || 0,
      categoryId: product?.categoryId || '',
      images: product?.images || [''],
      specifications: product?.specifications || {},
      stock: product?.stock || 0,
    },
    validationSchema,
    enableReinitialize: true,
    onSubmit: async (values) => {
      try {
        if (isEdit) {
          await dispatch(updateProduct({ id, ...values })).unwrap();
        } else {
          await dispatch(createProduct(values)).unwrap();
        }
        navigate('/admin/products');
      } catch {}
    },
  });

  const handleAddImage = () => {
    formik.setFieldValue('images', [...formik.values.images, '']);
  };

  const handleRemoveImage = (index) => {
    const newImages = formik.values.images.filter((_, i) => i !== index);
    formik.setFieldValue('images', newImages);
  };

  const handleAddSpecification = () => {
    const key = prompt('Введите название характеристики:');
    if (key) {
      const value = prompt('Введите значение характеристики:');
      if (value) {
        formik.setFieldValue('specifications', { ...formik.values.specifications, [key]: value });
      }
    }
  };

  const handleRemoveSpecification = (key) => {
    const newSpecs = { ...formik.values.specifications };
    delete newSpecs[key];
    formik.setFieldValue('specifications', newSpecs);
  };

  if (loading) return <Loading />;
  if (error) return <Error message={error} onRetry={() => isEdit && dispatch(fetchProductById(id))} />;

  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        {isEdit ? 'Редактирование товара' : 'Создание товара'}
      </Typography>
      <Paper sx={{ p: 3 }}>
        <form onSubmit={formik.handleSubmit}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                name="name"
                label="Название"
                value={formik.values.name}
                onChange={formik.handleChange}
                error={formik.touched.name && Boolean(formik.errors.name)}
                helperText={formik.touched.name && formik.errors.name}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                name="description"
                label="Описание"
                multiline
                rows={4}
                value={formik.values.description}
                onChange={formik.handleChange}
                error={formik.touched.description && Boolean(formik.errors.description)}
                helperText={formik.touched.description && formik.errors.description}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                name="price"
                label="Цена"
                type="number"
                value={formik.values.price}
                onChange={formik.handleChange}
                error={formik.touched.price && Boolean(formik.errors.price)}
                helperText={formik.touched.price && formik.errors.price}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                name="stock"
                label="Количество"
                type="number"
                value={formik.values.stock}
                onChange={formik.handleChange}
                error={formik.touched.stock && Boolean(formik.errors.stock)}
                helperText={formik.touched.stock && formik.errors.stock}
              />
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel>Категория</InputLabel>
                <Select
                  name="categoryId"
                  value={formik.values.categoryId}
                  onChange={formik.handleChange}
                  error={formik.touched.categoryId && Boolean(formik.errors.categoryId)}
                >
                  {categories.map((category) => (
                    <MenuItem key={category.id} value={category.id}>
                      {category.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <Typography variant="subtitle1" gutterBottom>
                Изображения
              </Typography>
              {formik.values.images.map((image, index) => (
                <Box key={index} sx={{ display: 'flex', mb: 1 }}>
                  <TextField
                    fullWidth
                    value={image}
                    onChange={(e) => {
                      const newImages = [...formik.values.images];
                      newImages[index] = e.target.value;
                      formik.setFieldValue('images', newImages);
                    }}
                    error={formik.touched.images && Boolean(formik.errors.images)}
                    helperText={formik.touched.images && formik.errors.images}
                  />
                  <IconButton onClick={() => handleRemoveImage(index)} color="error">
                    <DeleteIcon />
                  </IconButton>
                </Box>
              ))}
              <Button startIcon={<AddIcon />} onClick={handleAddImage}>
                Добавить изображение
              </Button>
            </Grid>
            <Grid item xs={12}>
              <Typography variant="subtitle1" gutterBottom>
                Характеристики
              </Typography>
              {Object.entries(formik.values.specifications).map(([key, value]) => (
                <Box key={key} sx={{ display: 'flex', mb: 1 }}>
                  <Typography variant="body2" sx={{ mr: 1 }}>
                    {key}:
                  </Typography>
                  <Typography variant="body2" sx={{ flexGrow: 1 }}>
                    {value}
                  </Typography>
                  <IconButton onClick={() => handleRemoveSpecification(key)} color="error" size="small">
                    <DeleteIcon />
                  </IconButton>
                </Box>
              ))}
              <Button startIcon={<AddIcon />} onClick={handleAddSpecification}>
                Добавить характеристику
              </Button>
            </Grid>
            <Grid item xs={12}>
              <Box sx={{ display: 'flex', gap: 2 }}>
                <Button variant="contained" color="primary" type="submit">
                  {isEdit ? 'Сохранить' : 'Создать'}
                </Button>
                <Button variant="outlined" onClick={() => navigate('/admin/products')}>
                  Отмена
                </Button>
              </Box>
            </Grid>
          </Grid>
        </form>
      </Paper>
    </Container>
  );
};

export default AdminProductEdit; 