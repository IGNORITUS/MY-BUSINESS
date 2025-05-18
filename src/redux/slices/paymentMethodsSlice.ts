import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

interface PaymentMethod {
  id: string;
  type: 'card' | 'paypal' | 'apple_pay' | 'google_pay';
  name: string;
  isDefault: boolean;
  last4?: string;
  expiryDate?: string;
  brand?: string;
}

interface PaymentMethodsState {
  methods: PaymentMethod[];
  selectedMethod: string | null;
  loading: boolean;
  error: string | null;
  supportedMethods: string[];
}

const initialState: PaymentMethodsState = {
  methods: [],
  selectedMethod: null,
  loading: false,
  error: null,
  supportedMethods: ['card', 'paypal', 'apple_pay', 'google_pay'],
};

// Получение списка платежных методов
export const fetchPaymentMethods = createAsyncThunk(
  'paymentMethods/fetchPaymentMethods',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get('/api/payment-methods');
      return response.data;
    } catch (error) {
      return rejectWithValue('Ошибка при получении платежных методов');
    }
  }
);

// Добавление нового платежного метода
export const addPaymentMethod = createAsyncThunk(
  'paymentMethods/addPaymentMethod',
  async (methodData: Partial<PaymentMethod>, { rejectWithValue }) => {
    try {
      const response = await axios.post('/api/payment-methods', methodData);
      return response.data;
    } catch (error) {
      return rejectWithValue('Ошибка при добавлении платежного метода');
    }
  }
);

// Удаление платежного метода
export const removePaymentMethod = createAsyncThunk(
  'paymentMethods/removePaymentMethod',
  async (methodId: string, { rejectWithValue }) => {
    try {
      await axios.delete(`/api/payment-methods/${methodId}`);
      return methodId;
    } catch (error) {
      return rejectWithValue('Ошибка при удалении платежного метода');
    }
  }
);

// Установка метода по умолчанию
export const setDefaultPaymentMethod = createAsyncThunk(
  'paymentMethods/setDefaultPaymentMethod',
  async (methodId: string, { rejectWithValue }) => {
    try {
      const response = await axios.post(`/api/payment-methods/${methodId}/default`);
      return response.data;
    } catch (error) {
      return rejectWithValue('Ошибка при установке метода по умолчанию');
    }
  }
);

const paymentMethodsSlice = createSlice({
  name: 'paymentMethods',
  initialState,
  reducers: {
    setSelectedMethod: (state, action) => {
      state.selectedMethod = action.payload;
    },
    clearPaymentMethodsError: (state) => {
      state.error = null;
    },
    resetPaymentMethodsState: (state) => {
      state.methods = [];
      state.selectedMethod = null;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Payment Methods
      .addCase(fetchPaymentMethods.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPaymentMethods.fulfilled, (state, action) => {
        state.loading = false;
        state.methods = action.payload;
        if (action.payload.length > 0) {
          const defaultMethod = action.payload.find((method: PaymentMethod) => method.isDefault);
          state.selectedMethod = defaultMethod?.id || action.payload[0].id;
        }
      })
      .addCase(fetchPaymentMethods.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Add Payment Method
      .addCase(addPaymentMethod.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addPaymentMethod.fulfilled, (state, action) => {
        state.loading = false;
        state.methods.push(action.payload);
        if (action.payload.isDefault) {
          state.methods = state.methods.map(method => ({
            ...method,
            isDefault: method.id === action.payload.id
          }));
        }
      })
      .addCase(addPaymentMethod.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Remove Payment Method
      .addCase(removePaymentMethod.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(removePaymentMethod.fulfilled, (state, action) => {
        state.loading = false;
        state.methods = state.methods.filter(method => method.id !== action.payload);
        if (state.selectedMethod === action.payload) {
          state.selectedMethod = state.methods[0]?.id || null;
        }
      })
      .addCase(removePaymentMethod.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Set Default Payment Method
      .addCase(setDefaultPaymentMethod.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(setDefaultPaymentMethod.fulfilled, (state, action) => {
        state.loading = false;
        state.methods = state.methods.map(method => ({
          ...method,
          isDefault: method.id === action.payload.id
        }));
      })
      .addCase(setDefaultPaymentMethod.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const {
  setSelectedMethod,
  clearPaymentMethodsError,
  resetPaymentMethodsState,
} = paymentMethodsSlice.actions;

export default paymentMethodsSlice.reducer; 