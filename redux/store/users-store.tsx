import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface UserState {
    data: object;
    login: boolean;
    meta: object | null; // Tambahan data lainnya
}

const initialState: UserState = {
    data : {},
    login: false,
    meta: null,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUsers: (state, action: PayloadAction<{ data: object; meta: object, login:boolean }>) => {
        state.data = action.payload.data;
        state.login = action.payload.login;
        state.meta = action.payload.meta;
    }
  },
});

export const { setUsers } = userSlice.actions;
export default userSlice.reducer;
