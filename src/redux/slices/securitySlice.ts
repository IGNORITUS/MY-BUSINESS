import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

interface SecurityState {
  csrfToken: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
  lastActivity: number;
  sessionTimeout: number;
}

const initialState: SecurityState = {
  csrfToken: null,
  isAuthenticated: false,
  loading: false,
  error: null,
  lastActivity: Date.now(),
  sessionTimeout: 30 * 60 * 1000, // 30 минут
};

// Получение CSRF токена
export const fetchCsrfToken = createAsyncThunk(
  'security/fetchCsrfToken',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get('/api/security/csrf-token');
      return response.data.token;
    } catch (error) {
      return rejectWithValue('Ошибка при получении CSRF токена');
    }
  }
);

// Проверка сессии
export const checkSession = createAsyncThunk(
  'security/checkSession',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get('/api/security/check-session');
      return response.data;
    } catch (error) {
      return rejectWithValue('Сессия истекла');
    }
  }
);

// Обновление сессии
export const refreshSession = createAsyncThunk(
  'security/refreshSession',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.post('/api/security/refresh-session');
      return response.data;
    } catch (error) {
      return rejectWithValue('Ошибка при обновлении сессии');
    }
  }
);

const securitySlice = createSlice({
  name: 'security',
  initialState,
  reducers: {
    updateLastActivity: (state) => {
      state.lastActivity = Date.now();
    },
    clearSecurityError: (state) => {
      state.error = null;
    },
    resetSecurityState: (state) => {
      state.csrfToken = null;
      state.isAuthenticated = false;
      state.error = null;
      state.lastActivity = Date.now();
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch CSRF Token
      .addCase(fetchCsrfToken.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCsrfToken.fulfilled, (state, action) => {
        state.loading = false;
        state.csrfToken = action.payload;
      })
      .addCase(fetchCsrfToken.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Check Session
      .addCase(checkSession.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(checkSession.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = action.payload.isAuthenticated;
        state.lastActivity = Date.now();
      })
      .addCase(checkSession.rejected, (state, action) => {
        state.loading = false;
        state.isAuthenticated = false;
        state.error = action.payload as string;
      })
      // Refresh Session
      .addCase(refreshSession.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(refreshSession.fulfilled, (state) => {
        state.loading = false;
        state.lastActivity = Date.now();
      })
      .addCase(refreshSession.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { updateLastActivity, clearSecurityError, resetSecurityState } =
  securitySlice.actions;

export default securitySlice.reducer; 