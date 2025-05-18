import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Box, IconButton, Badge, Tooltip } from '@mui/material';
import { FavoriteBorder, ShoppingCart, RateReview } from '@mui/icons-material';
import './Navbar.css';
import Notifications from './Notifications';
import { useSelector } from 'react-redux';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isAuthModalOpen, setAuthModalOpen] = useState(false);
  const [isReviewModalOpen, setReviewModalOpen] = useState(false);
  // TODO: Подключить реальную аутентификацию
  const isAuthenticated = useSelector(state => state.auth?.isAuthenticated);
  const cartItems = useSelector(state => state.cart.items);
  const favoritesItems = useSelector(state => state.favorites.items);

  const toggleMenu = () => setIsOpen(!isOpen);

  return (
    <nav className="navbar premium-navbar">
      <div className="container navbar-container">
        <Link to="/" className="navbar-logo" aria-label="LuvBoxPrime">
          <span className="logo-text">LuvBoxPrime</span>
        </Link>
        <div className={`navbar-menu ${isOpen ? 'active' : ''}`}>
          <Link to="/" className="navbar-link" onClick={() => setIsOpen(false)}>
            Главная
          </Link>
          <Link to="/catalog" className="navbar-link" onClick={() => setIsOpen(false)}>
            Каталог
          </Link>
          <Link to="/favorites" className="navbar-link favorites-link" aria-label="Избранное">
            <Badge badgeContent={favoritesItems.length} color="secondary" invisible={favoritesItems.length === 0}>
              <FavoriteBorder fontSize="medium" />
            </Badge>
            <span className="nav-label">Избранное</span>
          </Link>
          <Link to="/cart" className="navbar-link cart-link" aria-label="Корзина">
            <Badge badgeContent={cartItems.length} color="primary" invisible={cartItems.length === 0}>
              <ShoppingCart fontSize="medium" />
            </Badge>
            <span className="nav-label">Корзина</span>
          </Link>
          <Link to="/about" className="navbar-link" onClick={() => setIsOpen(false)}>
            О нас
          </Link>
          <Link to="/contact" className="navbar-link" onClick={() => setIsOpen(false)}>
            Контакты
          </Link>
          {isAuthenticated && (
            <Tooltip title="Оставить отзыв" arrow>
              <button
                className="navbar-review-btn"
                onClick={() => setReviewModalOpen(true)}
                aria-label="Оставить отзыв"
              >
                <RateReview fontSize="medium" />
                <span className="nav-label">Оставить отзыв</span>
              </button>
            </Tooltip>
          )}
          <button
            className="navbar-auth-btn"
            onClick={() => setAuthModalOpen(true)}
            aria-label="Вход"
          >
            Вход
          </button>
        </div>
        <button className="navbar-toggle" onClick={toggleMenu} aria-label="Открыть меню">
          <span className={`navbar-toggle-icon ${isOpen ? 'active' : ''}`}></span>
        </button>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          {isAuthenticated && <Notifications />}
        </Box>
      </div>
      {/* Модалки (заглушки) */}
      {isAuthModalOpen && (
        <div className="modal-backdrop" onClick={() => setAuthModalOpen(false)}>
          <div className="modal premium-modal" onClick={e => e.stopPropagation()}>
            <h2>Вход / Регистрация</h2>
            {/* Здесь будет форма входа/регистрации */}
            <button className="close-modal" onClick={() => setAuthModalOpen(false)} aria-label="Закрыть">×</button>
          </div>
        </div>
      )}
      {isReviewModalOpen && (
        <div className="modal-backdrop" onClick={() => setReviewModalOpen(false)}>
          <div className="modal premium-modal" onClick={e => e.stopPropagation()}>
            <h2>Оставить отзыв</h2>
            {/* Здесь будет форма отзыва */}
            <button className="close-modal" onClick={() => setReviewModalOpen(false)} aria-label="Закрыть">×</button>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar; 