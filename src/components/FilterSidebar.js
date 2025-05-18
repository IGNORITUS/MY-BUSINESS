import React, { useState } from 'react';
import {
  Box,
  Typography,
  Slider,
  FormGroup,
  FormControlLabel,
  Checkbox,
  Divider,
  Paper
} from '@mui/material';

const FilterSidebar = ({ onFilterChange }) => {
  const [filters, setFilters] = useState({
    priceRange: [0, 100000],
    categories: {
      led: false,
      smart: false,
      audio: false,
      gaming: false
    }
  });

  const handlePriceChange = (event, newValue) => {
    setFilters({ ...filters, priceRange: newValue });
    onFilterChange({ ...filters, priceRange: newValue });
  };

  const handleCategoryChange = (category) => (event) => {
    const newCategories = {
      ...filters.categories,
      [category]: event.target.checked
    };
    setFilters({ ...filters, categories: newCategories });
    onFilterChange({ ...filters, categories: newCategories });
  };

  return (
    <Paper sx={{ p: 2 }}>
      <Typography variant="h6" gutterBottom>
        Фильтры
      </Typography>
      <Divider sx={{ mb: 2 }} />

      <Box sx={{ mb: 3 }}>
        <Typography gutterBottom>Диапазон цен</Typography>
        <Slider
          value={filters.priceRange}
          onChange={handlePriceChange}
          valueLabelDisplay="auto"
          min={0}
          max={100000}
          step={1000}
        />
        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Typography variant="body2">{filters.priceRange[0]} ₽</Typography>
          <Typography variant="body2">{filters.priceRange[1]} ₽</Typography>
        </Box>
      </Box>

      <Divider sx={{ mb: 2 }} />

      <Typography gutterBottom>Категории</Typography>
      <FormGroup>
        <FormControlLabel
          control={
            <Checkbox
              checked={filters.categories.led}
              onChange={handleCategoryChange('led')}
            />
          }
          label="LED-продукты"
        />
        <FormControlLabel
          control={
            <Checkbox
              checked={filters.categories.smart}
              onChange={handleCategoryChange('smart')}
            />
          }
          label="Умные устройства"
        />
        <FormControlLabel
          control={
            <Checkbox
              checked={filters.categories.audio}
              onChange={handleCategoryChange('audio')}
            />
          }
          label="Аудио"
        />
        <FormControlLabel
          control={
            <Checkbox
              checked={filters.categories.gaming}
              onChange={handleCategoryChange('gaming')}
            />
          }
          label="Игровые"
        />
      </FormGroup>
    </Paper>
  );
};

export default FilterSidebar; 