import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  Container,
  Typography,
  Box,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Chip,
  Divider,
  Avatar,
  TextField,
  Button,
  CircularProgress,
  Alert
} from '@mui/material';
import {
  CalendarToday as CalendarIcon,
  Person as PersonIcon,
  Share as ShareIcon,
  Favorite as FavoriteIcon,
  FavoriteBorder as FavoriteBorderIcon
} from '@mui/icons-material';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';

const BlogPost = () => {
  const { slug } = useParams();
  const dispatch = useDispatch();
  const [comment, setComment] = useState('');
  const { post, loading, error } = useSelector((state) => state.blog);
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    // Здесь будет вызов action для загрузки статьи
    // dispatch(fetchPost(slug));
  }, [dispatch, slug]);

  const handleCommentSubmit = (e) => {
    e.preventDefault();
    // Здесь будет логика отправки комментария
    setComment('');
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: post.title,
        text: post.excerpt,
        url: window.location.href
      });
    }
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
        <Alert severity="error">{error}</Alert>
      </Container>
    );
  }

  if (!post) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Alert severity="info">Статья не найдена</Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Article Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          {post.title}
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
          <Chip
            label={post.category}
            color="primary"
            size="small"
          />
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <CalendarIcon sx={{ mr: 1, fontSize: 16 }} />
            <Typography variant="body2" color="text.secondary">
              {format(new Date(post.date), 'd MMMM yyyy', { locale: ru })}
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <PersonIcon sx={{ mr: 1, fontSize: 16 }} />
            <Typography variant="body2" color="text.secondary">
              {post.author}
            </Typography>
          </Box>
        </Box>
      </Box>

      {/* Featured Image */}
      <Card sx={{ mb: 4 }}>
        <CardMedia
          component="img"
          height="400"
          image={post.image}
          alt={post.title}
          sx={{ objectFit: 'cover' }}
        />
      </Card>

      {/* Article Content */}
      <Grid container spacing={4}>
        <Grid item xs={12} md={8}>
          <Typography variant="body1" paragraph>
            {post.content}
          </Typography>

          {/* Tags */}
          <Box sx={{ my: 4 }}>
            {post.tags.map((tag) => (
              <Chip
                key={tag}
                label={tag}
                size="small"
                sx={{ mr: 1, mb: 1 }}
              />
            ))}
          </Box>

          {/* Share and Like */}
          <Box sx={{ display: 'flex', gap: 2, mb: 4 }}>
            <Button
              startIcon={<ShareIcon />}
              onClick={handleShare}
            >
              Поделиться
            </Button>
            <Button
              startIcon={post.isLiked ? <FavoriteIcon /> : <FavoriteBorderIcon />}
              color={post.isLiked ? 'error' : 'default'}
            >
              {post.likes} Нравится
            </Button>
          </Box>

          {/* Comments Section */}
          <Box sx={{ mt: 6 }}>
            <Typography variant="h6" gutterBottom>
              Комментарии ({post.comments.length})
            </Typography>
            <Divider sx={{ mb: 3 }} />

            {/* Comment Form */}
            {user && (
              <Box component="form" onSubmit={handleCommentSubmit} sx={{ mb: 4 }}>
                <TextField
                  fullWidth
                  multiline
                  rows={3}
                  placeholder="Написать комментарий..."
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  sx={{ mb: 2 }}
                />
                <Button
                  type="submit"
                  variant="contained"
                  disabled={!comment.trim()}
                >
                  Отправить
                </Button>
              </Box>
            )}

            {/* Comments List */}
            {post.comments.map((comment) => (
              <Box key={comment._id} sx={{ mb: 3 }}>
                <Box sx={{ display: 'flex', gap: 2, mb: 1 }}>
                  <Avatar src={comment.user.avatar} />
                  <Box>
                    <Typography variant="subtitle2">
                      {comment.user.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {format(new Date(comment.date), 'd MMMM yyyy', { locale: ru })}
                    </Typography>
                  </Box>
                </Box>
                <Typography variant="body1" sx={{ ml: 7 }}>
                  {comment.text}
                </Typography>
                <Divider sx={{ mt: 2 }} />
              </Box>
            ))}
          </Box>
        </Grid>

        {/* Sidebar */}
        <Grid item xs={12} md={4}>
          {/* Author Info */}
          <Card sx={{ mb: 4 }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Avatar
                  src={post.author.avatar}
                  sx={{ width: 64, height: 64, mr: 2 }}
                />
                <Box>
                  <Typography variant="h6">
                    {post.author.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {post.author.bio}
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>

          {/* Related Posts */}
          <Typography variant="h6" gutterBottom>
            Похожие статьи
          </Typography>
          {post.relatedPosts.map((relatedPost) => (
            <Card key={relatedPost._id} sx={{ mb: 2 }}>
              <CardContent>
                <Typography variant="subtitle1" gutterBottom>
                  {relatedPost.title}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {format(new Date(relatedPost.date), 'd MMMM yyyy', { locale: ru })}
                </Typography>
              </CardContent>
            </Card>
          ))}
        </Grid>
      </Grid>
    </Container>
  );
};

export default BlogPost; 