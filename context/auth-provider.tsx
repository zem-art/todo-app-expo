import React, { createContext, useContext, useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface AuthContextType {
  isLogin: boolean;
  setLogin: (value: boolean) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isLogin, setIsLogin] = useState<boolean>(false);

  useEffect(() => {
    const checkLoginStatus = async () => {
      const token = await AsyncStorage.getItem("userToken");
      setIsLogin(!!token);
    };
    checkLoginStatus();
  }, []);

  const setLogin = async (value: boolean) => {
    if (value) {
      await AsyncStorage.setItem("userToken", "dummy-token"); // Simpan token
    } else {
      await AsyncStorage.removeItem("userToken"); // Hapus token
    }
    setIsLogin(value);
  };

  const logout = async () => {
    await AsyncStorage.removeItem("userToken");
    setIsLogin(false);
  };

  return (
    <AuthContext.Provider value={{ isLogin, setLogin, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
