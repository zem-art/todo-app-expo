import { setTheme } from "../store/theme-store"

export const setThemeActions = (dispatch:any, getState:any) => {
    console.log('==>',getState());
    const { isDark } = getState().SYSTEM_THEME
    dispatch(setTheme(!isDark))
};