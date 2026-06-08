import React, { useState } from 'react';
import { View, TextInput, Text, TouchableOpacity, StyleSheet, TextInputProps } from 'react-native';
import { Colors } from '@/constants/Colors';
import { IconSymbol } from '@/components/ui/IconSymbol';

interface AuthInputProps extends TextInputProps {
  error?: string;
  isPassword?: boolean;
}

export function AuthInput({ error, isPassword, style, ...props }: AuthInputProps) {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <View style={styles.inputContainer}>
      <TextInput
        style={[styles.input, isPassword && styles.passwordInput, style]}
        secureTextEntry={isPassword && !showPassword}
        {...props}
      />
      {error ? <Text style={styles.textError}>{error}</Text> : null}
      
      {isPassword && (
        <TouchableOpacity
          style={styles.passwordToggle}
          onPress={() => setShowPassword(!showPassword)}
        >
          <IconSymbol
            lib="Ionicons"
            name={showPassword ? 'eyeOffOutline' : 'eyeOutline'}
            size={24}
            color={Colors.drakGray}
          />
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  inputContainer: {
    marginBottom: 15,
    position: 'relative',
  },
  input: {
    borderWidth: 1,
    borderColor: Colors.borderLight,
    borderRadius: 8,
    padding: 15,
    fontSize: 16,
    backgroundColor: Colors.background,
  },
  passwordInput: {
    paddingRight: 50,
  },
  passwordToggle: {
    position: 'absolute',
    right: 15,
    top: 15,
  },
  textError: {
    color: Colors.error,
    marginTop: 5,
    fontSize: 12,
  },
});
