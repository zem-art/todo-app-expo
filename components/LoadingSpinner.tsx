import React from 'react';
import { ActivityIndicator, View, StyleSheet } from 'react-native';

interface LoadingSpinnerProps {
  size?: 'small' | 'large'; // Ukuran spinner (default: 'large')
  color?: string; // Warna spinner (default: '#0000ff')
  backgroundColor?: string; // Warna latar belakang (default: 'rgba(0, 0, 0, 0.1)')
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = 'large',
  color = '#0000ff',
  backgroundColor = 'rgba(0, 0, 0, 0.1)',
}) => {
  return (
    <View style={[styles.container, { backgroundColor }]}>
      <ActivityIndicator size={size} color={color} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    height: '100%',
  },
});

export default LoadingSpinner;