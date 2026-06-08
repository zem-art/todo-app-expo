import React from 'react';
import { TouchableOpacity, Text, ActivityIndicator, StyleSheet, TouchableOpacityProps } from 'react-native';
import { Colors } from '@/constants/Colors';

interface AuthButtonProps extends TouchableOpacityProps {
  title: string;
  isLoading?: boolean;
  variant?: 'primary' | 'secondary';
}

export function AuthButton({ title, isLoading, variant = 'primary', style, ...props }: AuthButtonProps) {
  const isSecondary = variant === 'secondary';
  
  return (
    <TouchableOpacity
      style={[
        styles.button,
        isSecondary && styles.buttonSecondary,
        style
      ]}
      disabled={isLoading || props.disabled}
      {...props}
    >
      {isLoading ? (
        <ActivityIndicator size="small" color={Colors.background} />
      ) : (
        <Text style={[styles.text, isSecondary && styles.textSecondary]}>
          {title}
        </Text>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: Colors.primary,
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 20,
  },
  buttonSecondary: {
    backgroundColor: Colors.drakGray,
  },
  text: {
    color: Colors.background,
    fontSize: 16,
    fontWeight: 'bold',
    textTransform: 'uppercase',
  },
  textSecondary: {
    color: Colors.background,
  },
});
