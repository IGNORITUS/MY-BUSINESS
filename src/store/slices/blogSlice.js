import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Async thunks
export const fetchPosts = createAsyncThunk(
  'blog/fetchPosts',
  async ({ page = 1, search = '', category = '', admin = false }) => {
    const response = await axios.get('/api/blog', {
      params: { page, search, category, admin }
    });
    return response.data;
  }
);

export const fetchPost = createAsyncThunk(
  'blog/fetchPost',
  async (slug) => {
    const response = await axios.get(`/api/blog/${slug}`);
    return response.data;
  }
);

export const createPost = createAsyncThunk(
  'blog/createPost',
  async (postData) => {
    const response = await axios.post('/api/blog', postData);
    return response.data;
  }
);

export const updatePost = createAsyncThunk(
  'blog/updatePost',
  async ({ id, ...postData }) => {
    const response = await axios.put(`/api/blog/${id}`, postData);
    return response.data;
  }
);

export const deletePost = createAsyncThunk(
  'blog/deletePost',
  async (id) => {
    await axios.delete(`/api/blog/${id}`);
    return id;
  }
);

export const addComment = createAsyncThunk(
  'blog/addComment',
  async ({ postId, text }) => {
    const response = await axios.post(`/api/blog/${postId}/comments`, { text });
    return response.data;
  }
);

export const toggleLike = createAsyncThunk(
  'blog/toggleLike',
  async (postId) => {
    const response = await axios.post(`/api/blog/${postId}/like`);
    return response.data;
  }
);

const initialState = {
  posts: [],
  post: null,
  loading: false,
  error: null,
  totalPages: 1,
  currentPage: 1
};

const blogSlice = createSlice({
  name: 'blog',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch Posts
      .addCase(fetchPosts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPosts.fulfilled, (state, action) => {
        state.loading = false;
        state.posts = action.payload.posts;
        state.totalPages = action.payload.totalPages;
        state.currentPage = action.payload.currentPage;
      })
      .addCase(fetchPosts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      // Fetch Single Post
      .addCase(fetchPost.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPost.fulfilled, (state, action) => {
        state.loading = false;
        state.post = action.payload;
      })
      .addCase(fetchPost.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      // Create Post
      .addCase(createPost.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createPost.fulfilled, (state, action) => {
        state.loading = false;
        state.posts.unshift(action.payload);
      })
      .addCase(createPost.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      // Update Post
      .addCase(updatePost.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updatePost.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.posts.findIndex(post => post._id === action.payload._id);
        if (index !== -1) {
          state.posts[index] = action.payload;
        }
        if (state.post && state.post._id === action.payload._id) {
          state.post = action.payload;
        }
      })
      .addCase(updatePost.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      // Delete Post
      .addCase(deletePost.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deletePost.fulfilled, (state, action) => {
        state.loading = false;
        state.posts = state.posts.filter(post => post._id !== action.payload);
        if (state.post && state.post._id === action.payload) {
          state.post = null;
        }
      })
      .addCase(deletePost.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      // Add Comment
      .addCase(addComment.fulfilled, (state, action) => {
        if (state.post) {
          state.post.comments.push(action.payload);
        }
      })
      // Toggle Like
      .addCase(toggleLike.fulfilled, (state, action) => {
        if (state.post) {
          state.post.isLiked = action.payload.isLiked;
          state.post.likes = action.payload.likes;
        }
      });
  }
});

export const { clearError } = blogSlice.actions;

export default blogSlice.reducer; 