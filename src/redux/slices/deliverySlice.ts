import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export interface DeliveryMethod {
  id: string;
  name: string;
  description: string;
  price: number;
  estimatedDays: number;
  icon: string;
}

export interface DeliveryAddress {
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

interface DeliveryState {
  methods: DeliveryMethod[];
  selectedMethod: DeliveryMethod | null;
  address: DeliveryAddress | null;
  loading: boolean;
  error: string | null;
  trackingNumber: string | null;
  estimatedDeliveryDate: string | null;
}

const initialState: DeliveryState = {
  methods: [],
  selectedMethod: null,
  address: null,
  loading: false,
  error: null,
  trackingNumber: null,
  estimatedDeliveryDate: null,
};

export const fetchDeliveryMethods = createAsyncThunk(
  'delivery/fetchMethods',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get('/api/delivery/methods');
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Ошибка при получении методов доставки');
    }
  }
);

export const calculateDeliveryCost = createAsyncThunk(
  'delivery/calculateCost',
  async ({ methodId, address }: { methodId: string; address: DeliveryAddress }, { rejectWithValue }) => {
    try {
      const response = await axios.post('/api/delivery/calculate', { methodId, address });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Ошибка при расчете стоимости доставки');
    }
  }
);

export const createDelivery = createAsyncThunk(
  'delivery/create',
  async ({ orderId, methodId, address }: { orderId: string; methodId: string; address: DeliveryAddress }, { rejectWithValue }) => {
    try {
      const response = await axios.post('/api/delivery/create', { orderId, methodId, address });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Ошибка при создании доставки');
    }
  }
);

const deliverySlice = createSlice({
  name: 'delivery',
  initialState,
  reducers: {
    setSelectedMethod: (state, action) => {
      state.selectedMethod = action.payload;
    },
    setDeliveryAddress: (state, action) => {
      state.address = action.payload;
    },
    clearDeliveryError: (state) => {
      state.error = null;
    },
    resetDeliveryState: (state) => {
      state.selectedMethod = null;
      state.address = null;
      state.trackingNumber = null;
      state.estimatedDeliveryDate = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Delivery Methods
      .addCase(fetchDeliveryMethods.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDeliveryMethods.fulfilled, (state, action) => {
        state.loading = false;
        state.methods = action.payload;
      })
      .addCase(fetchDeliveryMethods.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Calculate Delivery Cost
      .addCase(calculateDeliveryCost.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(calculateDeliveryCost.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedMethod = {
          ...state.selectedMethod!,
          price: action.payload.cost,
        };
        state.estimatedDeliveryDate = action.payload.estimatedDate;
      })
      .addCase(calculateDeliveryCost.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Create Delivery
      .addCase(createDelivery.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createDelivery.fulfilled, (state, action) => {
        state.loading = false;
        state.trackingNumber = action.payload.trackingNumber;
        state.estimatedDeliveryDate = action.payload.estimatedDeliveryDate;
      })
      .addCase(createDelivery.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const {
  setSelectedMethod,
  setDeliveryAddress,
  clearDeliveryError,
  resetDeliveryState,
} = deliverySlice.actions;

export default deliverySlice.reducer; 