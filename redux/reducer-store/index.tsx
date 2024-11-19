import { configureStore } from '@reduxjs/toolkit';
import themeReducer from '../store/theme-store';

export const store = configureStore({
  reducer: {
    THEME: themeReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>; // Tipe untuk state global
export type AppDispatch = typeof store.dispatch; // Tipe untuk dispatch
