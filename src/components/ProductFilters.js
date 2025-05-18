import React from 'react';
import {
  Box,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Slider,
  Typography,
  Paper,
  Grid
} from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { setFilters } from '../store/slices/productSlice';

const ProductFilters = () => {
  const dispatch = useDispatch();
  const { categories } = useSelector((state) => state.categories);
  const { filters } = useSelector((state) => state.products);

  const handleSearchChange = (event) => {
    dispatch(setFilters({ ...filters, search: event.target.value }));
  };

  const handleCategoryChange = (event) => {
    dispatch(setFilters({ ...filters, category: event.target.value }));
  };

  const handlePriceChange = (event, newValue) => {
    dispatch(setFilters({ ...filters, priceRange: newValue }));
  };

  const handleSortChange = (event) => {
    dispatch(setFilters({ ...filters, sort: event.target.value }));
  };

  return (
    <Paper sx={{ p: 2, mb: 2 }}>
      <Grid container spacing={2}>
        <Grid item xs={12} md={4}>
          <TextField
            fullWidth
            label="Поиск"
            value={filters.search}
            onChange={handleSearchChange}
            placeholder="Поиск по названию или описанию"
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <FormControl fullWidth>
            <InputLabel>Категория</InputLabel>
            <Select
              value={filters.category}
              label="Категория"
              onChange={handleCategoryChange}
            >
              <MenuItem value="">Все категории</MenuItem>
              {categories.map((category) => (
                <MenuItem key={category._id} value={category._id}>
                  {category.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} md={4}>
          <FormControl fullWidth>
            <InputLabel>Сортировка</InputLabel>
            <Select
              value={filters.sort}
              label="Сортировка"
              onChange={handleSortChange}
            >
              <MenuItem value="name:asc">По названию (А-Я)</MenuItem>
              <MenuItem value="name:desc">По названию (Я-А)</MenuItem>
              <MenuItem value="price:asc">По цене (возрастание)</MenuItem>
              <MenuItem value="price:desc">По цене (убывание)</MenuItem>
              <MenuItem value="createdAt:desc">Сначала новые</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12}>
          <Typography gutterBottom>Цена</Typography>
          <Slider
            value={filters.priceRange}
            onChange={handlePriceChange}
            valueLabelDisplay="auto"
            min={0}
            max={100000}
            step={1000}
          />
          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <Typography variant="body2">
              {filters.priceRange[0]} ₽
            </Typography>
            <Typography variant="body2">
              {filters.priceRange[1]} ₽
            </Typography>
          </Box>
        </Grid>
      </Grid>
    </Paper>
  );
};

export default ProductFilters; 