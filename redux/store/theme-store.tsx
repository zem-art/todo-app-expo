import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface ThemeState {
  default: boolean;
  isDark: boolean;
}

const initialState: ThemeState = {
  default : false,
  isDark: false,
};

const themeSlice = createSlice({
  name: 'THEME',
  initialState,
  reducers: {
    setTheme: (state, action: PayloadAction<boolean>) => {
      state.default = false;
      state.isDark = action.payload;
    }
  },
});

export const { setTheme } = themeSlice.actions;
export default themeSlice.reducer;
