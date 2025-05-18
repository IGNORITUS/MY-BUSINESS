import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

interface ReturnItem {
  productId: string;
  name: string;
  quantity: number;
  price: number;
  reason: string;
}

interface Return {
  id: string;
  orderId: string;
  orderNumber: string;
  userId: string;
  userName: string;
  items: ReturnItem[];
  totalAmount: number;
  status: 'pending' | 'approved' | 'rejected' | 'completed';
  reason: string;
  comment: string;
  createdAt: string;
  updatedAt: string;
}

interface ReturnsState {
  items: Return[];
  selectedReturn: Return | null;
  loading: boolean;
  error: string | null;
  totalItems: number;
  filters: {
    status?: Return['status'];
    orderId?: string;
    userId?: string;
  };
}

const initialState: ReturnsState = {
  items: [],
  selectedReturn: null,
  loading: false,
  error: null,
  totalItems: 0,
  filters: {},
};

export const fetchReturns = createAsyncThunk(
  'returns/fetchReturns',
  async ({ page = 1, limit = 10, filters = {} }) => {
    const response = await axios.get('/api/returns', {
      params: { page, limit, ...filters },
    });
    return response.data;
  }
);

export const fetchReturnById = createAsyncThunk(
  'returns/fetchReturnById',
  async (id: string) => {
    const response = await axios.get(`/api/returns/${id}`);
    return response.data;
  }
);

export const createReturn = createAsyncThunk(
  'returns/createReturn',
  async (returnData: Partial<Return>) => {
    const response = await axios.post('/api/returns', returnData);
    return response.data;
  }
);

export const updateReturn = createAsyncThunk(
  'returns/updateReturn',
  async ({ id, ...data }: Partial<Return> & { id: string }) => {
    const response = await axios.put(`/api/returns/${id}`, data);
    return response.data;
  }
);

export const deleteReturn = createAsyncThunk(
  'returns/deleteReturn',
  async (id: string) => {
    await axios.delete(`/api/returns/${id}`);
    return id;
  }
);

export const updateReturnStatus = createAsyncThunk(
  'returns/updateReturnStatus',
  async ({ id, status }: { id: string; status: Return['status'] }) => {
    const response = await axios.patch(`/api/returns/${id}/status`, { status });
    return response.data;
  }
);

const returnsSlice = createSlice({
  name: 'returns',
  initialState,
  reducers: {
    setSelectedReturn: (state, action) => {
      state.selectedReturn = action.payload;
    },
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    clearFilters: (state) => {
      state.filters = {};
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch returns
      .addCase(fetchReturns.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchReturns.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload.items;
        state.totalItems = action.payload.total;
      })
      .addCase(fetchReturns.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch returns';
      })
      // Fetch return by ID
      .addCase(fetchReturnById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchReturnById.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedReturn = action.payload;
      })
      .addCase(fetchReturnById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch return';
      })
      // Create return
      .addCase(createReturn.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createReturn.fulfilled, (state, action) => {
        state.loading = false;
        state.items.unshift(action.payload);
        state.totalItems += 1;
      })
      .addCase(createReturn.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to create return';
      })
      // Update return
      .addCase(updateReturn.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateReturn.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.items.findIndex((item) => item.id === action.payload.id);
        if (index !== -1) {
          state.items[index] = action.payload;
        }
        if (state.selectedReturn?.id === action.payload.id) {
          state.selectedReturn = action.payload;
        }
      })
      .addCase(updateReturn.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to update return';
      })
      // Delete return
      .addCase(deleteReturn.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteReturn.fulfilled, (state, action) => {
        state.loading = false;
        state.items = state.items.filter((item) => item.id !== action.payload);
        state.totalItems -= 1;
        if (state.selectedReturn?.id === action.payload) {
          state.selectedReturn = null;
        }
      })
      .addCase(deleteReturn.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to delete return';
      })
      // Update return status
      .addCase(updateReturnStatus.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateReturnStatus.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.items.findIndex((item) => item.id === action.payload.id);
        if (index !== -1) {
          state.items[index] = action.payload;
        }
        if (state.selectedReturn?.id === action.payload.id) {
          state.selectedReturn = action.payload;
        }
      })
      .addCase(updateReturnStatus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to update return status';
      });
  },
});

export const { setSelectedReturn, setFilters, clearFilters, clearError } =
  returnsSlice.actions;

export default returnsSlice.reducer; 