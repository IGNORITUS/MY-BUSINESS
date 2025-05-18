import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

interface PaymentState {
  loading: boolean;
  error: string | null;
  paymentIntent: any | null;
  paymentMethods: any[];
  selectedMethod: string | null;
}

const initialState: PaymentState = {
  loading: false,
  error: null,
  paymentIntent: null,
  paymentMethods: [],
  selectedMethod: null,
};

export const createPaymentIntent = createAsyncThunk(
  'payment/createIntent',
  async (paymentData: any, { rejectWithValue }) => {
    try {
      const response = await axios.post('/api/payments/create-intent', paymentData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Ошибка при создании платежа');
    }
  }
);

export const confirmPayment = createAsyncThunk(
  'payment/confirm',
  async (paymentId: string, { rejectWithValue }) => {
    try {
      const response = await axios.post(`/api/payments/${paymentId}/confirm`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Ошибка при подтверждении платежа');
    }
  }
);

export const getPaymentMethods = createAsyncThunk(
  'payment/getMethods',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get('/api/payments/methods');
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Ошибка при получении методов оплаты');
    }
  }
);

const paymentSlice = createSlice({
  name: 'payment',
  initialState,
  reducers: {
    setSelectedMethod: (state, action) => {
      state.selectedMethod = action.payload;
    },
    clearPaymentError: (state) => {
      state.error = null;
    },
    resetPaymentState: (state) => {
      state.loading = false;
      state.error = null;
      state.paymentIntent = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Create Payment Intent
      .addCase(createPaymentIntent.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createPaymentIntent.fulfilled, (state, action) => {
        state.loading = false;
        state.paymentIntent = action.payload;
      })
      .addCase(createPaymentIntent.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Confirm Payment
      .addCase(confirmPayment.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(confirmPayment.fulfilled, (state) => {
        state.loading = false;
        state.paymentIntent = null;
      })
      .addCase(confirmPayment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Get Payment Methods
      .addCase(getPaymentMethods.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getPaymentMethods.fulfilled, (state, action) => {
        state.loading = false;
        state.paymentMethods = action.payload;
      })
      .addCase(getPaymentMethods.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { setSelectedMethod, clearPaymentError, resetPaymentState } = paymentSlice.actions;

export default paymentSlice.reducer; 