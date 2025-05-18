import React, { useState } from 'react';
import {
  BottomNavigation,
  BottomNavigationAction,
  Paper,
  Badge,
  useTheme,
  useMediaQuery
} from '@mui/material';
import {
  Home as HomeIcon,
  ShoppingCart as CartIcon,
  Favorite as FavoriteIcon,
  Person as PersonIcon,
  Menu as MenuIcon
} from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';

const MobileNavigation = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const navigate = useNavigate();
  const location = useLocation();
  const [value, setValue] = useState(location.pathname);

  const cartItems = useSelector((state) => state.cart.items);
  const favorites = useSelector((state) => state.favorites.items);

  if (!isMobile) return null;

  const handleChange = (event, newValue) => {
    setValue(newValue);
    navigate(newValue);
  };

  return (
    <Paper
      sx={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: theme.zIndex.appBar
      }}
      elevation={3}
    >
      <BottomNavigation value={value} onChange={handleChange}>
        <BottomNavigationAction
          label="Главная"
          value="/"
          icon={<HomeIcon />}
        />
        <BottomNavigationAction
          label="Каталог"
          value="/catalog"
          icon={<MenuIcon />}
        />
        <BottomNavigationAction
          label="Корзина"
          value="/cart"
          icon={
            <Badge badgeContent={cartItems.length} color="primary">
              <CartIcon />
            </Badge>
          }
        />
        <BottomNavigationAction
          label="Избранное"
          value="/favorites"
          icon={
            <Badge badgeContent={favorites.length} color="primary">
              <FavoriteIcon />
            </Badge>
          }
        />
        <BottomNavigationAction
          label="Профиль"
          value="/profile"
          icon={<PersonIcon />}
        />
      </BottomNavigation>
    </Paper>
  );
};

export default MobileNavigation; 