import { Stack } from 'expo-router';

export default function HomeLayout() {
  console.log("Current layout loaded app");
  return (
    <Stack
      screenOptions={{
        headerShadowVisible: false,
        headerShown : false,
        animation: "fade_from_bottom"
      }}
    >
      <Stack.Screen name="home"/>
      <Stack.Screen name="details"/>
      <Stack.Screen name="settings/index"/>
      <Stack.Screen name="history/index"/>
      <Stack.Screen name="profile/password"/>
    </Stack>
  );
}
