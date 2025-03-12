import React, { createContext, useContext, useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import LoadingSpinner from "@/components/LoadingSpinner";
import { fetchApi } from "@/utils/helpers/fetchApi.utils";
import { ConfigApiURL } from "@/constants/Config";
import { ToastAndroid } from "react-native";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/redux/reducer-store";
import { setAuthActions } from "@/redux/actions";
interface AuthContextType {
  isLogin: boolean;
  setLogin: (value: boolean, token:string) => void;
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

    let interval: NodeJS.Timeout | null = null;
  
    const checkLoginStatus = async () => {
      try {
        const token = await AsyncStorage.getItem("userToken");
        if (!token) {
          setIsLogin(false);
          dispatch(setAuthActions("", false));
          return;
        }
        const additionalHeaders = {
          Authorization: `Bearer ${token}`,
        };
        // console.log(additionalHeaders)
        const response = await fetchApi(
          `/api${ConfigApiURL.env_url}/auth/${ConfigApiURL.prefix_url}/mobile/user/profile`,
          "GET",
          undefined,
          additionalHeaders,
        )
        
        if (response) {
          setIsLogin(true);
          dispatch(setAuthActions(token, true));
        } else {
          await logout(); // Jika gagal, logout otomatis
        }
      } catch (error:any) {
        if (error?.status === 401) {
          ToastAndroid.show("Sesi Anda telah berakhir", ToastAndroid.SHORT);
          await logout();
        }
        console.error("Error checking login status:", error);
      } finally {
        setIsLoading(false); // Set loading to false after the process is complete
      }
    };

    // Cek pertama dalam 10 detik
    const firstCheck = setTimeout(() => {
      checkLoginStatus();

      // Setelah cek pertama, mulai polling setiap 5 menit
      interval = setInterval(() => {
        checkLoginStatus();
      }, 300000); // 5 menit (300.000 ms)
    }, 1000); // 10 detik (10.000 ms)

    return () => {
      console.log("Cleanup function dijalankan");
      clearTimeout(firstCheck);
      if (interval) clearInterval(interval);
    };
  }, []);

  // Show loading spinner if still loading
  if (isLoading) {
    return <LoadingSpinner color="#FF5733" backgroundColor="#f0f0f0" />;
  }

  // Function to set login status and save token
  const setLogin = async (value: boolean, token:string) => {
    try {
      if (value) {
        await AsyncStorage.setItem("userToken", token); // Simpan token
        dispatch(setAuthActions(token, true));
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
    <AuthContext.Provider value={{ isLogin, setLogin, logout }}>
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
