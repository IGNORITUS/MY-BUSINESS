import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Card,
  CardContent,
  Typography,
  Box,
} from '@mui/material';
import Image from './common/Image';
import { getCategoryImagePath, getPlaceholderPath } from '../utils/imageUtils';

const CategoryCard = ({ category }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/catalog?category=${category.id}`);
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
          transform: 'scale(1.02)',
        },
      }}
      onClick={handleClick}
    >
      <Image
        src={category.image || getCategoryImagePath(category.id)}
        alt={category.name}
        height={140}
        placeholder={getPlaceholderPath('category')}
        style={{
          borderBottom: '1px solid #eee',
        }}
      />
      <CardContent>
        <Typography gutterBottom variant="h6" component="div">
          {category.name}
        </Typography>
        {category.description && (
          <Typography variant="body2" color="text.secondary">
            {category.description.length > 100
              ? `${category.description.substring(0, 100)}...`
              : category.description}
          </Typography>
        )}
        {category.productCount > 0 && (
          <Box sx={{ mt: 1 }}>
            <Typography variant="body2" color="text.secondary">
              {category.productCount} товаров
            </Typography>
          </Box>
        )}
      </CardContent>
    </Card>
  );
};

export default CategoryCard; 