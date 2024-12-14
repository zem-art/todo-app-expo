import React, { useEffect } from "react";
import { Stack } from "expo-router";
import { useColorScheme } from "@/hooks/useColorScheme.web";
import { useFonts } from "expo-font";
import * as SplashScreen from 'expo-splash-screen';
import { DarkTheme, DefaultTheme, ThemeProvider } from "@react-navigation/native";
import { StatusBar } from "expo-status-bar";
import { Provider, useSelector } from "react-redux";
import { RootState, store } from "@/redux/reducer-store";
import { ErrorBoundary } from "@/components/ErrorBoundary";

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <ErrorBoundary>
      <Provider store={store}>
        <RootLayoutContent/>
      </Provider>
    </ErrorBoundary>
  )
}

function RootLayoutContent() {
  const colorScheme = useColorScheme();
  const isLogin = useSelector((state: RootState) => state.AUTH_REDUCER.login)
  console.log('state redux login ===> :',isLogin) 

  return(
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
        <Stack initialRouteName={isLogin ? "(app)" : "(auth)"}>
          <Stack.Screen name="(auth)" options={{ headerShown : false }}/>
          <Stack.Screen name="(app)" options={{ headerShown : false }}/>
          <Stack.Screen name="+not-found" options={{ headerShown : false }}/>
        </Stack>
        <StatusBar style="auto" />
    </ThemeProvider>
  )
}
