import React from 'react';
import { Box, Container, Grid, Typography, Button } from '@mui/material';
import { motion } from 'framer-motion';
import { Link, useLocation } from 'react-router-dom';
import { FaTruck, FaShieldAlt, FaGift, FaStar, FaHome, FaShoppingBag, FaHeart, FaUser, FaUserFriends } from 'react-icons/fa';
import './Home.css';

const Home = () => {
  const location = useLocation();

  const categories = [
    {
      id: 1,
      name: 'Подарочные боксы',
      description: 'Уникальные наборы для особых случаев',
      icon: <FaGift />,
      link: '/catalog/gift-boxes'
    },
    {
      id: 2,
      name: 'Для него',
      description: 'Специальные подарки для мужчин',
      icon: <FaHeart />,
      link: '/catalog/for-him'
    },
    {
      id: 3,
      name: 'Для неё',
      description: 'Изысканные подарки для женщин',
      icon: <FaStar />,
      link: '/catalog/for-her'
    }
  ];

  const bestsellers = [
    {
      id: 1,
      name: 'Премиум бокс "Романтика"',
      price: '5 999 ₽',
      image: 'https://via.placeholder.com/300x250'
    },
    {
      id: 2,
      name: 'Бокс "Мужской характер"',
      price: '4 999 ₽',
      image: 'https://via.placeholder.com/300x250'
    },
    {
      id: 3,
      name: 'Бокс "Женская нежность"',
      price: '6 999 ₽',
      image: 'https://via.placeholder.com/300x250'
    }
  ];

  const features = [
    {
      id: 1,
      title: 'Быстрая доставка',
      description: 'Доставляем по всей России в течение 1-3 дней',
      icon: <FaTruck />
    },
    {
      id: 2,
      title: 'Гарантия качества',
      description: 'Все товары проходят тщательную проверку',
      icon: <FaShieldAlt />
    },
    {
      id: 3,
      title: 'Индивидуальный подход',
      description: 'Создаем уникальные подарки под ваши пожелания',
      icon: <FaUserFriends />
    }
  ];

  return (
    <Box className="premium-home">
      {/* Hero Section */}
      <section className="hero-section">
        <Container maxWidth="lg">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="hero-content"
          >
            <Typography variant="h1" className="hero-title">
              <span className="title-line">Премиальные</span>
              <span className="title-highlight">подарочные боксы</span>
            </Typography>
            <Typography variant="h5" className="hero-subtitle">
              Создавайте особенные моменты с нашими тщательно подобранными наборами
            </Typography>
            <Box className="hero-cta">
              <Button
                component={Link}
                to="/catalog"
                variant="contained"
                className="cta-button primary"
              >
                Смотреть коллекцию
              </Button>
            </Box>
          </motion.div>
        </Container>
      </section>

      {/* Categories Section */}
      <section className="categories-section">
        <Container maxWidth="lg">
          <Typography variant="h2" className="section-title">
            Популярные категории
          </Typography>
          <Grid container spacing={4} className="categories-grid">
            {categories.map(category => (
              <Grid item xs={12} md={4} key={category.id}>
                <motion.div
                  whileHover={{ y: -10 }}
                  className="category-card"
                >
                  <div className="category-icon">{category.icon}</div>
                  <Typography variant="h5" className="category-title">
                    {category.name}
                  </Typography>
                  <Typography variant="body1" className="category-description">
                    {category.description}
                  </Typography>
                  <Button
                    component={Link}
                    to={category.link}
                    variant="contained"
                    className="category-button"
                  >
                    Подробнее
                  </Button>
                </motion.div>
              </Grid>
            ))}
          </Grid>
        </Container>
      </section>

      {/* Bestsellers Section */}
      <section className="bestsellers-section">
        <Container maxWidth="lg">
          <Typography variant="h2" className="section-title">
            Бестселлеры
          </Typography>
          <Grid container spacing={4} className="bestsellers-grid">
            {bestsellers.map(product => (
              <Grid item xs={12} md={3} key={product.id}>
                <motion.div
                  whileHover={{ y: -10 }}
                  className="product-card"
                >
                  <div 
                    className="product-image" 
                    style={{ backgroundImage: `url(${product.image})` }}
                  />
                  <Typography variant="h6" className="product-title">
                    {product.name}
                  </Typography>
                  <Typography variant="body1" className="product-price">
                    {product.price}
                  </Typography>
                  <Button
                    component={Link}
                    to={`/product/${product.id}`}
                    variant="contained"
                    className="product-button"
                  >
                    Подробнее
                  </Button>
                </motion.div>
              </Grid>
            ))}
          </Grid>
        </Container>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <Container maxWidth="lg">
          <Typography variant="h2" className="section-title">
            Преимущества
          </Typography>
          <Grid container spacing={4} className="features-grid">
            {features.map(feature => (
              <Grid item xs={12} md={4} key={feature.id}>
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  className="feature-card"
                >
                  <div className="feature-icon">{feature.icon}</div>
                  <Typography variant="h5" className="feature-title">
                    {feature.title}
                  </Typography>
                  <Typography variant="body1" className="feature-description">
                    {feature.description}
                  </Typography>
                </motion.div>
              </Grid>
            ))}
          </Grid>
        </Container>
      </section>

      {/* Mobile Navigation */}
      <nav className="mobile-nav">
        <div className="mobile-nav-items">
          <Link to="/" className={`mobile-nav-item ${location.pathname === '/' ? 'active' : ''}`}>
            <FaHome className="mobile-nav-icon" />
            <span>Главная</span>
          </Link>
          <Link to="/catalog" className={`mobile-nav-item ${location.pathname === '/catalog' ? 'active' : ''}`}>
            <FaShoppingBag className="mobile-nav-icon" />
            <span>Каталог</span>
          </Link>
          <Link to="/favorites" className={`mobile-nav-item ${location.pathname === '/favorites' ? 'active' : ''}`}>
            <FaHeart className="mobile-nav-icon" />
            <span>Избранное</span>
          </Link>
          <Link to="/profile" className={`mobile-nav-item ${location.pathname === '/profile' ? 'active' : ''}`}>
            <FaUser className="mobile-nav-icon" />
            <span>Профиль</span>
          </Link>
        </div>
      </nav>
    </Box>
  );
};

export default Home; 