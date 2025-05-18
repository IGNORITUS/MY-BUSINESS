import React, { useState, useEffect } from 'react';
import {
  Box,
  Drawer,
  Typography,
  Slider,
  FormGroup,
  FormControlLabel,
  Checkbox,
  Button,
  TextField,
  InputAdornment,
  IconButton,
  Collapse,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import SearchIcon from '@mui/icons-material/Search';
import FilterListIcon from '@mui/icons-material/FilterList';
import CloseIcon from '@mui/icons-material/Close';
import { motion, AnimatePresence } from 'framer-motion';

const FilterDrawer = styled(Drawer)(({ theme }) => ({
  '& .MuiDrawer-paper': {
    width: 320,
    padding: theme.spacing(3),
    background: theme.palette.background.paper,
    borderRight: `1px solid ${theme.palette.grey[100]}`,
  },
}));

const FilterSection = styled(Box)(({ theme }) => ({
  marginBottom: theme.spacing(4),
  '&:last-child': {
    marginBottom: 0,
  },
}));

const FilterTitle = styled(Typography)(({ theme }) => ({
  marginBottom: theme.spacing(2),
  fontWeight: 600,
  color: theme.palette.text.primary,
}));

const PriceRange = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(2),
  marginTop: theme.spacing(2),
}));

const FilterButton = styled(Button)(({ theme }) => ({
  width: '100%',
  marginTop: theme.spacing(2),
  background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
  color: theme.palette.common.white,
  '&:hover': {
    background: `linear-gradient(45deg, ${theme.palette.primary.dark}, ${theme.palette.secondary.dark})`,
  },
}));

interface CatalogFiltersProps {
  categories: string[];
  brands: string[];
  priceRange: [number, number];
  onFilterChange: (filters: any) => void;
}

const CatalogFilters: React.FC<CatalogFiltersProps> = ({
  categories,
  brands,
  priceRange,
  onFilterChange,
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [isOpen, setIsOpen] = useState(!isMobile);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [price, setPrice] = useState<[number, number]>(priceRange);
  const [expandedSections, setExpandedSections] = useState({
    categories: true,
    brands: true,
    price: true,
  });

  const handleCategoryChange = (category: string) => {
    setSelectedCategories((prev) =>
      prev.includes(category)
        ? prev.filter((c) => c !== category)
        : [...prev, category]
    );
  };

  const handleBrandChange = (brand: string) => {
    setSelectedBrands((prev) =>
      prev.includes(brand)
        ? prev.filter((b) => b !== brand)
        : [...prev, brand]
    );
  };

  const handlePriceChange = (_: Event, newValue: number | number[]) => {
    setPrice(newValue as [number, number]);
  };

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
  };

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const applyFilters = () => {
    onFilterChange({
      search: searchQuery,
      categories: selectedCategories,
      brands: selectedBrands,
      priceRange: price,
    });
  };

  const resetFilters = () => {
    setSearchQuery('');
    setSelectedCategories([]);
    setSelectedBrands([]);
    setPrice(priceRange);
    onFilterChange({
      search: '',
      categories: [],
      brands: [],
      priceRange: priceRange,
    });
  };

  const FilterContent = () => (
    <Box>
      <TextField
        fullWidth
        variant="outlined"
        placeholder="Поиск товаров..."
        value={searchQuery}
        onChange={handleSearch}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon />
            </InputAdornment>
          ),
          endAdornment: searchQuery && (
            <InputAdornment position="end">
              <IconButton
                size="small"
                onClick={() => setSearchQuery('')}
                edge="end"
              >
                <CloseIcon />
              </IconButton>
            </InputAdornment>
          ),
        }}
        sx={{ mb: 3 }}
      />

      <FilterSection>
        <Box
          onClick={() => toggleSection('categories')}
          sx={{ cursor: 'pointer', display: 'flex', alignItems: 'center', mb: 2 }}
        >
          <FilterTitle>Категории</FilterTitle>
        </Box>
        <Collapse in={expandedSections.categories}>
          <FormGroup>
            {categories.map((category) => (
              <FormControlLabel
                key={category}
                control={
                  <Checkbox
                    checked={selectedCategories.includes(category)}
                    onChange={() => handleCategoryChange(category)}
                    sx={{
                      color: theme.palette.grey[400],
                      '&.Mui-checked': {
                        color: theme.palette.secondary.main,
                      },
                    }}
                  />
                }
                label={category}
              />
            ))}
          </FormGroup>
        </Collapse>
      </FilterSection>

      <FilterSection>
        <Box
          onClick={() => toggleSection('brands')}
          sx={{ cursor: 'pointer', display: 'flex', alignItems: 'center', mb: 2 }}
        >
          <FilterTitle>Бренды</FilterTitle>
        </Box>
        <Collapse in={expandedSections.brands}>
          <FormGroup>
            {brands.map((brand) => (
              <FormControlLabel
                key={brand}
                control={
                  <Checkbox
                    checked={selectedBrands.includes(brand)}
                    onChange={() => handleBrandChange(brand)}
                    sx={{
                      color: theme.palette.grey[400],
                      '&.Mui-checked': {
                        color: theme.palette.secondary.main,
                      },
                    }}
                  />
                }
                label={brand}
              />
            ))}
          </FormGroup>
        </Collapse>
      </FilterSection>

      <FilterSection>
        <Box
          onClick={() => toggleSection('price')}
          sx={{ cursor: 'pointer', display: 'flex', alignItems: 'center', mb: 2 }}
        >
          <FilterTitle>Цена</FilterTitle>
        </Box>
        <Collapse in={expandedSections.price}>
          <Slider
            value={price}
            onChange={handlePriceChange}
            valueLabelDisplay="auto"
            min={priceRange[0]}
            max={priceRange[1]}
            sx={{
              color: theme.palette.secondary.main,
              '& .MuiSlider-thumb': {
                '&:hover, &.Mui-focusVisible': {
                  boxShadow: '0px 0px 0px 8px rgba(196, 167, 125, 0.16)',
                },
              },
            }}
          />
          <PriceRange>
            <Typography variant="body2" color="text.secondary">
              {price[0]} ₽
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {price[1]} ₽
            </Typography>
          </PriceRange>
        </Collapse>
      </FilterSection>

      <Box sx={{ mt: 4 }}>
        <FilterButton variant="contained" onClick={applyFilters}>
          Применить фильтры
        </FilterButton>
        <Button
          variant="text"
          onClick={resetFilters}
          sx={{ mt: 2, width: '100%' }}
        >
          Сбросить все
        </Button>
      </Box>
    </Box>
  );

  if (isMobile) {
    return (
      <>
        <Button
          variant="outlined"
          startIcon={<FilterListIcon />}
          onClick={() => setIsOpen(true)}
          sx={{ mb: 2 }}
        >
          Фильтры
        </Button>
        <FilterDrawer
          anchor="right"
          open={isOpen}
          onClose={() => setIsOpen(false)}
        >
          <Box sx={{ p: 2 }}>
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                mb: 2,
              }}
            >
              <Typography variant="h6">Фильтры</Typography>
              <IconButton onClick={() => setIsOpen(false)}>
                <CloseIcon />
              </IconButton>
            </Box>
            <FilterContent />
          </Box>
        </FilterDrawer>
      </>
    );
  }

  return (
    <Box
      component={motion.div}
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3 }}
    >
      <FilterContent />
    </Box>
  );
};

export default CatalogFilters; 