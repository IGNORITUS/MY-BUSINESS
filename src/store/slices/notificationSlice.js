import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Async thunks
export const fetchNotifications = createAsyncThunk(
  'notifications/fetchNotifications',
  async ({ page = 1, limit = 10 }) => {
    const response = await axios.get('/api/notifications', {
      params: { page, limit }
    });
    return response.data;
  }
);

export const getUnreadCount = createAsyncThunk(
  'notifications/getUnreadCount',
  async () => {
    const response = await axios.get('/api/notifications/unread/count');
    return response.data;
  }
);

export const markAsRead = createAsyncThunk(
  'notifications/markAsRead',
  async (id) => {
    const response = await axios.put(`/api/notifications/${id}/read`);
    return response.data;
  }
);

export const markAllAsRead = createAsyncThunk(
  'notifications/markAllAsRead',
  async () => {
    const response = await axios.put('/api/notifications/read/all');
    return response.data;
  }
);

export const deleteNotification = createAsyncThunk(
  'notifications/deleteNotification',
  async (id) => {
    await axios.delete(`/api/notifications/${id}`);
    return id;
  }
);

const initialState = {
  notifications: [],
  unreadCount: 0,
  loading: false,
  error: null,
  totalPages: 1,
  currentPage: 1
};

const notificationSlice = createSlice({
  name: 'notifications',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch Notifications
      .addCase(fetchNotifications.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchNotifications.fulfilled, (state, action) => {
        state.loading = false;
        state.notifications = action.payload.notifications;
        state.totalPages = action.payload.totalPages;
        state.currentPage = action.payload.currentPage;
      })
      .addCase(fetchNotifications.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      // Get Unread Count
      .addCase(getUnreadCount.fulfilled, (state, action) => {
        state.unreadCount = action.payload.count;
      })
      // Mark As Read
      .addCase(markAsRead.fulfilled, (state, action) => {
        const index = state.notifications.findIndex(n => n._id === action.payload._id);
        if (index !== -1) {
          state.notifications[index] = action.payload;
        }
        if (state.unreadCount > 0) {
          state.unreadCount -= 1;
        }
      })
      // Mark All As Read
      .addCase(markAllAsRead.fulfilled, (state) => {
        state.notifications = state.notifications.map(n => ({ ...n, read: true }));
        state.unreadCount = 0;
      })
      // Delete Notification
      .addCase(deleteNotification.fulfilled, (state, action) => {
        state.notifications = state.notifications.filter(n => n._id !== action.payload);
      });
  }
});

export const { clearError } = notificationSlice.actions;

export default notificationSlice.reducer; 