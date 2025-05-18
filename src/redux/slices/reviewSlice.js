import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

export const fetchReviews = createAsyncThunk(
  'reviews/fetchReviews',
  async () => {
    const response = await axios.get(`${API_URL}/reviews`);
    return response.data;
  }
);

export const createReview = createAsyncThunk(
  'reviews/createReview',
  async (reviewData) => {
    const response = await axios.post(`${API_URL}/reviews`, reviewData, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    });
    return response.data;
  }
);

export const updateReview = createAsyncThunk(
  'reviews/updateReview',
  async (reviewData) => {
    const response = await axios.put(
      `${API_URL}/reviews/${reviewData._id}`,
      reviewData,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      }
    );
    return response.data;
  }
);

export const deleteReview = createAsyncThunk(
  'reviews/deleteReview',
  async (reviewId) => {
    await axios.delete(`${API_URL}/reviews/${reviewId}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    });
    return reviewId;
  }
);

const reviewSlice = createSlice({
  name: 'reviews',
  initialState: {
    reviews: [],
    status: 'idle',
    error: null
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchReviews.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchReviews.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.reviews = action.payload;
      })
      .addCase(fetchReviews.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      .addCase(createReview.fulfilled, (state, action) => {
        state.reviews.unshift(action.payload);
      })
      .addCase(updateReview.fulfilled, (state, action) => {
        const index = state.reviews.findIndex(
          (review) => review._id === action.payload._id
        );
        if (index !== -1) {
          state.reviews[index] = action.payload;
        }
      })
      .addCase(deleteReview.fulfilled, (state, action) => {
        state.reviews = state.reviews.filter(
          (review) => review._id !== action.payload
        );
      });
  }
});

export default reviewSlice.reducer; 