import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Async thunk для создания платежного намерения
export const createPaymentIntent = createAsyncThunk(
  'payment/createIntent',
  async (amount, { rejectWithValue }) => {
    try {
      const response = await axios.post('/api/payments/create-intent', { amount });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

const initialState = {
  clientSecret: null,
  loading: false,
  error: null,
  status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
};

const paymentSlice = createSlice({
  name: 'payment',
  initialState,
  reducers: {
    resetPaymentState: (state) => {
      state.clientSecret = null;
      state.loading = false;
      state.error = null;
      state.status = 'idle';
    },
    setPaymentError: (state, action) => {
      state.error = action.payload;
      state.status = 'failed';
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createPaymentIntent.pending, (state) => {
        state.loading = true;
        state.status = 'loading';
      })
      .addCase(createPaymentIntent.fulfilled, (state, action) => {
        state.loading = false;
        state.clientSecret = action.payload.clientSecret;
        state.status = 'succeeded';
      })
      .addCase(createPaymentIntent.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.status = 'failed';
      });
  },
});

export const { resetPaymentState, setPaymentError } = paymentSlice.actions;

export default paymentSlice.reducer; 