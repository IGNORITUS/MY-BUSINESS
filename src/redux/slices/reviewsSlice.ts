import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export interface Review {
  id: string;
  productId: string;
  productName: string;
  userId: string;
  userName: string;
  rating: number;
  comment: string;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: string;
  updatedAt: string;
}

interface ReviewsState {
  items: Review[];
  selectedReview: Review | null;
  loading: boolean;
  error: string | null;
  totalItems: number;
  filters: {
    status: string;
    rating: number | null;
    productId: string | null;
    userId: string | null;
  };
}

const initialState: ReviewsState = {
  items: [],
  selectedReview: null,
  loading: false,
  error: null,
  totalItems: 0,
  filters: {
    status: '',
    rating: null,
    productId: null,
    userId: null,
  },
};

// Получение списка отзывов
export const fetchReviews = createAsyncThunk(
  'reviews/fetchReviews',
  async (params: { page: number; limit: number; filters?: any }, { rejectWithValue }) => {
    try {
      const response = await axios.get('/api/reviews', { params });
      return response.data;
    } catch (error) {
      return rejectWithValue('Ошибка при получении отзывов');
    }
  }
);

// Получение отзыва по ID
export const fetchReviewById = createAsyncThunk(
  'reviews/fetchReviewById',
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await axios.get(`/api/reviews/${id}`);
      return response.data;
    } catch (error) {
      return rejectWithValue('Ошибка при получении отзыва');
    }
  }
);

// Создание отзыва
export const createReview = createAsyncThunk(
  'reviews/createReview',
  async (reviewData: Partial<Review>, { rejectWithValue }) => {
    try {
      const response = await axios.post('/api/reviews', reviewData);
      return response.data;
    } catch (error) {
      return rejectWithValue('Ошибка при создании отзыва');
    }
  }
);

// Обновление отзыва
export const updateReview = createAsyncThunk(
  'reviews/updateReview',
  async ({ id, ...reviewData }: Partial<Review> & { id: string }, { rejectWithValue }) => {
    try {
      const response = await axios.put(`/api/reviews/${id}`, reviewData);
      return response.data;
    } catch (error) {
      return rejectWithValue('Ошибка при обновлении отзыва');
    }
  }
);

// Удаление отзыва
export const deleteReview = createAsyncThunk(
  'reviews/deleteReview',
  async (id: string, { rejectWithValue }) => {
    try {
      await axios.delete(`/api/reviews/${id}`);
      return id;
    } catch (error) {
      return rejectWithValue('Ошибка при удалении отзыва');
    }
  }
);

// Обновление статуса отзыва
export const updateReviewStatus = createAsyncThunk(
  'reviews/updateReviewStatus',
  async ({ id, status }: { id: string; status: Review['status'] }, { rejectWithValue }) => {
    try {
      const response = await axios.patch(`/api/reviews/${id}/status`, { status });
      return response.data;
    } catch (error) {
      return rejectWithValue('Ошибка при обновлении статуса отзыва');
    }
  }
);

const reviewsSlice = createSlice({
  name: 'reviews',
  initialState,
  reducers: {
    setSelectedReview: (state, action) => {
      state.selectedReview = action.payload;
    },
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    clearFilters: (state) => {
      state.filters = initialState.filters;
    },
    clearReviewsError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Reviews
      .addCase(fetchReviews.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchReviews.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload.items;
        state.totalItems = action.payload.total;
      })
      .addCase(fetchReviews.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Fetch Review by ID
      .addCase(fetchReviewById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchReviewById.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedReview = action.payload;
      })
      .addCase(fetchReviewById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Create Review
      .addCase(createReview.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createReview.fulfilled, (state, action) => {
        state.loading = false;
        state.items.unshift(action.payload);
        state.totalItems += 1;
      })
      .addCase(createReview.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Update Review
      .addCase(updateReview.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateReview.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.items.findIndex((item) => item.id === action.payload.id);
        if (index !== -1) {
          state.items[index] = action.payload;
        }
        if (state.selectedReview?.id === action.payload.id) {
          state.selectedReview = action.payload;
        }
      })
      .addCase(updateReview.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Delete Review
      .addCase(deleteReview.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteReview.fulfilled, (state, action) => {
        state.loading = false;
        state.items = state.items.filter((item) => item.id !== action.payload);
        state.totalItems -= 1;
      })
      .addCase(deleteReview.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Update Review Status
      .addCase(updateReviewStatus.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateReviewStatus.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.items.findIndex((item) => item.id === action.payload.id);
        if (index !== -1) {
          state.items[index] = action.payload;
        }
        if (state.selectedReview?.id === action.payload.id) {
          state.selectedReview = action.payload;
        }
      })
      .addCase(updateReviewStatus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const {
  setSelectedReview,
  setFilters,
  clearFilters,
  clearReviewsError,
} = reviewsSlice.actions;

export default reviewsSlice.reducer; 