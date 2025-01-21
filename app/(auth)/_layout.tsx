import { Stack } from 'expo-router';

export default function AuthLayout() {
  console.log("Current layout loaded auth");
  return (
    <Stack
      screenOptions={{
        headerShadowVisible: false,
        headerShown: false,
        animation: "slide_from_right"
      }}
    >
      <Stack.Screen name="index"/>
      <Stack.Screen name="sign-in"/>
      <Stack.Screen name="sign-up"/>
    </Stack>
  );
}
