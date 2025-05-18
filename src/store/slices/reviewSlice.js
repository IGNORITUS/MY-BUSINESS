import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Асинхронные действия
export const fetchReviews = createAsyncThunk(
  'reviews/fetchReviews',
  async ({ productId, page = 1, limit = 10 }) => {
    const response = await axios.get(`/api/reviews/${productId}`, {
      params: { page, limit }
    });
    return response.data;
  }
);

export const createReview = createAsyncThunk(
  'reviews/createReview',
  async (reviewData) => {
    const response = await axios.post('/api/reviews', reviewData);
    return response.data;
  }
);

export const updateReview = createAsyncThunk(
  'reviews/updateReview',
  async ({ id, reviewData }) => {
    const response = await axios.put(`/api/reviews/${id}`, reviewData);
    return response.data;
  }
);

export const deleteReview = createAsyncThunk(
  'reviews/deleteReview',
  async (id) => {
    await axios.delete(`/api/reviews/${id}`);
    return id;
  }
);

const initialState = {
  reviews: [],
  loading: false,
  error: null,
  totalPages: 1,
  currentPage: 1
};

const reviewSlice = createSlice({
  name: 'reviews',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // fetchReviews
      .addCase(fetchReviews.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchReviews.fulfilled, (state, action) => {
        state.loading = false;
        state.reviews = action.payload.reviews;
        state.totalPages = action.payload.totalPages;
        state.currentPage = action.payload.currentPage;
      })
      .addCase(fetchReviews.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      // createReview
      .addCase(createReview.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createReview.fulfilled, (state, action) => {
        state.loading = false;
        state.reviews.unshift(action.payload);
      })
      .addCase(createReview.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      // updateReview
      .addCase(updateReview.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateReview.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.reviews.findIndex(review => review.id === action.payload.id);
        if (index !== -1) {
          state.reviews[index] = action.payload;
        }
      })
      .addCase(updateReview.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      // deleteReview
      .addCase(deleteReview.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteReview.fulfilled, (state, action) => {
        state.loading = false;
        state.reviews = state.reviews.filter(review => review.id !== action.payload);
      })
      .addCase(deleteReview.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  }
});

export const { clearError } = reviewSlice.actions;
export default reviewSlice.reducer; 