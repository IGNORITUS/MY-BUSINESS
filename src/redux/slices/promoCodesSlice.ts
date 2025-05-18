import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export interface PromoCode {
  id: string;
  code: string;
  type: 'percentage' | 'fixed';
  value: number;
  minOrderAmount: number;
  maxDiscount: number;
  startDate: string;
  endDate: string;
  usageLimit: number;
  usageCount: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

interface PromoCodesState {
  items: PromoCode[];
  selectedPromoCode: PromoCode | null;
  loading: boolean;
  error: string | null;
  totalItems: number;
  filters: {
    isActive: boolean | null;
    type: string;
    search: string;
  };
}

const initialState: PromoCodesState = {
  items: [],
  selectedPromoCode: null,
  loading: false,
  error: null,
  totalItems: 0,
  filters: {
    isActive: null,
    type: '',
    search: '',
  },
};

// Получение списка промокодов
export const fetchPromoCodes = createAsyncThunk(
  'promoCodes/fetchPromoCodes',
  async (params: { page: number; limit: number; filters?: any }, { rejectWithValue }) => {
    try {
      const response = await axios.get('/api/promo-codes', { params });
      return response.data;
    } catch (error) {
      return rejectWithValue('Ошибка при получении промокодов');
    }
  }
);

// Получение промокода по ID
export const fetchPromoCodeById = createAsyncThunk(
  'promoCodes/fetchPromoCodeById',
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await axios.get(`/api/promo-codes/${id}`);
      return response.data;
    } catch (error) {
      return rejectWithValue('Ошибка при получении промокода');
    }
  }
);

// Создание промокода
export const createPromoCode = createAsyncThunk(
  'promoCodes/createPromoCode',
  async (promoCodeData: Partial<PromoCode>, { rejectWithValue }) => {
    try {
      const response = await axios.post('/api/promo-codes', promoCodeData);
      return response.data;
    } catch (error) {
      return rejectWithValue('Ошибка при создании промокода');
    }
  }
);

// Обновление промокода
export const updatePromoCode = createAsyncThunk(
  'promoCodes/updatePromoCode',
  async ({ id, ...promoCodeData }: Partial<PromoCode> & { id: string }, { rejectWithValue }) => {
    try {
      const response = await axios.put(`/api/promo-codes/${id}`, promoCodeData);
      return response.data;
    } catch (error) {
      return rejectWithValue('Ошибка при обновлении промокода');
    }
  }
);

// Удаление промокода
export const deletePromoCode = createAsyncThunk(
  'promoCodes/deletePromoCode',
  async (id: string, { rejectWithValue }) => {
    try {
      await axios.delete(`/api/promo-codes/${id}`);
      return id;
    } catch (error) {
      return rejectWithValue('Ошибка при удалении промокода');
    }
  }
);

// Активация/деактивация промокода
export const togglePromoCodeStatus = createAsyncThunk(
  'promoCodes/togglePromoCodeStatus',
  async ({ id, isActive }: { id: string; isActive: boolean }, { rejectWithValue }) => {
    try {
      const response = await axios.patch(`/api/promo-codes/${id}/status`, { isActive });
      return response.data;
    } catch (error) {
      return rejectWithValue('Ошибка при изменении статуса промокода');
    }
  }
);

// Проверка промокода
export const validatePromoCode = createAsyncThunk(
  'promoCodes/validatePromoCode',
  async ({ code, orderAmount }: { code: string; orderAmount: number }, { rejectWithValue }) => {
    try {
      const response = await axios.post('/api/promo-codes/validate', { code, orderAmount });
      return response.data;
    } catch (error) {
      return rejectWithValue('Ошибка при проверке промокода');
    }
  }
);

const promoCodesSlice = createSlice({
  name: 'promoCodes',
  initialState,
  reducers: {
    setSelectedPromoCode: (state, action) => {
      state.selectedPromoCode = action.payload;
    },
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    clearFilters: (state) => {
      state.filters = initialState.filters;
    },
    clearPromoCodesError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch PromoCodes
      .addCase(fetchPromoCodes.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPromoCodes.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload.items;
        state.totalItems = action.payload.total;
      })
      .addCase(fetchPromoCodes.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Fetch PromoCode by ID
      .addCase(fetchPromoCodeById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPromoCodeById.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedPromoCode = action.payload;
      })
      .addCase(fetchPromoCodeById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Create PromoCode
      .addCase(createPromoCode.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createPromoCode.fulfilled, (state, action) => {
        state.loading = false;
        state.items.unshift(action.payload);
        state.totalItems += 1;
      })
      .addCase(createPromoCode.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Update PromoCode
      .addCase(updatePromoCode.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updatePromoCode.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.items.findIndex((item) => item.id === action.payload.id);
        if (index !== -1) {
          state.items[index] = action.payload;
        }
        if (state.selectedPromoCode?.id === action.payload.id) {
          state.selectedPromoCode = action.payload;
        }
      })
      .addCase(updatePromoCode.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Delete PromoCode
      .addCase(deletePromoCode.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deletePromoCode.fulfilled, (state, action) => {
        state.loading = false;
        state.items = state.items.filter((item) => item.id !== action.payload);
        state.totalItems -= 1;
      })
      .addCase(deletePromoCode.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Toggle PromoCode Status
      .addCase(togglePromoCodeStatus.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(togglePromoCodeStatus.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.items.findIndex((item) => item.id === action.payload.id);
        if (index !== -1) {
          state.items[index] = action.payload;
        }
        if (state.selectedPromoCode?.id === action.payload.id) {
          state.selectedPromoCode = action.payload;
        }
      })
      .addCase(togglePromoCodeStatus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Validate PromoCode
      .addCase(validatePromoCode.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(validatePromoCode.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(validatePromoCode.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const {
  setSelectedPromoCode,
  setFilters,
  clearFilters,
  clearPromoCodesError,
} = promoCodesSlice.actions;

export default promoCodesSlice.reducer; 