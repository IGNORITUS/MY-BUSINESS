import React from 'react';
import { Pagination as MuiPagination } from '@mui/material';

const Pagination = ({ count, page, onChange, ...props }) => {
  if (count <= 1) return null;

  return (
    <MuiPagination
      count={count}
      page={page}
      onChange={onChange}
      color="primary"
      showFirstButton
      showLastButton
      {...props}
    />
  );
};

export default Pagination; 