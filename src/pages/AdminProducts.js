import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Container,
  Typography,
  Paper,
  Button,
  Grid,
  Box,
  TextField,
  IconButton,
  Divider,
} from '@mui/material';
import { Add as AddIcon, Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';
import { fetchProducts, deleteProduct } from '../store/slices/productSlice';
import Loading from '../components/Loading';
import Error from '../components/Error';
import Pagination from '../components/Pagination';

const AdminProducts = () => {
  const dispatch = useDispatch();
  const { items: products, loading, error, totalPages, currentPage } = useSelector((state) => state.products);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);

  useEffect(() => {
    dispatch(fetchProducts({ search, page, limit: 10 }));
  }, [dispatch, search, page]);

  const handleDelete = (id) => {
    if (window.confirm('Удалить этот товар?')) {
      dispatch(deleteProduct(id));
    }
  };

  return (
    <Container>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4">Товары</Typography>
        <Button variant="contained" color="primary" startIcon={<AddIcon />} href="/admin/products/new">
          Добавить товар
        </Button>
      </Box>
      <Paper sx={{ p: 2, mb: 3 }}>
        <TextField
          fullWidth
          label="Поиск по товарам"
          value={search}
          onChange={e => { setSearch(e.target.value); setPage(1); }}
        />
      </Paper>
      {loading ? (
        <Loading />
      ) : error ? (
        <Error message={error} onRetry={() => dispatch(fetchProducts({ search, page, limit: 10 }))} />
      ) : (
        <>
          <Grid container spacing={2}>
            {products.map((product) => (
              <Grid item xs={12} key={product.id}>
                <Paper sx={{ p: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Box>
                    <Typography variant="subtitle1">{product.name}</Typography>
                    <Typography variant="body2" color="text.secondary">ID: {product.id}</Typography>
                    <Typography variant="body2">Цена: {product.price.toLocaleString('ru-RU')} ₽</Typography>
                  </Box>
                  <Box>
                    <IconButton color="primary" href={`/admin/products/${product.id}/edit`}>
                      <EditIcon />
                    </IconButton>
                    <IconButton color="error" onClick={() => handleDelete(product.id)}>
                      <DeleteIcon />
                    </IconButton>
                  </Box>
                </Paper>
              </Grid>
            ))}
          </Grid>
          {totalPages > 1 && (
            <Pagination count={totalPages} page={currentPage} onChange={(e, p) => setPage(p)} />
          )}
        </>
      )}
    </Container>
  );
};

export default AdminProducts; 