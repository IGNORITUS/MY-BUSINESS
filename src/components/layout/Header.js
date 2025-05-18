import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTheme, useMediaQuery } from '@mui/material';
import {
  AppBar,
  Toolbar,
  Container,
  Box,
  Button,
  IconButton,
  Badge,
  Menu,
  MenuItem,
  Drawer,
  List,
  ListItem,
  ListItemText,
  Divider,
  Typography,
  Avatar,
  Tooltip,
} from '@mui/material';
import {
  Menu as MenuIcon,
  Search as SearchIcon,
  ShoppingCart as CartIcon,
  Favorite as FavoriteIcon,
  Person as PersonIcon,
  Close as CloseIcon,
} from '@mui/icons-material';
import { useSelector, useDispatch } from 'react-redux';
import SearchBar from '../common/SearchBar';
import './Header.css';

const Header = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const location = useLocation();
  const cartItems = useSelector((state) => state.cart.items);
  const { user } = useSelector((state) => state.auth);
  const favorites = useSelector((state) => state.favorites.items);
  const dispatch = useDispatch();

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleSearchToggle = () => {
    setSearchOpen(!searchOpen);
  };

  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleProfileMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    dispatch({ type: 'auth/logout' });
    handleProfileMenuClose();
  };

  const menuItems = [
    { text: 'Главная', path: '/' },
    { text: 'Каталог', path: '/catalog' },
    { text: 'О нас', path: '/about' },
    { text: 'Контакты', path: '/contacts' },
  ];

  const drawer = (
    <Box sx={{ width: 280 }}>
      <Box sx={{ p: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Typography variant="h6" component={Link} to="/" sx={{ textDecoration: 'none', color: 'inherit' }}>
          LUXURY
        </Typography>
        <IconButton onClick={handleDrawerToggle}>
          <CloseIcon />
        </IconButton>
      </Box>
      <Divider />
      <List>
        {menuItems.map((item) => (
          <ListItem
            key={item.text}
            component={Link}
            to={item.path}
            onClick={handleDrawerToggle}
            sx={{
              color: location.pathname === item.path ? 'primary.main' : 'text.primary',
              '&:hover': {
                backgroundColor: 'rgba(0, 0, 0, 0.04)',
              },
            }}
          >
            <ListItemText primary={item.text} />
          </ListItem>
        ))}
      </List>
      <Divider />
    </Box>
  );

  return (
    <AppBar position="sticky" color="default" elevation={0} className="header">
      <Container maxWidth="xl">
        <Toolbar disableGutters sx={{ minHeight: { xs: 64, md: 80 } }}>
          {isMobile ? (
            <IconButton
              color="inherit"
              aria-label="open drawer"
              edge="start"
              onClick={handleDrawerToggle}
              sx={{ mr: 2 }}
            >
              <MenuIcon />
            </IconButton>
          ) : (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 4 }}>
              {menuItems.map((item) => (
                <Button
                  key={item.text}
                  component={Link}
                  to={item.path}
                  sx={{
                    color: location.pathname === item.path ? 'primary.main' : 'text.primary',
                    position: 'relative',
                    '&::after': {
                      content: '""',
                      position: 'absolute',
                      bottom: 0,
                      left: 0,
                      width: location.pathname === item.path ? '100%' : '0%',
                      height: '2px',
                      backgroundColor: 'primary.main',
                      transition: 'width 0.3s ease-in-out',
                    },
                    '&:hover::after': {
                      width: '100%',
                    },
                  }}
                >
                  {item.text}
                </Button>
              ))}
            </Box>
          )}

          <Box sx={{ flexGrow: 1 }} />

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <IconButton
              color="inherit"
              onClick={handleSearchToggle}
              className="header-icon-button"
            >
              <SearchIcon />
            </IconButton>

            <Tooltip title="Избранное">
              <IconButton
                component={Link}
                to="/favorites"
                color="inherit"
                className="header-icon-button"
              >
                <Badge badgeContent={favorites.length} color="secondary">
                  <FavoriteIcon />
                </Badge>
              </IconButton>
            </Tooltip>

            <Tooltip title="Корзина">
              <IconButton
                component={Link}
                to="/cart"
                color="inherit"
                className="header-icon-button"
              >
                <Badge badgeContent={cartItems.length} color="secondary">
                  <CartIcon />
                </Badge>
              </IconButton>
            </Tooltip>

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              {user ? (
                <>
                  <Tooltip title="Профиль">
                    <IconButton
                      onClick={handleProfileMenuOpen}
                      color="inherit"
                      className="header-icon-button"
                    >
                      <Avatar
                        src={user.avatar}
                        alt={user.name}
                        sx={{ width: 32, height: 32 }}
                      />
                    </IconButton>
                  </Tooltip>
                  <Menu
                    anchorEl={anchorEl}
                    open={Boolean(anchorEl)}
                    onClose={handleProfileMenuClose}
                    PaperProps={{
                      elevation: 0,
                      sx: {
                        mt: 1.5,
                        minWidth: 200,
                        borderRadius: 1,
                        border: '1px solid',
                        borderColor: 'divider',
                      },
                    }}
                  >
                    <MenuItem component={Link} to="/profile" onClick={handleProfileMenuClose}>
                      Профиль
                    </MenuItem>
                    <MenuItem component={Link} to="/orders" onClick={handleProfileMenuClose}>
                      Заказы
                    </MenuItem>
                    <Divider />
                    <MenuItem onClick={handleLogout}>Выйти</MenuItem>
                  </Menu>
                </>
              ) : (
                <Button
                  component={Link}
                  to="/login"
                  variant="outlined"
                  startIcon={<PersonIcon />}
                  className="header-login-button"
                >
                  Войти
                </Button>
              )}
            </Box>
          </Box>
        </Toolbar>
      </Container>

      <Drawer
        variant="temporary"
        anchor="left"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{
          keepMounted: true,
        }}
        sx={{
          display: { xs: 'block', md: 'none' },
          '& .MuiDrawer-paper': { boxSizing: 'border-box', width: 280 },
        }}
      >
        {drawer}
      </Drawer>

      <Box
        className={`search-overlay ${searchOpen ? 'active' : ''}`}
        onClick={handleSearchToggle}
      >
        <Box
          className="search-container"
          onClick={(e) => e.stopPropagation()}
        >
          <SearchBar onClose={handleSearchToggle} />
        </Box>
      </Box>
    </AppBar>
  );
};

export default Header; 