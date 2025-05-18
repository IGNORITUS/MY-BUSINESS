import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  TextField,
  Grid,
  Paper,
  Typography,
  Slider,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  Button,
  Collapse,
  IconButton,
  Drawer,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import FilterListIcon from '@mui/icons-material/FilterList';
import CloseIcon from '@mui/icons-material/Close';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { setFilters } from '../redux/slices/productSlice';

interface FilterState {
  search: string;
  category: string;
  brand: string;
  priceRange: [number, number];
  rating: number;
  sortBy: string;
  inStock: boolean;
  onSale: boolean;
}

const SearchAndFilter: React.FC = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const [filters, setFilters] = useState<FilterState>({
    search: '',
    category: 'all',
    brand: 'all',
    priceRange: [0, 1000],
    rating: 0,
    sortBy: 'newest',
    inStock: false,
    onSale: false,
  });

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [activeFilters, setActiveFilters] = useState<string[]>([]);

  useEffect(() => {
    dispatch(setFilters(filters));
    updateActiveFilters();
  }, [filters, dispatch]);

  const updateActiveFilters = () => {
    const active: string[] = [];
    if (filters.category !== 'all') active.push(t('category') + ': ' + t(filters.category));
    if (filters.brand !== 'all') active.push(t('brand') + ': ' + filters.brand);
    if (filters.rating > 0) active.push(t('rating') + ': ' + filters.rating + '+');
    if (filters.inStock) active.push(t('inStock'));
    if (filters.onSale) active.push(t('onSale'));
    setActiveFilters(active);
  };

  const handleFilterChange = (name: keyof FilterState, value: any) => {
    setFilters((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleRemoveFilter = (filter: string) => {
    const [key, value] = filter.split(': ');
    switch (key) {
      case t('category'):
        handleFilterChange('category', 'all');
        break;
      case t('brand'):
        handleFilterChange('brand', 'all');
        break;
      case t('rating'):
        handleFilterChange('rating', 0);
        break;
      case t('inStock'):
        handleFilterChange('inStock', false);
        break;
      case t('onSale'):
        handleFilterChange('onSale', false);
        break;
    }
  };

  const handleReset = () => {
    setFilters({
      search: '',
      category: 'all',
      brand: 'all',
      priceRange: [0, 1000],
      rating: 0,
      sortBy: 'newest',
      inStock: false,
      onSale: false,
    });
  };

  const filterContent = (
    <Box sx={{ p: 2 }}>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <TextField
            fullWidth
            label={t('search')}
            value={filters.search}
            onChange={(e) => handleFilterChange('search', e.target.value)}
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <FormControl fullWidth>
            <InputLabel>{t('category')}</InputLabel>
            <Select
              value={filters.category}
              onChange={(e) => handleFilterChange('category', e.target.value)}
            >
              <MenuItem value="all">{t('allCategories')}</MenuItem>
              <MenuItem value="electronics">{t('electronics')}</MenuItem>
              <MenuItem value="clothing">{t('clothing')}</MenuItem>
              <MenuItem value="books">{t('books')}</MenuItem>
            </Select>
          </FormControl>
        </Grid>

        <Grid item xs={12} sm={6}>
          <FormControl fullWidth>
            <InputLabel>{t('brand')}</InputLabel>
            <Select
              value={filters.brand}
              onChange={(e) => handleFilterChange('brand', e.target.value)}
            >
              <MenuItem value="all">{t('allBrands')}</MenuItem>
              <MenuItem value="apple">Apple</MenuItem>
              <MenuItem value="samsung">Samsung</MenuItem>
              <MenuItem value="sony">Sony</MenuItem>
            </Select>
          </FormControl>
        </Grid>

        <Grid item xs={12}>
          <Typography gutterBottom>{t('priceRange')}</Typography>
          <Slider
            value={filters.priceRange}
            onChange={(_, value) => handleFilterChange('priceRange', value)}
            valueLabelDisplay="auto"
            min={0}
            max={1000}
          />
          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <Typography variant="body2">${filters.priceRange[0]}</Typography>
            <Typography variant="body2">${filters.priceRange[1]}</Typography>
          </Box>
        </Grid>

        <Grid item xs={12}>
          <Typography gutterBottom>{t('rating')}</Typography>
          <Slider
            value={filters.rating}
            onChange={(_, value) => handleFilterChange('rating', value)}
            valueLabelDisplay="auto"
            min={0}
            max={5}
            step={1}
            marks
          />
        </Grid>

        <Grid item xs={12}>
          <FormControl fullWidth>
            <InputLabel>{t('sortBy')}</InputLabel>
            <Select
              value={filters.sortBy}
              onChange={(e) => handleFilterChange('sortBy', e.target.value)}
            >
              <MenuItem value="newest">{t('newest')}</MenuItem>
              <MenuItem value="price_asc">{t('priceAsc')}</MenuItem>
              <MenuItem value="price_desc">{t('priceDesc')}</MenuItem>
              <MenuItem value="rating">{t('rating')}</MenuItem>
            </Select>
          </FormControl>
        </Grid>

        <Grid item xs={12}>
          <Button
            fullWidth
            variant="outlined"
            color="primary"
            onClick={handleReset}
          >
            {t('resetFilters')}
          </Button>
        </Grid>
      </Grid>
    </Box>
  );

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Paper elevation={3}>
        <Box sx={{ p: 2 }}>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                {activeFilters.map((filter) => (
                  <Chip
                    key={filter}
                    label={filter}
                    onDelete={() => handleRemoveFilter(filter)}
                    color="primary"
                    variant="outlined"
                  />
                ))}
              </Box>
            </Grid>
            {isMobile && (
              <Grid item>
                <IconButton
                  color="primary"
                  onClick={() => setDrawerOpen(true)}
                >
                  <FilterListIcon />
                </IconButton>
              </Grid>
            )}
          </Grid>
        </Box>

        {!isMobile && filterContent}

        <Drawer
          anchor="right"
          open={drawerOpen}
          onClose={() => setDrawerOpen(false)}
        >
          <Box sx={{ width: 300, p: 2 }}>
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
              <IconButton onClick={() => setDrawerOpen(false)}>
                <CloseIcon />
              </IconButton>
            </Box>
            {filterContent}
          </Box>
        </Drawer>
      </Paper>
    </Container>
  );
};

export default SearchAndFilter; 