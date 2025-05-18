import React, { useEffect, useState } from 'react';
import { Box, Container, Typography, Grid, Button, useTheme, useMediaQuery, Card, CardMedia, CardContent, Rating, Chip } from '@mui/material';
import { motion, useScroll, useTransform } from 'framer-motion';
import { styled } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import ProductSkeleton from '../components/ProductSkeleton';

const HeroSection = styled(Box)(({ theme }) => ({
  minHeight: '100vh',
  display: 'flex',
  alignItems: 'center',
  position: 'relative',
  overflow: 'hidden',
  background: `linear-gradient(135deg, ${theme.palette.background.default} 0%, ${theme.palette.grey[50]} 100%)`,
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'radial-gradient(circle at 50% 50%, rgba(196, 167, 125, 0.05) 0%, transparent 50%)',
    pointerEvents: 'none',
  },
}));

const FeatureCard = styled(motion.div)(({ theme }) => ({
  padding: theme.spacing(4),
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  textAlign: 'center',
  background: theme.palette.background.paper,
  border: `1px solid ${theme.palette.grey[100]}`,
  transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
  position: 'relative',
  overflow: 'hidden',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: `linear-gradient(45deg, ${theme.palette.primary.main}10, ${theme.palette.secondary.main}10)`,
    opacity: 0,
    transition: 'opacity 0.4s ease',
  },
  '&:hover': {
    transform: 'translateY(-12px)',
    boxShadow: theme.shadows[8],
    '&::before': {
      opacity: 1,
    },
  },
}));

const GradientButton = styled(Button)(({ theme }) => ({
  background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
  color: theme.palette.common.white,
  padding: '12px 32px',
  borderRadius: '4px',
  transition: 'all 0.3s ease',
  position: 'relative',
  overflow: 'hidden',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'linear-gradient(45deg, rgba(255,255,255,0.1), rgba(255,255,255,0))',
    opacity: 0,
    transition: 'opacity 0.3s ease',
  },
  '&:hover': {
    transform: 'translateY(-2px)',
    boxShadow: '0 8px 16px rgba(0,0,0,0.1)',
    '&::before': {
      opacity: 1,
    },
  },
}));

const ProductCard = styled(motion.div)(({ theme }) => ({
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  background: theme.palette.background.paper,
  borderRadius: theme.shape.borderRadius,
  overflow: 'hidden',
  transition: 'all 0.3s ease',
  '&:hover': {
    transform: 'translateY(-8px)',
    boxShadow: theme.shadows[8],
  },
}));

const CategoryCard = styled(motion.div)(({ theme }) => ({
  position: 'relative',
  height: 200,
  borderRadius: theme.shape.borderRadius,
  overflow: 'hidden',
  cursor: 'pointer',
  '&:hover': {
    '& .category-overlay': {
      opacity: 0.8,
    },
  },
}));

const CategoryOverlay = styled(Box)(({ theme }) => ({
  position: 'absolute',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  background: 'linear-gradient(to top, rgba(0,0,0,0.7), rgba(0,0,0,0.3))',
  display: 'flex',
  alignItems: 'flex-end',
  padding: theme.spacing(2),
  opacity: 0.6,
  transition: 'opacity 0.3s ease',
}));

const ReviewCard = styled(motion.div)(({ theme }) => ({
  padding: theme.spacing(3),
  background: theme.palette.background.paper,
  borderRadius: theme.shape.borderRadius,
  boxShadow: theme.shadows[1],
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  transition: 'all 0.3s ease',
  '&:hover': {
    transform: 'translateY(-8px)',
    boxShadow: theme.shadows[8],
  },
}));

const Avatar = styled(Box)(({ theme }) => ({
  width: 60,
  height: 60,
  borderRadius: '50%',
  overflow: 'hidden',
  marginBottom: theme.spacing(2),
  border: `2px solid ${theme.palette.primary.main}`,
}));

