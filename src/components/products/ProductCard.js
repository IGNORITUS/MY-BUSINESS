import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  Button,
  Box,
  Rating,
  Chip
} from '@mui/material';
import { ShoppingCart as CartIcon } from '@mui/icons-material';
import { useDispatch } from 'react-redux';
import { addToCart } from '../../store/slices/cartSlice';

const ProductCard = ({ product }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleAddToCart = (e) => {
    e.stopPropagation();
    dispatch(addToCart(product));
  };

  const handleCardClick = () => {
    navigate(`/products/${product.id}`);
  };

  return (
    <Card
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        cursor: 'pointer',
        transition: 'transform 0.2s',
        '&:hover': {
          transform: 'scale(1.02)'
        }
      }}
      onClick={handleCardClick}
    >
      <CardMedia
        component="img"
        height="200"
        image={product.image}
        alt={product.name}
        sx={{ objectFit: 'contain', p: 2 }}
      />
      <CardContent sx={{ flexGrow: 1 }}>
        <Box sx={{ mb: 1 }}>
          {product.isNew && (
            <Chip
              label="Новинка"
              color="primary"
              size="small"
              sx={{ mr: 1 }}
            />
          )}
          {product.discount > 0 && (
            <Chip
              label={`-${product.discount}%`}
              color="error"
              size="small"
            />
          )}
        </Box>

        <Typography gutterBottom variant="h6" component="h3" noWrap>
          {product.name}
        </Typography>

        <Typography
          variant="body2"
          color="text.secondary"
          sx={{
            mb: 2,
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden'
          }}
        >
          {product.description}
        </Typography>

        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
          <Rating value={product.rating} precision={0.5} readOnly size="small" />
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ ml: 1 }}
          >
            ({product.reviewsCount})
          </Typography>
        </Box>

        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            mt: 2
          }}
        >
          <Box>
            {product.discount > 0 ? (
              <>
                <Typography
                  variant="h6"
                  color="error"
                  component="span"
                  sx={{ mr: 1 }}
                >
                  {Math.round(
                    product.price * (1 - product.discount / 100)
                  ).toLocaleString()}{' '}
                  ₽
                </Typography>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  component="span"
                  sx={{ textDecoration: 'line-through' }}
                >
                  {product.price.toLocaleString()} ₽
                </Typography>
              </>
            ) : (
              <Typography variant="h6" component="span">
                {product.price.toLocaleString()} ₽
              </Typography>
            )}
          </Box>

          <Button
            variant="contained"
            color="primary"
            size="small"
            startIcon={<CartIcon />}
            onClick={handleAddToCart}
          >
            В корзину
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
};

export default ProductCard; 