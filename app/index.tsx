import { Redirect } from "expo-router";
import React from "react";
import { useAuth } from "@/context/auth-provider";


export default function AppIndex() {
  const { isLogin } = useAuth();

  return (
    <Redirect href={isLogin ? "/(home)/home" : "/(auth)/sign_in"} />
  );
}