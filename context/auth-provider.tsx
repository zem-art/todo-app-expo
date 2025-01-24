import React, { createContext, useContext, useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import LoadingSpinner from "@/components/LoadingSpinner";
interface AuthContextType {
  isLogin: boolean;
  setLogin: (value: boolean) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isLogin, setIsLogin] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Check login status when component is first loaded
  useEffect(() => {
    const checkLoginStatus = async () => {
      try {
        const token = await AsyncStorage.getItem("userToken");
        setIsLogin(!!token);
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
  const setLogin = async (value: boolean, token='dummy-token') => {
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
