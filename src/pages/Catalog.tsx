import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Grid,
  Typography,
  Card,
  CardMedia,
  CardContent,
  Rating,
  Chip,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  InputAdornment,
  IconButton,
  useTheme,
  useMediaQuery,
  Pagination,
  Dialog,
  DialogContent,
  IconButton as MuiIconButton,
  Button,
} from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import { styled } from '@mui/material/styles';
import SearchIcon from '@mui/icons-material/Search';
import CloseIcon from '@mui/icons-material/Close';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import axios from 'axios';
import ProductSkeleton from '../components/ProductSkeleton';

const ProductCard = styled(motion.div)(({ theme }) => ({
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  background: theme.palette.background.paper,
  borderRadius: theme.shape.borderRadius,
  overflow: 'hidden',
  transition: 'all 0.3s ease',
  '&:hover': {
    transform: 'translateY(-8px)',
    boxShadow: theme.shadows[8],
  },
}));

const FilterSection = styled(Box)(({ theme }) => ({
  padding: theme.spacing(3),
  background: theme.palette.background.paper,
  borderRadius: theme.shape.borderRadius,
  boxShadow: theme.shadows[1],
  marginBottom: theme.spacing(3),
}));

const QuickViewDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiDialog-paper': {
    maxWidth: '900px',
    width: '100%',
    margin: theme.spacing(2),
    borderRadius: theme.shape.borderRadius,
  },
}));

const QuickViewContent = styled(DialogContent)(({ theme }) => ({
  padding: theme.spacing(3),
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(3),
}));

const QuickViewImage = styled('img')(({ theme }) => ({
  width: '100%',
  height: 'auto',
  maxHeight: '400px',
  objectFit: 'contain',
  borderRadius: theme.shape.borderRadius,
}));

const QuickViewActions = styled(Box)(({ theme }) => ({
  display: 'flex',
  gap: theme.spacing(2),
  marginTop: theme.spacing(2),
}));

