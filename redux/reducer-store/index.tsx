import { configureStore } from '@reduxjs/toolkit';
import themeReducer from '../store/theme-store';
import userReducer from "../store/users-store";

export const store = configureStore({
  reducer: {
    THEME_REDUCER: themeReducer,
    USER_REDUCER : userReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>; // Tipe untuk state global
export type AppDispatch = typeof store.dispatch; // Tipe untuk dispatch
