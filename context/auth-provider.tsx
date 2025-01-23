import React, { createContext, useContext, useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import LoadingSpinner from "@/components/LoadingSpinner";

interface AuthContextType {
  isLogin: boolean;
  setLogin: (value: boolean) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const router = useRouter();
  const [isLogin, setIsLogin] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Cek status login saat komponen pertama kali dimuat
  useEffect(() => {
    const checkLoginStatus = async () => {
      try {
        const token = await AsyncStorage.getItem("userToken");
        setIsLogin(!!token);

        if (token) {
          router.replace("/(home)/home");
        } else {
          router.replace("/(auth)/sign-in");
        }
      } catch (error) {
        console.error("Error checking login status:", error);
      } finally {
        setIsLoading(false); // Set loading ke false setelah proses selesai
      }
    };

    checkLoginStatus();
  }, [router]);

  // Tampilkan spinner loading jika masih memuat
  if (isLoading) {
    // return <LoadingSpinner color="#FF5733" backgroundColor="#f0f0f0" />;
    return null;
  }

  // Fungsi untuk set login status dan menyimpan token
  const setLogin = async (value: boolean) => {
    try {
      if (value) {
        await AsyncStorage.setItem("userToken", "dummy-token"); // Simpan token
      } else {
        await AsyncStorage.removeItem("userToken"); // Hapus token
      }
      setIsLogin(value);
    } catch (error) {
      console.error("Error setting login status:", error);
    }
  };

  // Fungsi untuk logout dan menghapus token
  const logout = async () => {
    try {
      await AsyncStorage.removeItem("userToken");
      setIsLogin(false);
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };

  // Provider untuk menyebarkan state autentikasi ke komponen anak
  return (
    <AuthContext.Provider value={{ isLogin, setLogin, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// Hook untuk menggunakan context autentikasi
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
