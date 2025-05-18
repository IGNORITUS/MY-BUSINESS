import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  toast: {
    open: false,
    message: '',
    severity: 'info' // 'success' | 'error' | 'info' | 'warning'
  },
  loading: {
    global: false,
    products: false,
    categories: false,
    cart: false,
    orders: false
  }
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    showToast: (state, action) => {
      state.toast = {
        open: true,
        message: action.payload.message,
        severity: action.payload.severity || 'info'
      };
    },
    hideToast: (state) => {
      state.toast.open = false;
    },
    setLoading: (state, action) => {
      const { type, value } = action.payload;
      state.loading[type] = value;
    }
  }
});

export const { showToast, hideToast, setLoading } = uiSlice.actions;

export default uiSlice.reducer; 