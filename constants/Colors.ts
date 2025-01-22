/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

const tintColorLight = '#0a7ea4';
const tintColorDark = '#fff';

export const Colors = {
  primary: '#FF9A8B',
  secondary: '#F76C6A',
  background: '#FFFFFF',
  error: '#FF0000',
  success: '#00FF00',
  borderLight: "#DDDDDD",
  drakGray: '#666666',
  mediumGray : '#A0A0A0',
  veryDarkGray : '#1C1C1C',
  veryLightGray : '#F0F0F0',
  grayishDarkGreen : '#47663B',
  light: {
    text: '#11181C',
    // background: '#fff',
    background: '#F0F0F0',
    tint: tintColorLight,
    icon: '#687076',
    tabIconDefault: '#687076',
    tabIconSelected: tintColorLight,
  },
  dark: {
    text: '#ECEDEE',
    // background: '#151718',
    background: '#1C1C1C',
    tint: tintColorDark,
    icon: '#9BA1A6',
    tabIconDefault: '#9BA1A6',
    tabIconSelected: tintColorDark,
  },
};
