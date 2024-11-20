import { Link, Stack } from 'expo-router';
import { Button, StyleSheet, Text, View } from 'react-native';

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';

export default function ErrorScreen({ error, resetErrorBoundary }: { error: Error; resetErrorBoundary?: () => void }) {
  const isNotFoundError = error.message.includes('404'); // Identifikasi jika error adalah "404"

  if (isNotFoundError) {
    return (
      <>
        <Stack.Screen options={{ title: 'Oops!' }} />
        <ThemedView style={styles.container}>
          <ThemedText type="title">This screen doesn't exist.</ThemedText>
          {/* <Link href="/(app)" style={styles.link}>
            <ThemedText type="link">Go to home screen!</ThemedText>
          </Link> */}
        </ThemedView>
      </>
    );
  }

  // Penanganan untuk error umum lainnya
  return (
    <View style={styles.containerError}>
      <Text style={styles.titleError}>Oops! Something went wrong.</Text>
      <Text style={styles.messageError}>
        {error.message || 'An unexpected error occurred. Please try again later.'}
      </Text>
      {resetErrorBoundary && (
        <Button
          title="Try Again"
          onPress={resetErrorBoundary}
          color="#007BFF"
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  link: {
    marginTop: 15,
    paddingVertical: 15,
  },

  containerError: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
    padding: 20,
  },
  titleError: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
    color: '#333',
  },
  messageError: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
    color: '#555',
  },
});
