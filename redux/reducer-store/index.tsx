import { configureStore } from '@reduxjs/toolkit';
import themeReducer from '../store/theme-store';

const store = configureStore({
  reducer: {
    SYSTEM_THEME: themeReducer,
  },
});

export default store;
