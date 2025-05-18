import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  Box,
  Rating,
  Chip,
  IconButton,
  CardActionArea,
  Button
} from '@mui/material';
import {
  Favorite as FavoriteIcon,
  FavoriteBorder as FavoriteBorderIcon,
  ShoppingCart as ShoppingCartIcon,
  Favorite as FavoriteIconMUI
} from '@mui/icons-material';
import { useDispatch, useSelector } from 'react-redux';
import { addToCart } from '../store/slices/cartSlice';
import { toggleFavorite } from '../store/slices/favoritesSlice';
import { formatPrice } from '../utils/format';

const ProductCard = ({ product }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { items: favorites } = useSelector((state) => state.favorites);
  const isFavorite = favorites.some((item) => item.id === product.id);

  const handleAddToCart = (e) => {
    e.stopPropagation();
    dispatch(addToCart({ ...product, quantity: 1 }));
  };

  const handleToggleFavorite = (e) => {
    e.stopPropagation();
    dispatch(toggleFavorite(product));
  };

  const handleClick = () => {
    navigate(`/product/${product.id}`);
  };

  const {
    name,
    price,
    discountPrice,
    image,
    rating,
    reviews,
    isNew,
    isSale
  } = product;

  return (
    <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <CardActionArea onClick={handleClick}>
        <Box sx={{ position: 'relative' }}>
          <CardMedia
            component="img"
            height="200"
            image={image}
            alt={name}
            sx={{ objectFit: 'contain', p: 2 }}
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = `https://placehold.co/400x300?text=${encodeURIComponent(name)}`;
            }}
          />
          {isNew && (
            <Chip
              label="New"
              color="primary"
              size="small"
              sx={{ position: 'absolute', top: 10, left: 10 }}
            />
          )}
          {isSale && (
            <Chip
              label="Sale"
              color="error"
              size="small"
              sx={{ position: 'absolute', top: 10, right: 10 }}
            />
          )}
          <IconButton
            sx={{
              position: 'absolute',
              top: 8,
              right: 8,
              bgcolor: 'background.paper'
            }}
            onClick={handleToggleFavorite}
          >
            {isFavorite ? (
              <FavoriteIcon color="error" />
            ) : (
              <FavoriteBorderIcon />
            )}
          </IconButton>
          {product.stock === 0 && (
            <Chip
              label="Нет в наличии"
              color="error"
              sx={{
                position: 'absolute',
                top: 8,
                left: 8
              }}
            />
          )}
        </Box>
        <CardContent sx={{ flexGrow: 1 }}>
          <Typography
            gutterBottom
            variant="h6"
            component="h2"
            sx={{
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical'
            }}
          >
            {name}
          </Typography>
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              mb: 1
            }}
          >
            {product.description}
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
            <Rating value={rating} precision={0.5} size="small" readOnly />
            <Typography variant="body2" color="text.secondary" sx={{ ml: 1 }}>
              ({reviews})
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            {discountPrice ? (
              <>
                <Typography
                  variant="h6"
                  color="error"
                  sx={{ mr: 1 }}
                >
                  {formatPrice(discountPrice)}
                </Typography>
                <Typography
                  variant="body1"
                  color="text.secondary"
                  sx={{ textDecoration: 'line-through' }}
                >
                  {formatPrice(price)}
                </Typography>
              </>
            ) : (
              <Typography variant="h6">{formatPrice(price)}</Typography>
            )}
          </Box>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Button
              variant="contained"
              startIcon={<ShoppingCartIcon />}
              onClick={handleAddToCart}
              fullWidth
              disabled={product.stock === 0}
            >
              Add to Cart
            </Button>
            <Button
              variant="outlined"
              onClick={handleToggleFavorite}
              sx={{ minWidth: 'auto' }}
            >
              <FavoriteIconMUI />
            </Button>
          </Box>
        </CardContent>
      </CardActionArea>
    </Card>
  );
};

export default ProductCard; 