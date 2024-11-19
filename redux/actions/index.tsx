import { AppDispatch, RootState } from "../reducer-store";
import { setTheme } from "../store/theme-store"

export const setThemeActions = () => (dispatch: AppDispatch, getState: () => RootState) => {
    const { isDark } = getState().THEME; // Akses state dengan tipe yang aman
    dispatch(setTheme(!isDark)); // Dispatch action dengan nilai yang diubah
};