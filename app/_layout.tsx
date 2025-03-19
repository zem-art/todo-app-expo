import React, { useEffect, useState } from "react";
import { router, Stack } from "expo-router";
import { useColorScheme } from "@/hooks/useColorScheme.web";
import { useFonts } from "expo-font";
import * as SplashScreen from 'expo-splash-screen';
import { DarkTheme, DefaultTheme, ThemeProvider } from "@react-navigation/native";
import { StatusBar } from "expo-status-bar";
import { Provider, useSelector } from "react-redux";
import { store } from "@/redux/reducer-store";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { AuthProvider, useAuth } from "@/context/auth-provider";
import { useNetInfo } from "@react-native-community/netinfo";
import { useNetworkState } from 'expo-network';
import LoadingSpinner from "@/components/LoadingSpinner";

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
  const NetInfo = useNetInfo();
  const networkState = useNetworkState();
  const colorScheme = useColorScheme();
  const theme = colorScheme === "dark" ? DarkTheme : DefaultTheme;

  useEffect(() => {
    // console.log('Network status : ==>', networkState.isConnected);
    if (networkState?.isConnected !== null || 
      networkState.isConnected !== undefined) {
      if (networkState?.isConnected) {
        if (isLogin) {
          router.replace('/(home)/home');
        } else {
          router.replace('/(auth)/sign-in');
        }
      } else {
        router.replace('/network');
      }
    }
  }, [
    isLogin,
    networkState.isConnected,
  ]);

  return(
    <ThemeProvider value={theme}>
      <Stack screenOptions={{ headerShown: false }}>
        {networkState?.isConnected ? (
          <>
            {isLogin ? (
              <Stack.Screen name="(home)" options={{ headerShown: false }} />
            ) : (
              <Stack.Screen name="(auth)" options={{ headerShown: false }} />
            )}
          </>
        ) : (
          <Stack.Screen name="network" options={{ headerShown: false }} />
        )}
        <Stack.Screen name="+not-found" options={{ headerShown: false }} />
      </Stack>
      <StatusBar style="auto" />
    </ThemeProvider>
  )
}