const Catalog: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const location = useLocation();
  const navigate = useNavigate();
  const searchParams = new URLSearchParams(location.search);
  const categorySlug = searchParams.get('category');

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(categorySlug || '');
  const [sortBy, setSortBy] = useState('popular');
  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [categoriesRes, productsRes, favoritesRes] = await Promise.all([
          axios.get('http://localhost:5000/api/categories'),
          axios.get('http://localhost:5000/api/products', {
            params: {
              category: selectedCategory,
              sort: sortBy,
              search: searchQuery,
              page,
              limit: 12,
            },
          }),
          axios.get('http://localhost:5000/api/favorites'),
        ]);
        setCategories(categoriesRes.data.data.categories);
        setProducts(productsRes.data.data.products);
        setTotalPages(productsRes.data.data.pagination.pages);
        setFavorites(favoritesRes.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [selectedCategory, sortBy, searchQuery, page]);

  const handleCategoryChange = (event) => {
    const newCategory = event.target.value;
    setSelectedCategory(newCategory);
    navigate(newCategory ? `/catalog?category=${newCategory}` : '/catalog');
  };

  const handleSortChange = (event) => {
    setSortBy(event.target.value);
  };

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const handlePageChange = (event, value) => {
    setPage(value);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleQuickView = (product) => {
    setSelectedProduct(product);
  };

  const handleCloseQuickView = () => {
    setSelectedProduct(null);
  };

  const handleAddToCart = async (productId) => {
    try {
      await axios.post('http://localhost:5000/api/cart/add', { productId });
      // Показать уведомление об успешном добавлении
    } catch (error) {
      console.error('Error adding to cart:', error);
    }
  };

  const handleToggleFavorite = async (productId) => {
    try {
      if (favorites.includes(productId)) {
        await axios.delete(`http://localhost:5000/api/favorites/${productId}`);
        setFavorites(favorites.filter(id => id !== productId));
      } else {
        await axios.post('http://localhost:5000/api/favorites', { productId });
        setFavorites([...favorites, productId]);
      }
    } catch (error) {
      console.error('Error toggling favorite:', error);
    }
  };

  return (
    <Box sx={{ py: 8, bgcolor: 'background.default' }}>
      <Container maxWidth="lg">
        <Typography
          variant="h3"
          component="h1"
          gutterBottom
          sx={{
            textAlign: 'center',
            mb: 6,
            fontWeight: 700,
            color: 'text.primary',
          }}
        >
          Каталог товаров
        </Typography>

        <FilterSection>
          <Grid container spacing={3} alignItems="center">
            <Grid item xs={12} md={4}>
              <FormControl fullWidth>
                <InputLabel>Категория</InputLabel>
                <Select
                  value={selectedCategory}
                  label="Категория"
                  onChange={handleCategoryChange}
                >
                  <MenuItem value="">Все категории</MenuItem>
                  {categories.map((category) => (
                    <MenuItem key={category.id} value={category.slug}>
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
                  value={sortBy}
                  label="Сортировка"
                  onChange={handleSortChange}
                >
                  <MenuItem value="popular">По популярности</MenuItem>
                  <MenuItem value="price_asc">По возрастанию цены</MenuItem>
                  <MenuItem value="price_desc">По убыванию цены</MenuItem>
                  <MenuItem value="new">Сначала новые</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label="Поиск"
                value={searchQuery}
                onChange={handleSearchChange}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton>
                        <SearchIcon />
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
          </Grid>
        </FilterSection>

        <Grid container spacing={4}>
          {loading
            ? Array.from(new Array(12)).map((_, index) => (
                <Grid item xs={12} sm={6} md={4} lg={3} key={index}>
                  <ProductSkeleton />
                </Grid>
              ))
            : products.length === 0 ? (
                <Grid item xs={12}>
                  <Typography variant="h6" align="center" color="text.secondary" sx={{ mt: 6 }}>
                    Нет товаров по выбранным фильтрам.
                  </Typography>
                </Grid>
              ) : (
                products.map((product) => (
                  <Grid item xs={12} sm={6} md={4} lg={3} key={product.id}>
                    <ProductCard
                      whileHover={{ y: -8 }}
                    >
                      <Box sx={{ position: 'relative' }}>
                        <CardMedia
                          component="img"
                          height="200"
                          image={product.images[0]}
                          alt={product.name}
                          sx={{ objectFit: 'contain', p: 2 }}
                          onClick={() => handleQuickView(product)}
                        />
                        <MuiIconButton
                          sx={{
                            position: 'absolute',
                            top: 8,
                            right: 8,
                            bgcolor: 'background.paper',
                            '&:hover': { bgcolor: 'background.paper' },
                          }}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleToggleFavorite(product.id);
                          }}
                        >
                          {favorites.includes(product.id) ? (
                            <FavoriteIcon color="error" />
                          ) : (
                            <FavoriteBorderIcon />
                          )}
                        </MuiIconButton>
                      </Box>
                      <CardContent>
                        <Typography
                          variant="h6"
                          component="h3"
                          gutterBottom
                          sx={{
                            fontWeight: 600,
                            fontSize: '1rem',
                            lineHeight: 1.4,
                            cursor: 'pointer',
                          }}
                          onClick={() => handleQuickView(product)}
                        >
                          {product.name}
                        </Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                          <Rating value={product.rating} precision={0.5} size="small" readOnly />
                          <Typography variant="body2" color="text.secondary" sx={{ ml: 1 }}>
                            ({product.reviewsCount})
                          </Typography>
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                          <Typography
                            variant="h6"
                            sx={{
                              color: 'primary.main',
                              fontWeight: 700,
                            }}
                          >
                            {product.price.toLocaleString()} ₽
                          </Typography>
                          {product.discount > 0 && (
                            <Chip
                              label={`-${product.discount}%`}
                              color="error"
                              size="small"
                              sx={{ fontWeight: 600 }}
                            />
                          )}
                        </Box>
                        <Button
                          variant="contained"
                          fullWidth
                          startIcon={<ShoppingCartIcon />}
                          sx={{ mt: 2 }}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleAddToCart(product.id);
                          }}
                        >
                          В корзину
                        </Button>
                      </CardContent>
                    </ProductCard>
                  </Grid>
                ))
              )
          }
        </Grid>

        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <Pagination
            count={totalPages}
            page={page}
            onChange={handlePageChange}
            color="primary"
            size="large"
          />
        </Box>

        <AnimatePresence>
          {selectedProduct && (
            <QuickViewDialog
              open={!!selectedProduct}
              onClose={handleCloseQuickView}
              maxWidth="lg"
              fullWidth
            >
              <QuickViewContent>
                <MuiIconButton
                  onClick={handleCloseQuickView}
                  sx={{
                    position: 'absolute',
                    right: 8,
                    top: 8,
                  }}
                >
                  <CloseIcon />
                </MuiIconButton>
                <Grid container spacing={4}>
                  <Grid item xs={12} md={6}>
                    <QuickViewImage
                      src={selectedProduct.images[0]}
                      alt={selectedProduct.name}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Typography variant="h4" gutterBottom>
                      {selectedProduct.name}
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <Rating value={selectedProduct.rating} precision={0.5} readOnly />
                      <Typography variant="body2" color="text.secondary" sx={{ ml: 1 }}>
                        ({selectedProduct.reviewsCount} отзывов)
                      </Typography>
                    </Box>
                    <Typography variant="h5" color="primary" gutterBottom>
                      {selectedProduct.price.toLocaleString()} ₽
                    </Typography>
                    <Typography variant="body1" paragraph>
                      {selectedProduct.description}
                    </Typography>
                    <QuickViewActions>
                      <Button
                        variant="contained"
                        size="large"
                        startIcon={<ShoppingCartIcon />}
                        onClick={() => handleAddToCart(selectedProduct.id)}
                      >
                        В корзину
                      </Button>
                      <Button
                        variant="outlined"
                        size="large"
                        startIcon={favorites.includes(selectedProduct.id) ? <FavoriteIcon /> : <FavoriteBorderIcon />}
                        onClick={() => handleToggleFavorite(selectedProduct.id)}
                      >
                        {favorites.includes(selectedProduct.id) ? 'В избранном' : 'В избранное'}
                      </Button>
                    </QuickViewActions>
                  </Grid>
                </Grid>
              </QuickViewContent>
            </QuickViewDialog>
          )}
        </AnimatePresence>
      </Container>
    </Box>
  );
};

export default Catalog; 