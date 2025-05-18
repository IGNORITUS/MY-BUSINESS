import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'user' | 'manager';
  status: 'active' | 'inactive' | 'blocked';
  createdAt: string;
  lastLogin: string;
}

interface UsersState {
  items: User[];
  selectedUser: User | null;
  loading: boolean;
  error: string | null;
  totalItems: number;
  filters: {
    role: string;
    status: string;
    search: string;
  };
}

const initialState: UsersState = {
  items: [],
  selectedUser: null,
  loading: false,
  error: null,
  totalItems: 0,
  filters: {
    role: '',
    status: '',
    search: '',
  },
};

// Получение списка пользователей
export const fetchUsers = createAsyncThunk(
  'users/fetchUsers',
  async (params: { page: number; limit: number; filters?: any }, { rejectWithValue }) => {
    try {
      const response = await axios.get('/api/users', { params });
      return response.data;
    } catch (error) {
      return rejectWithValue('Ошибка при получении пользователей');
    }
  }
);

// Получение пользователя по ID
export const fetchUserById = createAsyncThunk(
  'users/fetchUserById',
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await axios.get(`/api/users/${id}`);
      return response.data;
    } catch (error) {
      return rejectWithValue('Ошибка при получении пользователя');
    }
  }
);

// Создание пользователя
export const createUser = createAsyncThunk(
  'users/createUser',
  async (userData: Partial<User>, { rejectWithValue }) => {
    try {
      const response = await axios.post('/api/users', userData);
      return response.data;
    } catch (error) {
      return rejectWithValue('Ошибка при создании пользователя');
    }
  }
);

// Обновление пользователя
export const updateUser = createAsyncThunk(
  'users/updateUser',
  async ({ id, ...userData }: Partial<User> & { id: string }, { rejectWithValue }) => {
    try {
      const response = await axios.put(`/api/users/${id}`, userData);
      return response.data;
    } catch (error) {
      return rejectWithValue('Ошибка при обновлении пользователя');
    }
  }
);

// Удаление пользователя
export const deleteUser = createAsyncThunk(
  'users/deleteUser',
  async (id: string, { rejectWithValue }) => {
    try {
      await axios.delete(`/api/users/${id}`);
      return id;
    } catch (error) {
      return rejectWithValue('Ошибка при удалении пользователя');
    }
  }
);

// Блокировка/разблокировка пользователя
export const toggleUserStatus = createAsyncThunk(
  'users/toggleUserStatus',
  async ({ id, status }: { id: string; status: User['status'] }, { rejectWithValue }) => {
    try {
      const response = await axios.patch(`/api/users/${id}/status`, { status });
      return response.data;
    } catch (error) {
      return rejectWithValue('Ошибка при изменении статуса пользователя');
    }
  }
);

const usersSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {
    setSelectedUser: (state, action) => {
      state.selectedUser = action.payload;
    },
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    clearFilters: (state) => {
      state.filters = initialState.filters;
    },
    clearUsersError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Users
      .addCase(fetchUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload.items;
        state.totalItems = action.payload.total;
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Fetch User by ID
      .addCase(fetchUserById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserById.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedUser = action.payload;
      })
      .addCase(fetchUserById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Create User
      .addCase(createUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createUser.fulfilled, (state, action) => {
        state.loading = false;
        state.items.unshift(action.payload);
        state.totalItems += 1;
      })
      .addCase(createUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Update User
      .addCase(updateUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.items.findIndex((item) => item.id === action.payload.id);
        if (index !== -1) {
          state.items[index] = action.payload;
        }
        if (state.selectedUser?.id === action.payload.id) {
          state.selectedUser = action.payload;
        }
      })
      .addCase(updateUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Delete User
      .addCase(deleteUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteUser.fulfilled, (state, action) => {
        state.loading = false;
        state.items = state.items.filter((item) => item.id !== action.payload);
        state.totalItems -= 1;
      })
      .addCase(deleteUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Toggle User Status
      .addCase(toggleUserStatus.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(toggleUserStatus.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.items.findIndex((item) => item.id === action.payload.id);
        if (index !== -1) {
          state.items[index] = action.payload;
        }
        if (state.selectedUser?.id === action.payload.id) {
          state.selectedUser = action.payload;
        }
      })
      .addCase(toggleUserStatus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const {
  setSelectedUser,
  setFilters,
  clearFilters,
  clearUsersError,
} = usersSlice.actions;

export default usersSlice.reducer; 