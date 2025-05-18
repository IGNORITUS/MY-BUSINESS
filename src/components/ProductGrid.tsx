import React from 'react';
import {
  Grid,
  Card,
  CardMedia,
  CardContent,
  Typography,
  Box,
  IconButton,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { motion } from 'framer-motion';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import { useNavigate } from 'react-router-dom';

const ProductCard = styled(motion(Card))(({ theme }) => ({
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  position: 'relative',
  background: theme.palette.background.paper,
  border: `1px solid ${theme.palette.grey[100]}`,
  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  '&:hover': {
    transform: 'translateY(-8px)',
    boxShadow: theme.shadows[8],
    '& .product-actions': {
      opacity: 1,
    },
  },
}));

const ProductImage = styled(CardMedia)(({ theme }) => ({
  height: 300,
  position: 'relative',
  '&::after': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'linear-gradient(to bottom, rgba(0,0,0,0) 0%, rgba(0,0,0,0.1) 100%)',
    opacity: 0,
    transition: 'opacity 0.3s ease',
  },
  '&:hover::after': {
    opacity: 1,
  },
}));

const ProductActions = styled(Box)(({ theme }) => ({
  position: 'absolute',
  top: theme.spacing(2),
  right: theme.spacing(2),
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(1),
  opacity: 0,
  transition: 'opacity 0.3s ease',
}));

const ActionButton = styled(IconButton)(({ theme }) => ({
  background: theme.palette.background.paper,
  boxShadow: theme.shadows[2],
  '&:hover': {
    background: theme.palette.background.paper,
    transform: 'scale(1.1)',
  },
}));

const AddToCartButton = styled(IconButton)(({ theme }) => ({
  position: 'absolute',
  bottom: theme.spacing(2),
  right: theme.spacing(2),
  background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
  color: theme.palette.common.white,
  opacity: 0,
  transform: 'translateY(10px)',
  transition: 'all 0.3s ease',
  '&:hover': {
    background: `linear-gradient(45deg, ${theme.palette.primary.dark}, ${theme.palette.secondary.dark})`,
    transform: 'translateY(10px) scale(1.1)',
  },
}));

interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
  category: string;
  brand: string;
  isFavorite?: boolean;
}

interface ProductGridProps {
  products: Product[];
  onFavoriteToggle: (productId: string) => void;
  onAddToCart: (productId: string) => void;
}

const ProductGrid: React.FC<ProductGridProps> = ({
  products,
  onFavoriteToggle,
  onAddToCart,
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const navigate = useNavigate();

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  };

  return (
    <Grid
      container
      spacing={3}
      component={motion.div}
      variants={container}
      initial="hidden"
      animate="show"
    >
      {products.map((product) => (
        <Grid item xs={12} sm={6} md={4} lg={3} key={product.id}>
          <ProductCard
            variants={item}
            onClick={() => navigate(`/product/${product.id}`)}
            sx={{ cursor: 'pointer' }}
          >
            <ProductImage
              image={product.image}
              title={product.name}
              component={motion.div}
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.3 }}
            />
            <ProductActions className="product-actions">
              <ActionButton
                size="small"
                onClick={(e) => {
                  e.stopPropagation();
                  onFavoriteToggle(product.id);
                }}
              >
                {product.isFavorite ? (
                  <FavoriteIcon color="error" />
                ) : (
                  <FavoriteBorderIcon />
                )}
              </ActionButton>
            </ProductActions>
            <AddToCartButton
              className="add-to-cart"
              size="small"
              onClick={(e) => {
                e.stopPropagation();
                onAddToCart(product.id);
              }}
            >
              <ShoppingCartIcon />
            </AddToCartButton>
            <CardContent sx={{ flexGrow: 1, p: 2 }}>
              <Typography
                variant="subtitle2"
                color="text.secondary"
                gutterBottom
                sx={{ mb: 1 }}
              >
                {product.brand}
              </Typography>
              <Typography
                variant="h6"
                component="h3"
                gutterBottom
                sx={{
                  fontWeight: 600,
                  mb: 1,
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  display: '-webkit-box',
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: 'vertical',
                }}
              >
                {product.name}
              </Typography>
              <Typography
                variant="h6"
                color="primary"
                sx={{ fontWeight: 600 }}
              >
                {product.price.toLocaleString('ru-RU')} ₽
              </Typography>
            </CardContent>
          </ProductCard>
        </Grid>
      ))}
    </Grid>
  );
};

export default ProductGrid; 