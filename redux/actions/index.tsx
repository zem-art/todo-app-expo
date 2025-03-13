import { AppDispatch, RootState } from "../reducer-store";
import { setAuth } from "../store/auth-store";
import { setTheme } from "../store/theme-store"
import { setUsers } from "../store/users-store";

export const setThemeActions = () => (dispatch: AppDispatch, getState: () => RootState) => {
    const { isDark } = getState().THEME_REDUCER; // Akses state dengan tipe yang aman
    dispatch(setTheme(!isDark)); // Dispatch action dengan nilai yang diubah
};

export const setUserActions = (NewDataUser: object, NewMeta?:object, newLogin?:boolean) => (dispatch: AppDispatch, getState: () => RootState) => {
    const { data, meta, login } = getState().USER_REDUCER
    dispatch(setUsers({ data: NewDataUser, meta: {}, login: newLogin || login }))
}

export const setAuthActions = (
    NewToken:string,
    NewLogin: boolean
) => (dispatch: AppDispatch, getState: () => RootState) => {
    const { token, login } = getState().AUTH_REDUCER
    // console.log('==> : ', token);
    dispatch(setAuth({ token: NewToken, login: NewLogin }))
}