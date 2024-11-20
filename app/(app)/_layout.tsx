import { Stack } from 'expo-router';

export default function HomeLayout() {
  return (
    <Stack
      screenOptions={{
        headerShadowVisible: false,
        animation: "fade_from_bottom"
      }}
    >
      <Stack.Screen name="index" options={{ headerShown : false }}/>
      <Stack.Screen name="details" options={{ headerShown : false }}/>
      <Stack.Screen name="settings/index" options={{ headerShown : false }}/>
    </Stack>
  );
}
