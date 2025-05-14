import { Stack } from 'expo-router';

export default function AuthLayout() {
  console.log("Current layout loaded auth");
  return (
    <Stack
      screenOptions={{
        headerShadowVisible: false,
        headerShown: false,
        animation: "fade_from_bottom"
      }}
    >
      <Stack.Screen name="sign-in" options={{ title: "Sign In" }}/>
      <Stack.Screen name="sign-up" options={{ title: "Sign Up" }}/>
      <Stack.Screen name="forgot-password" options={{ title: "Forgot Password" }}/>
      <Stack.Screen name="otp-mail" options={{ title: "Otp Mail" }}/>
    </Stack>
  );
}
