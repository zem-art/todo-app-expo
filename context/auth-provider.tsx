import React, { createContext, useContext, useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import LoadingSpinner from "@/components/LoadingSpinner";
import { authService } from "@/services/auth.service";
import { ToastAndroid } from "react-native";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/redux/reducer-store";
import { setAuthActions, setUserActions } from "@/redux/actions";

interface AuthContextType {
  isLogin: boolean;
  isLoadingAuth: boolean;
  setLogin: (value: boolean, token: string, data: object) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isLogin, setIsLogin] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const dispatch = useDispatch<AppDispatch>();

  // Check login status when component is first loaded
  useEffect(() => {
    console.log('== USE EFFECT AUTH PROVIDER ===')

    let interval: ReturnType<typeof setInterval> | null = null;

    const checkLoginStatus = async () => {
      try {
        const token = await AsyncStorage.getItem("userToken");
        if (!token) {
          setIsLogin(false);
          dispatch(setAuthActions("", false));
          return;
        }
        const response = await authService.getProfile(token);
        // console.log('==>',response.response)
        if (response.response) {
          setIsLogin(true);
          dispatch(setAuthActions(token, true));
          dispatch(setUserActions(response.response.data, {}, true))
        } else {
          await logout(); // Jika gagal, logout otomatis
        }
      } catch (error: any) {
        if (error?.status === 401) {
          ToastAndroid.show("Your session has expired", ToastAndroid.SHORT);
          await logout();
        }
        // console.error("Error checking login status:", error);
      } finally {
        setIsLoading(false); // Set loading to false after the process is complete
      }
    };

    // Cek pertama dalam 10 detik
    const firstCheck = setTimeout(() => {
      checkLoginStatus();
      console.log("First check login status...");
      // Setelah cek pertama, mulai polling setiap 5 menit
      interval = setInterval(() => {
        checkLoginStatus();
        console.log("Polling login status...");
      }, 120000); // 2 menit = 2 × 60 × 1000 = 180000 ms
      console.log("Polling started...");
    }, 1000); // 10 detik (10.000 ms)

    return () => {
      console.log("Cleanup interval...");
      clearTimeout(firstCheck);
      if (interval) clearInterval(interval);
      console.log("Interval cleared");
    };
  }, [isLogin]);

  // Loading spinner is now handled by splash screen or RootLayoutContent

  // Function to set login status and save token
  const setLogin = async (value: boolean, token: string, data: object) => {
    try {
      if (value) {
        await AsyncStorage.setItem("userToken", token); // Simpan token
        dispatch(setAuthActions(token, true));
        dispatch(setUserActions(data, {}, true));
      } else {
        await AsyncStorage.removeItem("userToken"); // Hapus token
      }
      setIsLogin(value);
    } catch (error) {
      console.error("Error setting login status:", error);
    }
  };

  // Function to logout and delete tokens
  const logout = async () => {
    try {
      await AsyncStorage.removeItem("userToken");
      setIsLogin(false);
      dispatch(setAuthActions('', false))
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };

  // Provider to propagate authentication state to child components
  return (
    <AuthContext.Provider value={{ isLogin, isLoadingAuth: isLoading, setLogin, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// Hook for using authentication context
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
