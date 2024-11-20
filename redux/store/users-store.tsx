import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface UserState {
    data: object;
    meta: object | null; // Tambahan data lainnya
}

const initialState: UserState = {
    data : {},
    meta: null,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUsers: (state, action: PayloadAction<{ data: object; meta: object }>) => {
        state.data = action.payload.data;
        state.meta = action.payload.meta;
    }
  },
});

export const { setUsers } = userSlice.actions;
export default userSlice.reducer;
