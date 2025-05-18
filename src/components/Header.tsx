import React, { useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Badge,
  Box,
  Container,
  Menu,
  MenuItem,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import FavoriteIcon from '@mui/icons-material/Favorite';
import PersonIcon from '@mui/icons-material/Person';
import MenuIcon from '@mui/icons-material/Menu';
import SearchIcon from '@mui/icons-material/Search';
import axios from 'axios';

const StyledAppBar = styled(AppBar)(({ theme }) => ({
  background: 'rgba(255, 255, 255, 0.9)',
  backdropFilter: 'blur(10px)',
  boxShadow: 'none',
  borderBottom: `1px solid ${theme.palette.divider}`,
}));

const Logo = styled(Typography)(({ theme }) => ({
  color: theme.palette.primary.main,
  fontWeight: 700,
  textDecoration: 'none',
  fontSize: '1.5rem',
}));

const NavButton = styled(Button)(({ theme }) => ({
  color: theme.palette.text.primary,
  '&:hover': {
    backgroundColor: 'rgba(0, 0, 0, 0.04)',
  },
}));

const Header: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [cartCount, setCartCount] = useState(0);
  const [favoritesCount, setFavoritesCount] = useState(0);

  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const fetchCartCount = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/cart/count');
      setCartCount(response.data.count);
    } catch (error) {
      console.error('Error fetching cart count:', error);
    }
  };

  const fetchFavoritesCount = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/favorites/count');
      setFavoritesCount(response.data.count);
    } catch (error) {
      console.error('Error fetching favorites count:', error);
    }
  };

  React.useEffect(() => {
    fetchCartCount();
    fetchFavoritesCount();
  }, []);

  return (
    <StyledAppBar position="sticky">
      <Container maxWidth="lg">
        <Toolbar disableGutters>
          <Logo
            component={RouterLink}
            to="/"
            sx={{ flexGrow: 1, textDecoration: 'none' }}
          >
            STORE
          </Logo>

          {isMobile ? (
            <>
              <IconButton
                edge="start"
                color="inherit"
                aria-label="menu"
                onClick={handleMenu}
              >
                <MenuIcon />
              </IconButton>
              <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleClose}
              >
                <MenuItem
                  component={RouterLink}
                  to="/catalog"
                  onClick={handleClose}
                >
                  Каталог
                </MenuItem>
                <MenuItem
                  component={RouterLink}
                  to="/cart"
                  onClick={handleClose}
                >
                  Корзина
                </MenuItem>
                <MenuItem
                  component={RouterLink}
                  to="/favorites"
                  onClick={handleClose}
                >
                  Избранное
                </MenuItem>
                <MenuItem
                  component={RouterLink}
                  to="/profile"
                  onClick={handleClose}
                >
                  Профиль
                </MenuItem>
              </Menu>
            </>
          ) : (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <NavButton component={RouterLink} to="/catalog">
                Каталог
              </NavButton>
              <IconButton
                component={RouterLink}
                to="/cart"
                color="inherit"
                aria-label="cart"
              >
                <Badge badgeContent={cartCount} color="primary">
                  <ShoppingCartIcon />
                </Badge>
              </IconButton>
              <IconButton
                component={RouterLink}
                to="/favorites"
                color="inherit"
                aria-label="favorites"
              >
                <Badge badgeContent={favoritesCount} color="primary">
                  <FavoriteIcon />
                </Badge>
              </IconButton>
              <IconButton
                component={RouterLink}
                to="/profile"
                color="inherit"
                aria-label="profile"
              >
                <PersonIcon />
              </IconButton>
            </Box>
          )}
        </Toolbar>
      </Container>
    </StyledAppBar>
  );
};

export default Header; 