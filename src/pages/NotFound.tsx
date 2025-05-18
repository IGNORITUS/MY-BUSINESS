import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Button,
  Paper,
  Container,
} from '@mui/material';
import { motion } from 'framer-motion';
import SearchOffIcon from '@mui/icons-material/SearchOff';

const NotFound: React.FC = () => {
  const navigate = useNavigate();

  return (
    <Container maxWidth="sm">
      <Box
        component={motion.div}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '100vh',
          py: 4,
        }}
      >
        <Paper
          elevation={3}
          sx={{
            p: 4,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            width: '100%',
            borderRadius: 2,
          }}
        >
          <Box
            sx={{
              width: 80,
              height: 80,
              borderRadius: '50%',
              bgcolor: 'warning.light',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              mb: 3,
            }}
          >
            <SearchOffIcon sx={{ fontSize: 40, color: 'white' }} />
          </Box>

          <Typography variant="h4" component="h1" gutterBottom color="warning.main">
            404 - Страница не найдена
          </Typography>

          <Typography variant="body1" color="text.secondary" align="center" paragraph>
            Извините, но страница, которую вы ищете, не существует или была перемещена.
            Пожалуйста, проверьте URL или вернитесь на главную страницу.
          </Typography>

          <Box sx={{ mt: 3, display: 'flex', gap: 2 }}>
            <Button
              variant="contained"
              color="primary"
              onClick={() => navigate(-1)}
            >
              Вернуться назад
            </Button>
            <Button
              variant="outlined"
              color="primary"
              onClick={() => navigate('/')}
            >
              На главную
            </Button>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
};

export default NotFound; 