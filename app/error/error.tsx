import { Button, StyleSheet, Text, View } from 'react-native';

export default function ErrorScreen({ 
  error, 
  resetErrorBoundary 
}: { 
    error: Error | null; // Mengizinkan null
    resetErrorBoundary?: () => void 
}) {
  return (
    <View style={styles.containerError}>
      <Text style={styles.titleError}>Oops! Something went wrong.</Text>
      <Text style={styles.messageError}>
        {error?.message || 'An unexpected error occurred. Please try again later.'}
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
