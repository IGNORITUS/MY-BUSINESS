import React from 'react';
import { Box, Typography, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const Error = ({ message = 'Произошла ошибка', showBackButton = true }) => {
  const navigate = useNavigate();

  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      minHeight="400px"
      p={3}
    >
      <Typography variant="h5" color="error" gutterBottom>
        Ошибка
      </Typography>
      <Typography variant="body1" color="text.secondary" gutterBottom>
        {message}
      </Typography>
      {showBackButton && (
        <Button
          variant="contained"
          color="primary"
          onClick={() => navigate(-1)}
          sx={{ mt: 2 }}
        >
          Вернуться назад
        </Button>
      )}
    </Box>
  );
};

export default Error; 