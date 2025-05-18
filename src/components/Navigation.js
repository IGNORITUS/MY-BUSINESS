import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { AppBar, Toolbar, Button, Typography, Container } from '@mui/material';
import './Navigation.css';

const Navigation = () => {
  return (
    <AppBar position="static" className="navigation">
      <Container>
        <Toolbar>
          <Typography variant="h6" component={RouterLink} to="/" className="logo">
            LuvBoxPrime
          </Typography>
          <div className="nav-links">
            <Button color="inherit" component={RouterLink} to="/">
              Главная
            </Button>
            <Button color="inherit" component={RouterLink} to="/catalog">
              Каталог
            </Button>
            <Button color="inherit" component={RouterLink} to="/favorites">
              Избранное
            </Button>
            <Button color="inherit" component={RouterLink} to="/cart">
              Корзина
            </Button>
            <Button color="inherit" component={RouterLink} to="/about">
              О нас
            </Button>
            <Button color="inherit" component={RouterLink} to="/contact">
              Контакты
            </Button>
          </div>
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default Navigation; 