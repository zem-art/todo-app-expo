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
    const checkLoginStatus = async () => {
      try {
        const token = await AsyncStorage.getItem("userToken");
        const additionalHeaders = {
          Authorization: `Bearer ${token}`,
        };
        // console.log(additionalHeaders)
        await fetchApi(
          `/api${ConfigApiURL.env_url}/auth/${ConfigApiURL.prefix_url}/mobile/user/profile`,
          "GET",
          undefined,
          additionalHeaders,
        )
        .then((data) => {
          // console.log("Response data :", data.response.data)
          setIsLogin(!!token)
          dispatch(setAuthActions(token || '', true)) // setToken to Redux
        })
        .catch(async (error) => {
            // console.error("Error ===>:", error.status)
            setIsLogin(false)
            await AsyncStorage.removeItem("userToken");
            dispatch(setAuthActions('', false)) // setToken to Redux
            ToastAndroid.show('Sesi Anda telah berakhir', ToastAndroid.SHORT)
          }
        );
      } catch (error) {
        console.error("Error checking login status:", error);
      } finally {
        setIsLoading(false); // Set loading to false after the process is complete
      }
    };

    checkLoginStatus();
  }, [isLogin]);

  // Show loading spinner if still loading
  if (isLoading) {
    return <LoadingSpinner color="#FF5733" backgroundColor="#f0f0f0" />;
  }

  // Function to set login status and save token
  const setLogin = async (value: boolean, token:string) => {
    try {
      if (value) {
        await AsyncStorage.setItem("userToken", token); // Simpan token
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
