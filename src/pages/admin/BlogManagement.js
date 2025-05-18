import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Container,
  Typography,
  Box,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  CircularProgress,
  Alert
} from '@mui/material';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Add as AddIcon,
  Visibility as VisibilityIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';
import { fetchPosts, createPost, updatePost, deletePost } from '../../store/slices/blogSlice';

const BlogManagement = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedPost, setSelectedPost] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    excerpt: '',
    image: '',
    category: '',
    tags: '',
    status: 'draft'
  });

  const { posts, loading, error } = useSelector((state) => state.blog);

  useEffect(() => {
    dispatch(fetchPosts({ admin: true }));
  }, [dispatch]);

  const handleOpenDialog = (post = null) => {
    if (post) {
      setSelectedPost(post);
      setFormData({
        title: post.title,
        content: post.content,
        excerpt: post.excerpt,
        image: post.image,
        category: post.category,
        tags: post.tags.join(', '),
        status: post.status
      });
    } else {
      setSelectedPost(null);
      setFormData({
        title: '',
        content: '',
        excerpt: '',
        image: '',
        category: '',
        tags: '',
        status: 'draft'
      });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedPost(null);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const postData = {
      ...formData,
      tags: formData.tags.split(',').map(tag => tag.trim()).filter(Boolean)
    };

    try {
      if (selectedPost) {
        dispatch(updatePost({ id: selectedPost._id, ...postData }));
      } else {
        dispatch(createPost(postData));
      }
      handleCloseDialog();
    } catch (error) {
      console.error('Error saving post:', error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Вы уверены, что хотите удалить этот пост?')) {
      dispatch(deletePost(id));
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h4" component="h1">
          Управление блогом
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => handleOpenDialog()}
        >
          Создать пост
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Заголовок</TableCell>
              <TableCell>Категория</TableCell>
              <TableCell>Статус</TableCell>
              <TableCell>Дата</TableCell>
              <TableCell>Просмотры</TableCell>
              <TableCell>Действия</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {posts.map((post) => (
              <TableRow key={post._id}>
                <TableCell>{post.title}</TableCell>
                <TableCell>{post.category}</TableCell>
                <TableCell>
                  <Chip
                    label={post.status === 'published' ? 'Опубликовано' : 'Черновик'}
                    color={post.status === 'published' ? 'success' : 'default'}
                    size="small"
                  />
                </TableCell>
                <TableCell>
                  {format(new Date(post.createdAt), 'd MMMM yyyy', { locale: ru })}
                </TableCell>
                <TableCell>{post.views}</TableCell>
                <TableCell>
                  <IconButton
                    size="small"
                    onClick={() => navigate(`/blog/${post.slug}`)}
                    title="Просмотреть"
                  >
                    <VisibilityIcon />
                  </IconButton>
                  <IconButton
                    size="small"
                    onClick={() => handleOpenDialog(post)}
                    title="Редактировать"
                  >
                    <EditIcon />
                  </IconButton>
                  <IconButton
                    size="small"
                    onClick={() => handleDelete(post._id)}
                    title="Удалить"
                  >
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Диалог создания/редактирования поста */}
      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          {selectedPost ? 'Редактировать пост' : 'Создать новый пост'}
        </DialogTitle>
        <DialogContent>
          <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
            <TextField
              fullWidth
              label="Заголовок"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              required
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              label="Краткое описание"
              name="excerpt"
              value={formData.excerpt}
              onChange={handleInputChange}
              required
              multiline
              rows={2}
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              label="Содержание"
              name="content"
              value={formData.content}
              onChange={handleInputChange}
              required
              multiline
              rows={6}
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              label="URL изображения"
              name="image"
              value={formData.image}
              onChange={handleInputChange}
              required
              sx={{ mb: 2 }}
            />
            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel>Категория</InputLabel>
              <Select
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                required
              >
                <MenuItem value="news">Новости</MenuItem>
                <MenuItem value="reviews">Обзоры</MenuItem>
                <MenuItem value="guides">Гайды</MenuItem>
              </Select>
            </FormControl>
            <TextField
              fullWidth
              label="Теги (через запятую)"
              name="tags"
              value={formData.tags}
              onChange={handleInputChange}
              sx={{ mb: 2 }}
            />
            <FormControl fullWidth>
              <InputLabel>Статус</InputLabel>
              <Select
                name="status"
                value={formData.status}
                onChange={handleInputChange}
                required
              >
                <MenuItem value="draft">Черновик</MenuItem>
                <MenuItem value="published">Опубликовать</MenuItem>
              </Select>
            </FormControl>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Отмена</Button>
          <Button
            onClick={handleSubmit}
            variant="contained"
            disabled={!formData.title || !formData.content}
          >
            {selectedPost ? 'Сохранить' : 'Создать'}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default BlogManagement; 