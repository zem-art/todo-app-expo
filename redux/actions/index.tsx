import { AppDispatch, RootState } from "../reducer-store";
import { setTheme } from "../store/theme-store"
import { setUsers } from "../store/users-store";

export const setThemeActions = () => (dispatch: AppDispatch, getState: () => RootState) => {
    const { isDark } = getState().THEME_REDUCER; // Akses state dengan tipe yang aman
    dispatch(setTheme(!isDark)); // Dispatch action dengan nilai yang diubah
};

export const setUserActions = () => (dispatch: AppDispatch, getState: () => RootState) => {
    const { data, meta } = getState().USER_REDUCER
    dispatch(setUsers({ data, meta: {} }))
}