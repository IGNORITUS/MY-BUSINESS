import React from 'react';
import { Container, Typography, Grid, Paper, Button } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';

const sections = [
  { label: 'Товары', path: '/admin/products' },
  { label: 'Категории', path: '/admin/categories' },
  { label: 'Заказы', path: '/admin/orders' },
  { label: 'Пользователи', path: '/admin/users' },
];

const AdminDashboard = () => {
  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        Админ-панель
      </Typography>
      <Grid container spacing={4}>
        {sections.map((section) => (
          <Grid item xs={12} sm={6} md={3} key={section.path}>
            <Paper sx={{ p: 3, textAlign: 'center' }}>
              <Typography variant="h6" gutterBottom>
                {section.label}
              </Typography>
              <Button
                variant="contained"
                color="primary"
                component={RouterLink}
                to={section.path}
                fullWidth
              >
                Перейти
              </Button>
            </Paper>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default AdminDashboard; 