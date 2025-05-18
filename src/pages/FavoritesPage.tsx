import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Grid,
  Typography,
  Card,
  CardMedia,
  CardContent,
  IconButton,
  Button,
  Rating,
  Chip,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import { motion } from 'framer-motion';
import { styled } from '@mui/material/styles';
import DeleteIcon from '@mui/icons-material/Delete';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import FavoriteIcon from '@mui/icons-material/Favorite';
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

const FavoritesPage: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const navigate = useNavigate();

  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFavorites();
  }, []);

  const fetchFavorites = async () => {
    setLoading(true);
    try {
      const response = await axios.get('http://localhost:5000/api/favorites');
      setFavorites(response.data);
    } catch (error) {
      console.error('Error fetching favorites:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveFavorite = async (productId) => {
    try {
      await axios.delete(`http://localhost:5000/api/favorites/${productId}`);
      setFavorites(favorites.filter(item => item.id !== productId));
    } catch (error) {
      console.error('Error removing favorite:', error);
    }
  };

  const handleAddToCart = async (productId) => {
    try {
      await axios.post('http://localhost:5000/api/cart/add', { productId });
      // Показать уведомление об успешном добавлении
    } catch (error) {
      console.error('Error adding to cart:', error);
    }
  };

  if (loading) {
    return (
      <Box sx={{ py: 8 }}>
        <Container maxWidth="lg">
          <Grid container spacing={4}>
            {Array.from(new Array(8)).map((_, index) => (
              <Grid item xs={12} sm={6} md={4} lg={3} key={index}>
                <ProductSkeleton />
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>
    );
  }

  return (
    <Box sx={{ py: 8 }}>
      <Container maxWidth="lg">
        <Typography
          variant="h4"
          component="h1"
          gutterBottom
          sx={{
            fontWeight: 700,
            color: 'text.primary',
            mb: 4,
          }}
        >
          Избранное
        </Typography>

        {favorites.length === 0 ? (
          <Box
            sx={{
              textAlign: 'center',
              py: 8,
            }}
          >
            <FavoriteIcon
              sx={{
                fontSize: 64,
                color: 'text.secondary',
                mb: 2,
              }}
            />
            <Typography variant="h6" color="text.secondary" gutterBottom>
              У вас пока нет избранных товаров
            </Typography>
            <Button
              variant="contained"
              onClick={() => navigate('/catalog')}
              sx={{ mt: 2 }}
            >
              Перейти в каталог
            </Button>
          </Box>
        ) : (
          <Grid container spacing={4}>
            {favorites.map((product) => (
              <Grid item xs={12} sm={6} md={4} lg={3} key={product.id}>
                <ProductCard
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                >
                  <Box sx={{ position: 'relative' }}>
                    <CardMedia
                      component="img"
                      height="200"
                      image={product.images[0]}
                      alt={product.name}
                      sx={{ objectFit: 'contain', p: 2 }}
                      onClick={() => navigate(`/product/${product.id}`)}
                    />
                    <IconButton
                      sx={{
                        position: 'absolute',
                        top: 8,
                        right: 8,
                        bgcolor: 'background.paper',
                        '&:hover': { bgcolor: 'background.paper' },
                      }}
                      onClick={() => handleRemoveFavorite(product.id)}
                    >
                      <DeleteIcon />
                    </IconButton>
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
                      onClick={() => navigate(`/product/${product.id}`)}
                    >
                      {product.name}
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <Rating value={product.rating} precision={0.5} size="small" readOnly />
                      <Typography variant="body2" color="text.secondary" sx={{ ml: 1 }}>
                        ({product.reviewsCount})
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
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
                      onClick={() => handleAddToCart(product.id)}
                    >
                      В корзину
                    </Button>
                  </CardContent>
                </ProductCard>
              </Grid>
            ))}
          </Grid>
        )}
      </Container>
    </Box>
  );
};

export default FavoritesPage; 