const Home: React.FC = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const { scrollYProgress } = useScroll();
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.5], [1, 0.8]);

  const [categories, setCategories] = useState([]);
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [bestOffers, setBestOffers] = useState([]);
  const [loading, setLoading] = useState(true);

  const features = [
    {
      title: 'Премиальное качество',
      description: 'Только лучшие материалы и безупречное исполнение',
      icon: '✨',
    },
    {
      title: 'Индивидуальный подход',
      description: 'Уникальные решения для каждого клиента',
      icon: '🎯',
    },
    {
      title: 'Современный дизайн',
      description: 'Актуальные тренды и инновационные решения',
      icon: '🎨',
    },
  ];

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [categoriesRes, productsRes, reviewsRes, offersRes] = await Promise.all([
          axios.get('http://localhost:5000/api/categories'),
          axios.get('http://localhost:5000/api/products/featured'),
          axios.get('http://localhost:5000/api/reviews/featured'),
          axios.get('http://localhost:5000/api/products/best-offers')
        ]);
        setCategories(categoriesRes.data);
        setFeaturedProducts(productsRes.data);
        setReviews(reviewsRes.data);
        setBestOffers(offersRes.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <Box>
      <HeroSection>
        <Container maxWidth="lg">
          <Grid container spacing={4} alignItems="center">
            <Grid item xs={12} md={6}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                style={{ opacity, scale }}
              >
                <Typography
                  variant={isMobile ? 'h2' : 'h1'}
                  component="h1"
                  gutterBottom
                  sx={{
                    fontWeight: 700,
                    background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                    backgroundClip: 'text',
                    WebkitBackgroundClip: 'text',
                    color: 'transparent',
                    letterSpacing: '-0.02em',
                    lineHeight: 1.2,
                  }}
                >
                  Премиальные решения для вашего бизнеса
                </Typography>
                <Typography
                  variant={isMobile ? 'h6' : 'h5'}
                  color="text.secondary"
                  paragraph
                  sx={{ 
                    mb: 4,
                    lineHeight: 1.6,
                    maxWidth: '90%',
                  }}
                >
                  Создаем уникальные цифровые продукты, которые помогают бизнесу расти и развиваться в современном мире
                </Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
                  <GradientButton
                    variant="contained"
                    size="large"
                    onClick={() => navigate('/catalog')}
                  >
                    Смотреть каталог
                  </GradientButton>
                  <Button
                    variant="outlined"
                    size="large"
                    onClick={() => navigate('/contact')}
                    sx={{
                      borderWidth: 2,
                      '&:hover': {
                        borderWidth: 2,
                        background: 'rgba(0,0,0,0.04)',
                      },
                    }}
                  >
                    Связаться с нами
                  </Button>
                </Box>
              </motion.div>
            </Grid>
            <Grid item xs={12} md={6}>
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                style={{ opacity, scale }}
              >
                <Box
                  component="img"
                  src="/hero-image.jpg"
                  alt="Premium Solutions"
                  sx={{
                    width: '100%',
                    height: 'auto',
                    borderRadius: 2,
                    boxShadow: theme.shadows[8],
                    transition: 'transform 0.3s ease',
                    '&:hover': {
                      transform: 'scale(1.02)',
                    },
                  }}
                />
              </motion.div>
            </Grid>
          </Grid>
        </Container>
      </HeroSection>

      <Box sx={{ py: 8, bgcolor: 'background.default' }}>
        <Container maxWidth="lg">
          <Typography
            variant="h3"
            component="h2"
            gutterBottom
            sx={{
              textAlign: 'center',
              mb: 6,
              fontWeight: 700,
              color: 'text.primary',
            }}
          >
            Категории
          </Typography>
          <Grid container spacing={3}>
            {categories.map((category) => (
              <Grid item xs={12} sm={6} md={3} key={category.id}>
                <CategoryCard
                  whileHover={{ scale: 1.02 }}
                  onClick={() => navigate(`/catalog?category=${category.slug}`)}
                >
                  <CardMedia
                    component="img"
                    height="200"
                    image={category.image}
                    alt={category.name}
                  />
                  <CategoryOverlay className="category-overlay">
                    <Typography
                      variant="h6"
                      sx={{
                        color: 'white',
                        fontWeight: 600,
                      }}
                    >
                      {category.name}
                    </Typography>
                  </CategoryOverlay>
                </CategoryCard>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      <Box sx={{ py: 8, bgcolor: 'background.paper' }}>
        <Container maxWidth="lg">
          <Typography
            variant="h3"
            component="h2"
            gutterBottom
            sx={{
              textAlign: 'center',
              mb: 6,
              fontWeight: 700,
              color: 'text.primary',
            }}
          >
            Популярные товары
          </Typography>
          <Grid container spacing={4}>
            {loading
              ? Array.from(new Array(8)).map((_, index) => (
                  <Grid item xs={12} sm={6} md={3} key={index}>
                    <ProductSkeleton />
                  </Grid>
                ))
              : featuredProducts.map((product) => (
                  <Grid item xs={12} sm={6} md={3} key={product.id}>
                    <ProductCard
                      whileHover={{ y: -8 }}
                      onClick={() => navigate(`/product/${product.id}`)}
                    >
                      <CardMedia
                        component="img"
                        height="200"
                        image={product.images[0]}
                        alt={product.name}
                        sx={{ objectFit: 'contain', p: 2 }}
                      />
                      <CardContent>
                        <Typography
                          variant="h6"
                          component="h3"
                          gutterBottom
                          sx={{
                            fontWeight: 600,
                            fontSize: '1rem',
                            lineHeight: 1.4,
                          }}
                        >
                          {product.name}
                        </Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                          <Rating value={product.rating} precision={0.5} size="small" readOnly />
                          <Typography variant="body2" color="text.secondary" sx={{ ml: 1 }}>
                            ({product.reviewsCount})
                          </Typography>
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                          <Typography
                            variant="h6"
                            sx={{
                              color: 'primary.main',
                              fontWeight: 700,
                            }}
                          >
                            {product.price.toLocaleString()} ₽
                          </Typography>
                          {product.discount > 0 && (
                            <Chip
                              label={`-${product.discount}%`}
                              color="error"
                              size="small"
                              sx={{ fontWeight: 600 }}
                            />
                          )}
                        </Box>
                      </CardContent>
                    </ProductCard>
                  </Grid>
                ))}
          </Grid>
        </Container>
      </Box>

      <Box sx={{ py: 8, bgcolor: 'background.paper' }}>
        <Container maxWidth="lg">
          <Typography
            variant="h3"
            component="h2"
            gutterBottom
            sx={{
              textAlign: 'center',
              mb: 6,
              fontWeight: 700,
              color: 'text.primary',
            }}
          >
            Лучшие предложения
          </Typography>
          <Grid container spacing={4}>
            {loading
              ? Array.from(new Array(4)).map((_, index) => (
                  <Grid item xs={12} sm={6} md={3} key={index}>
                    <ProductSkeleton />
                  </Grid>
                ))
              : bestOffers.map((product) => (
                  <Grid item xs={12} sm={6} md={3} key={product.id}>
                    <ProductCard
                      whileHover={{ y: -8 }}
                      onClick={() => navigate(`/product/${product.id}`)}
                    >
                      <Box sx={{ position: 'relative' }}>
                        <CardMedia
                          component="img"
                          height="200"
                          image={product.images[0]}
                          alt={product.name}
                          sx={{ objectFit: 'contain', p: 2 }}
                        />
                        {product.discount > 0 && (
                          <Chip
                            label={`-${product.discount}%`}
                            color="error"
                            size="small"
                            sx={{
                              position: 'absolute',
                              top: 16,
                              right: 16,
                              fontWeight: 600,
                            }}
                          />
                        )}
                      </Box>
                      <CardContent>
                        <Typography
                          variant="h6"
                          component="h3"
                          gutterBottom
                          sx={{
                            fontWeight: 600,
                            fontSize: '1rem',
                            lineHeight: 1.4,
                          }}
                        >
                          {product.name}
                        </Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                          <Rating value={product.rating} precision={0.5} size="small" readOnly />
                          <Typography variant="body2" color="text.secondary" sx={{ ml: 1 }}>
                            ({product.reviewsCount})
                          </Typography>
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                          <Box>
                            <Typography
                              variant="h6"
                              sx={{
                                color: 'primary.main',
                                fontWeight: 700,
                              }}
                            >
                              {product.price.toLocaleString()} ₽
                            </Typography>
                            {product.discount > 0 && (
                              <Typography
                                variant="body2"
                                sx={{
                                  color: 'text.secondary',
                                  textDecoration: 'line-through',
                                }}
                              >
                                {Math.round(product.price * (1 + product.discount / 100)).toLocaleString()} ₽
                              </Typography>
                            )}
                          </Box>
                        </Box>
                      </CardContent>
                    </ProductCard>
                  </Grid>
                ))}
          </Grid>
        </Container>
      </Box>

      <Box sx={{ py: 8, bgcolor: 'background.paper' }}>
        <Container maxWidth="lg">
          <Typography
            variant="h3"
            component="h2"
            gutterBottom
            sx={{
              textAlign: 'center',
              mb: 6,
              fontWeight: 700,
              color: 'text.primary',
            }}
          >
            Отзывы наших клиентов
          </Typography>
          <Grid container spacing={4}>
            {reviews.map((review, index) => (
              <Grid item xs={12} md={4} key={review.id}>
                <ReviewCard
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Avatar>
                      <img
                        src={review.user.avatar || '/default-avatar.png'}
                        alt={review.user.name}
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      />
                    </Avatar>
                    <Box sx={{ ml: 2 }}>
                      <Typography variant="h6" sx={{ fontWeight: 600 }}>
                        {review.user.name}
                      </Typography>
                      <Rating value={review.rating} readOnly size="small" />
                    </Box>
                  </Box>
                  <Typography
                    variant="body1"
                    color="text.secondary"
                    sx={{ mb: 2, flexGrow: 1 }}
                  >
                    {review.text}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {new Date(review.createdAt).toLocaleDateString('ru-RU', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </Typography>
                </ReviewCard>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      <Box sx={{ py: 8, bgcolor: 'background.default' }}>
        <Container maxWidth="lg">
          <Typography
            variant="h3"
            component="h2"
            gutterBottom
            sx={{
              textAlign: 'center',
              mb: 6,
              fontWeight: 700,
              color: 'text.primary',
            }}
          >
            Почему выбирают нас
          </Typography>
          <Grid container spacing={4}>
            {features.map((feature, index) => (
              <Grid item xs={12} md={4} key={index}>
                <FeatureCard
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <Typography variant="h1" sx={{ mb: 2, fontSize: '3rem' }}>
                    {feature.icon}
                  </Typography>
                  <Typography variant="h5" component="h3" gutterBottom sx={{ fontWeight: 600 }}>
                    {feature.title}
                  </Typography>
                  <Typography variant="body1" color="text.secondary">
                    {feature.description}
                  </Typography>
                </FeatureCard>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>
    </Box>
  );
};

export default Home; 