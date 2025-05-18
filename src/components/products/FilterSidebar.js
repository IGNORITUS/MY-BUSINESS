import React from 'react';
import {
  Paper,
  Typography,
  Box,
  Slider,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Divider,
  Button
} from '@mui/material';

const categories = [
  { value: 'smartphones', label: 'Смартфоны' },
  { value: 'laptops', label: 'Ноутбуки' },
  { value: 'tablets', label: 'Планшеты' },
  { value: 'headphones', label: 'Наушники' },
  { value: 'smartwatches', label: 'Умные часы' }
];

const sortOptions = [
  { value: 'newest', label: 'Сначала новые' },
  { value: 'price_asc', label: 'По возрастанию цены' },
  { value: 'price_desc', label: 'По убыванию цены' },
  { value: 'popular', label: 'По популярности' }
];

const FilterSidebar = ({ filters, onFilterChange }) => {
  const handleCategoryChange = (event) => {
    onFilterChange({
      ...filters,
      category: event.target.value
    });
  };

  const handlePriceChange = (event, newValue) => {
    onFilterChange({
      ...filters,
      priceRange: newValue
    });
  };

  const handleSortChange = (event) => {
    onFilterChange({
      ...filters,
      sortBy: event.target.value
    });
  };

  const handleReset = () => {
    onFilterChange({
      category: '',
      priceRange: [0, 1000000],
      sortBy: 'newest'
    });
  };

  return (
    <Paper sx={{ p: 2 }}>
      <Typography variant="h6" gutterBottom>
        Фильтры
      </Typography>

      <Box sx={{ mb: 3 }}>
        <Typography gutterBottom>Категория</Typography>
        <FormControl fullWidth size="small">
          <Select
            value={filters.category}
            onChange={handleCategoryChange}
            displayEmpty
          >
            <MenuItem value="">Все категории</MenuItem>
            {categories.map((category) => (
              <MenuItem key={category.value} value={category.value}>
                {category.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>

      <Divider sx={{ my: 2 }} />

      <Box sx={{ mb: 3 }}>
        <Typography gutterBottom>Цена</Typography>
        <Slider
          value={filters.priceRange}
          onChange={handlePriceChange}
          valueLabelDisplay="auto"
          min={0}
          max={1000000}
          step={1000}
          valueLabelFormat={(value) => `${value.toLocaleString()} ₽`}
        />
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
          <Typography variant="body2" color="text.secondary">
            {filters.priceRange[0].toLocaleString()} ₽
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {filters.priceRange[1].toLocaleString()} ₽
          </Typography>
        </Box>
      </Box>

      <Divider sx={{ my: 2 }} />

      <Box sx={{ mb: 3 }}>
        <Typography gutterBottom>Сортировка</Typography>
        <FormControl fullWidth size="small">
          <Select value={filters.sortBy} onChange={handleSortChange}>
            {sortOptions.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>

      <Button
        variant="outlined"
        color="primary"
        fullWidth
        onClick={handleReset}
      >
        Сбросить фильтры
      </Button>
    </Paper>
  );
};

export default FilterSidebar; 