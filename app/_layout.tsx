import React, { useEffect } from "react";
import { Stack } from "expo-router";
import { useColorScheme } from "@/hooks/useColorScheme.web";
import { useFonts } from "expo-font";
import * as SplashScreen from 'expo-splash-screen';
import { DarkTheme, DefaultTheme, ThemeProvider } from "@react-navigation/native";
import { StatusBar } from "expo-status-bar";
import { Provider, useSelector } from "react-redux";
import { store } from "@/redux/reducer-store";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { AuthProvider, useAuth } from "@/utils/auth-provider";

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
        <AuthProvider>
          <RootLayoutContent/>
        </AuthProvider>
      </Provider>
    </ErrorBoundary>
  )
}

function RootLayoutContent() {
  const { isLogin } = useAuth();
  const colorScheme = useColorScheme();
  const theme = colorScheme === "dark" ? DarkTheme : DefaultTheme;
  // const isLogin = useSelector((state: RootState) => state.AUTH_REDUCER.login)
  console.log('state Asynstore login ===> :',isLogin)

  useEffect(() => {
    console.log("Asynstore state updated:", isLogin);
  }, [isLogin]);

  return(
    <ThemeProvider value={theme}>
      <Stack screenOptions={{ headerShown: false }}>
        {isLogin ? (
          <Stack.Screen name="(home)" options={{ headerShown: false }} />
        ) : (
          <Stack.Screen name="(auth)" options={{ headerShown: false }} />
        )}
        <Stack.Screen name="+not-found" options={{ headerShown: false }} />
      </Stack>
      <StatusBar style="auto" />
    </ThemeProvider>
  )
}
