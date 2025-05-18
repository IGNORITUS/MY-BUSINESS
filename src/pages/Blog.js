import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link as RouterLink } from 'react-router-dom';
import {
  Container,
  Typography,
  Box,
  Grid,
  Card,
  CardContent,
  CardMedia,
  CardActionArea,
  Chip,
  TextField,
  InputAdornment,
  Pagination,
  CircularProgress,
  FormControl,
  InputLabel,
  Select,
  MenuItem
} from '@mui/material';
import {
  Search as SearchIcon,
  CalendarToday as CalendarIcon,
  Person as PersonIcon
} from '@mui/icons-material';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';

const Blog = () => {
  const dispatch = useDispatch();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [page, setPage] = useState(1);
  const { posts, loading, error, totalPages } = useSelector((state) => state.blog);

  useEffect(() => {
    // Здесь будет вызов action для загрузки постов
    // dispatch(fetchPosts({ page, search: searchQuery, category: selectedCategory }));
  }, [dispatch, page, searchQuery, selectedCategory]);

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
    setPage(1);
  };

  const handleCategoryChange = (event) => {
    setSelectedCategory(event.target.value);
    setPage(1);
  };

  const handlePageChange = (event, value) => {
    setPage(value);
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Typography color="error">{error}</Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Блог
      </Typography>

      {/* Search and Filters */}
      <Box sx={{ mb: 4 }}>
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              placeholder="Поиск статей..."
              value={searchQuery}
              onChange={handleSearchChange}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <FormControl fullWidth>
              <InputLabel>Категория</InputLabel>
              <Select
                value={selectedCategory}
                label="Категория"
                onChange={handleCategoryChange}
              >
                <MenuItem value="">Все категории</MenuItem>
                <MenuItem value="news">Новости</MenuItem>
                <MenuItem value="reviews">Обзоры</MenuItem>
                <MenuItem value="guides">Гайды</MenuItem>
              </Select>
            </FormControl>
          </Grid>
        </Grid>
      </Box>

      {/* Blog Posts Grid */}
      <Grid container spacing={4}>
        {posts.map((post) => (
          <Grid item xs={12} md={6} lg={4} key={post._id}>
            <Card
              sx={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                transition: 'transform 0.2s',
                '&:hover': {
                  transform: 'translateY(-4px)',
                },
              }}
            >
              <CardActionArea
                component={RouterLink}
                to={`/blog/${post.slug}`}
                sx={{ height: '100%' }}
              >
                <CardMedia
                  component="img"
                  height="200"
                  image={post.image}
                  alt={post.title}
                  sx={{ objectFit: 'cover' }}
                />
                <CardContent sx={{ flexGrow: 1 }}>
                  <Box sx={{ mb: 2 }}>
                    <Chip
                      label={post.category}
                      size="small"
                      color="primary"
                      sx={{ mr: 1 }}
                    />
                    <Chip
                      icon={<CalendarIcon />}
                      label={format(new Date(post.date), 'd MMMM yyyy', { locale: ru })}
                      size="small"
                      variant="outlined"
                    />
                  </Box>
                  <Typography variant="h6" gutterBottom>
                    {post.title}
                  </Typography>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      display: '-webkit-box',
                      WebkitLineClamp: 3,
                      WebkitBoxOrient: 'vertical',
                    }}
                  >
                    {post.excerpt}
                  </Typography>
                  <Box sx={{ mt: 2, display: 'flex', alignItems: 'center' }}>
                    <PersonIcon sx={{ mr: 1, fontSize: 16 }} />
                    <Typography variant="body2" color="text.secondary">
                      {post.author}
                    </Typography>
                  </Box>
                </CardContent>
              </CardActionArea>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Pagination */}
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <Pagination
          count={totalPages}
          page={page}
          onChange={handlePageChange}
          color="primary"
        />
      </Box>
    </Container>
  );
};

export default Blog; 