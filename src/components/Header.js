import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FaShoppingCart, FaHeart, FaSearch, FaUser } from 'react-icons/fa';
import './Header.css';

const Header = () => {
  const location = useLocation();

  return (
    <header className="premium-header">
      <div className="header-container">
        <div className="header-left">
          <Link to="/" className="logo">
            <span className="logo-text">LuvBox</span>
            <span className="logo-highlight">Prime</span>
          </Link>
        </div>

        <nav className="header-nav">
          <Link to="/" className={location.pathname === '/' ? 'active' : ''}>
            Главная
          </Link>
          <Link to="/catalog" className={location.pathname === '/catalog' ? 'active' : ''}>
            Каталог
          </Link>
          <Link to="/about" className={location.pathname === '/about' ? 'active' : ''}>
            О нас
          </Link>
        </nav>

        <div className="header-right">
          <div className="search-box">
            <input type="text" placeholder="Поиск..." />
            <FaSearch className="search-icon" />
          </div>

          <div className="header-icons">
            <Link to="/profile" className="icon-link">
              <FaUser />
            </Link>
            <Link to="/cart" className="icon-link">
              <FaShoppingCart />
            </Link>
            <Link to="/favorites" className="icon-link">
              <FaHeart />
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header; 