import React, { memo, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { Card, CardContent, Typography, Button, Chip, Box } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { addToCart } from '../redux/slices/cartSlice';
import { Product } from '../types/product';
import Image from './common/Image';
import { getProductImagePath, getPlaceholderPath } from '../utils/imageUtils';

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [isHovered, setIsHovered] = useState(false);

  const handleAddToCart = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    dispatch(addToCart({ product, quantity: 1 }));
  }, [dispatch, product]);

  const handleClick = useCallback(() => {
    navigate(`/products/${product._id}`);
  }, [navigate, product._id]);

  const handleMouseEnter = useCallback(() => {
    setIsHovered(true);
  }, []);

  const handleMouseLeave = useCallback(() => {
    setIsHovered(false);
  }, []);

  return (
    <Card
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        cursor: 'pointer',
        transition: 'transform 0.2s ease-in-out',
        transform: isHovered ? 'scale(1.02)' : 'scale(1)',
      }}
      onClick={handleClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <Image
        src={product.images[0] || getProductImagePath(product._id, 'main.webp')}
        alt={product.name}
        height={200}
        placeholder={getPlaceholderPath('product')}
        style={{
          borderBottom: '1px solid #eee',
        }}
      />
      <CardContent sx={{ flexGrow: 1 }}>
        <Typography gutterBottom variant="h6" component="h2" noWrap>
          {product.name}
        </Typography>
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{
            mb: 1,
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
          }}
        >
          {product.description}
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
          <Typography variant="h6" color="primary">
            ${product.price}
          </Typography>
          {product.oldPrice && (
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ textDecoration: 'line-through', ml: 1 }}
            >
              ${product.oldPrice}
            </Typography>
          )}
        </Box>
        {product.stock > 0 ? (
          <Chip
            label={t('inStock')}
            color="success"
            size="small"
            sx={{ mb: 1 }}
          />
        ) : (
          <Chip
            label={t('outOfStock')}
            color="error"
            size="small"
            sx={{ mb: 1 }}
          />
        )}
        <Button
          fullWidth
          variant="contained"
          color="primary"
          onClick={handleAddToCart}
          disabled={product.stock === 0}
        >
          {t('addToCart')}
        </Button>
      </CardContent>
    </Card>
  );
};

export default memo(ProductCard); 