import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface FavoriteItem {
  id: string;
  name: string;
  price: number;
  image: string;
}

interface FavoritesState {
  items: FavoriteItem[];
}

const initialState: FavoritesState = {
  items: [],
};

const favoritesSlice = createSlice({
  name: 'favorites',
  initialState,
  reducers: {
    addToFavorites: (state, action: PayloadAction<FavoriteItem>) => {
      const newItem = action.payload;
      if (!state.items.find(item => item.id === newItem.id)) {
        state.items.push(newItem);
      }
    },

    removeFromFavorites: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter(item => item.id !== action.payload);
    },

    clearFavorites: (state) => {
      state.items = [];
    },
  },
});

export const { addToFavorites, removeFromFavorites, clearFavorites } = favoritesSlice.actions;
export default favoritesSlice.reducer; 