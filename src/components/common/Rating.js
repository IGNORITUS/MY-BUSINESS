import React from 'react';
import { Rating as MuiRating } from '@mui/material';
import { Star, StarBorder } from '@mui/icons-material';

const Rating = ({ value, onChange, readOnly = false, size = 'medium' }) => {
  return (
    <MuiRating
      value={value}
      onChange={(event, newValue) => {
        if (onChange) {
          onChange(newValue);
        }
      }}
      readOnly={readOnly}
      precision={0.5}
      size={size}
      icon={<Star fontSize="inherit" />}
      emptyIcon={<StarBorder fontSize="inherit" />}
    />
  );
};

export default Rating; 