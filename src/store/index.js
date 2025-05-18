import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import cartReducer from './slices/cartSlice';
import productReducer from './slices/productSlice';
import categoryReducer from './slices/categorySlice';
import orderReducer from './slices/orderSlice';
import blogReducer from './slices/blogSlice';
import notificationReducer from './slices/notificationSlice';
import favoritesReducer from './slices/favoritesSlice';

const store = configureStore({
  reducer: {
    auth: authReducer,
    cart: cartReducer,
    products: productReducer,
    categories: categoryReducer,
    orders: orderReducer,
    blog: blogReducer,
    notifications: notificationReducer,
    favorites: favoritesReducer
  }
});

export default store; 