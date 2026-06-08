import React, { useEffect, useState } from "react";
import { router, Stack } from "expo-router";
import { useColorScheme } from "@/hooks/useColorScheme.web";
import { useFonts } from "expo-font";
import * as SplashScreen from 'expo-splash-screen';
import { DarkTheme, DefaultTheme, ThemeProvider } from "@react-navigation/native";
import { StatusBar } from "expo-status-bar";
import { Provider } from "react-redux";
import { store } from "@/redux/reducer-store";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { AuthProvider, useAuth } from "@/context/auth-provider";
import { useSegments, useRouter } from 'expo-router';
import { Alert, View } from "react-native";
import * as Updates from 'expo-updates';

import { initializeDatabase } from "@/services/database.service";
import { AnimatedSplashScreen } from "@/components/AnimatedSplashScreen";

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  const [dbInitialized, setDbInitialized] = useState(false);

  useEffect(() => {
    const initDb = async () => {
      try {
        await initializeDatabase();
        console.log("Database initialized successfully!");
        setDbInitialized(true);
      } catch (e) {
        console.log("Database init error:", e);
      }
    };
    initDb();
  }, []);

  useEffect(() => {
    const checkForOTAUpdate = async () => {
      try {
        const update = await Updates.checkForUpdateAsync();

        if (update.isAvailable) {
          await Updates.fetchUpdateAsync();
          Alert.alert(
            'Pembaruan Tersedia',
            'Aplikasi akan dimuat ulang untuk menerapkan pembaruan.',
            [
              {
                text: 'Oke',
                onPress: async () => {
                  await Updates.reloadAsync();
                },
              },
            ]
          );
        }
      } catch (error) {
        console.log('Gagal memeriksa pembaruan:', error);
      }
    };

    checkForOTAUpdate();
  }, []);

  if (!loaded || !dbInitialized) {
    return null;
  }

  return (
    <ErrorBoundary>
      <Provider store={store}>
        <AuthProvider>
          <RootLayoutContent loaded={loaded} dbInitialized={dbInitialized} />
        </AuthProvider>
      </Provider>
    </ErrorBoundary>
  );
}

function RootLayoutContent({ loaded, dbInitialized }: { loaded: boolean, dbInitialized: boolean }) {
  const { isLogin, isLoadingAuth } = useAuth();
  const colorScheme = useColorScheme();
  const isDarkMode = colorScheme === "dark";
  const theme = isDarkMode ? DarkTheme : DefaultTheme;
  const segments = useSegments();
  const router = useRouter();

  const [isSplashAnimationComplete, setSplashAnimationComplete] = useState(false);

  // Hide native splash screen immediately, since AnimatedSplashScreen is covering the screen
  useEffect(() => {
    SplashScreen.hideAsync();
  }, []);

  // Handle routing based on auth state
  useEffect(() => {
    if (isLoadingAuth || !isSplashAnimationComplete) return;

    const inAuthGroup = segments[0] === '(auth)';
    const inHomeGroup = segments[0] === '(home)';

    if (isLogin && !inHomeGroup) {
      router.replace('/(home)/home');
    } else if (!isLogin && !inAuthGroup) {
      router.replace('/(auth)/sign-in');
    }
  }, [isLogin, isLoadingAuth, segments, isSplashAnimationComplete]);

  const isAppReady = loaded && dbInitialized && !isLoadingAuth;

  return (
    <View style={{ flex: 1 }}>
      <ThemeProvider value={theme}>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="(home)" options={{ headerShown: false }} />
          <Stack.Screen name="(auth)" options={{ headerShown: false }} />
          <Stack.Screen name="+not-found" options={{ headerShown: false }} />
        </Stack>
        <StatusBar style="auto" />
      </ThemeProvider>
      
      {!isSplashAnimationComplete && (
        <AnimatedSplashScreen 
          isAppReady={isAppReady} 
          isDarkMode={isDarkMode}
          onAnimationComplete={() => setSplashAnimationComplete(true)} 
        />
      )}
    </View>
  );
}

/**
 * NOTES :
 * Peringatan tersebut muncul karena Anda menggunakan komponen yang tidak sesuai dengan struktur yang diharapkan oleh Stack dari react-navigation. Dalam Stack,
 * semua anak (children) harus berupa komponen Screen.
 * Jika Anda ingin menambahkan komponen lain (seperti loading screen), Anda harus menggunakan komponen Layout kustom.
 * 
 * <Stack screenOptions={{ headerShown: false }}>
      {isLoading ? (
        <Stack.Screen name="Loading" component={LoadingScreen} />
      ) : (
        <>
        SCREEN" YANG LAIN....
        </>
      )}
  </Stack>
 */