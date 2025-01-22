import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface AuthState {
    login: boolean;
    token: string;
}

const initialState: AuthState = {
    login: false,
    token: '',
}

const AuthSlice = createSlice({
    name: 'auth',
    initialState,
    reducers : {
        setAuth : (state, action: PayloadAction<{ login : boolean, token: string}>) => {
            console.log("setAuth triggered with: ", action.payload); 
            state.login = action.payload.login;
            state.token = action.payload.token;
        }
    }
})

export const { setAuth } = AuthSlice.actions;
export default AuthSlice.reducer;