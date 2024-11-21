import { Stack } from 'expo-router';

export default function HomeLayout() {
  return (
    <Stack
      screenOptions={{
        headerShadowVisible: false,
        headerShown : false,
        animation: "fade_from_bottom"
      }}
    >
      <Stack.Screen name="index"/>
      <Stack.Screen name="details"/>
      <Stack.Screen name="settings/index"/>
    </Stack>
  );
}
