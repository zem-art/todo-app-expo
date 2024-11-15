import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { useState } from "react";
import { StyleSheet, Switch } from 'react-native';

export default function Index() {
  const [isDarkMode, setIsDarkMode] = useState(true);

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

  return (
    <ThemedView style={[styles.container]} isDarkMode={isDarkMode}>
      <ThemedText type="default" isDarkMode={isDarkMode}>
        Edit app/index.tsx to edit this screen.
      </ThemedText>
      <Switch value={isDarkMode} onValueChange={toggleTheme}/>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
});
