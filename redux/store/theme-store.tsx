import { createSlice } from '@reduxjs/toolkit';

const themeSlice = createSlice({
  name: 'SYSTEM_THEME',
  initialState: {
    default : false,
    isDark : false,
  },
  reducers: {
    setTheme: (state, action) => {
      state.default = false;
      state.isDark = action.payload;
    }
  },
});

export const { setTheme } = themeSlice.actions;
export default themeSlice.reducer;
