import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ToastAndroid } from 'react-native';
import { Colors } from '@/constants/Colors';
import { Link, useRouter } from 'expo-router';
import { FormDataSignUpError, FormDataSignUpPayload } from '@/interfaces/auth';
import { authService } from '@/services/auth.service';
import { AuthLayout } from '@/components/auth/AuthLayout';
import { AuthInput } from '@/components/auth/AuthInput';
import { AuthButton } from '@/components/auth/AuthButton';

export default function SignUp() {
  const router = useRouter();
  const [formData, setFormData] = useState<FormDataSignUpPayload>({
    username: '', email: '', password: '', confirm_password: '',
  });
  const [formDataError, setFormDataError] = useState<FormDataSignUpError>({});
  const [isLoading, setIsLoading] = useState(false);

  const validateForm = (formData: FormDataSignUpError, setFormDataError: (errors: FormDataSignUpError) => void) => {
    const errors: FormDataSignUpError = {}
    if (!formData.username) errors.username = "Username is required";
    if (!formData.email) errors.email = "Email is required";
    if (!formData.password) errors.password = "Password is required";
    if (!formData.confirm_password) errors.confirm_password = "Confirm Password is required";
    else if (formData.password != formData.confirm_password) errors.confirm_password = 'Sorry password is not the same'
    else if (Number(formData.password?.length) < 8 || Number(formData.confirm_password?.length) < 8) errors.confirm_password = 'Sorry, the password cannot be less than 8 characters'

    setFormDataError(errors);
    return Object.keys(errors).length === 0; 
  };

  const handleSignUp = async () => {
    if (!validateForm(formData, setFormDataError)) return;

    try {
      setIsLoading(true)
      await authService.register(formData.username as string, formData.email as string, formData.password as string);
      router.replace('/(auth)/sign-in')
      ToastAndroid.show('Berhasil Mendaftar..', ToastAndroid.SHORT);
    } catch (error:any) {
      ToastAndroid.show('Maaf Terjadi Kesalahan Harap Menunggu Beberapa Saat Lagi', ToastAndroid.SHORT);
    } finally {
      setTimeout(() => setIsLoading(false), 500);
    }
  };

  const handleInputChange = (field: keyof FormDataSignUpPayload, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setFormDataError({})
  };
    
  return (
    <AuthLayout>
      <AuthInput
        placeholder="Username"
        value={formData.username}
        onChangeText={(text) => handleInputChange('username', text)}
        autoCapitalize="characters"
        editable={!isLoading}
        error={formDataError.username}
      />

      <AuthInput
        placeholder="Email"
        value={formData.email}
        onChangeText={(text) => handleInputChange('email', text)}
        keyboardType="email-address"
        autoCapitalize="none"
        editable={!isLoading}
        error={formDataError.email}
      />

      <AuthInput
        placeholder="Password"
        value={formData.password}
        onChangeText={(text) => handleInputChange('password', text)}
        isPassword
        editable={!isLoading}
        error={formDataError.password}
      />

      <AuthInput
        placeholder="Confirm Password"
        value={formData.confirm_password}
        onChangeText={(text) => handleInputChange('confirm_password', text)}
        isPassword
        editable={!isLoading}
        error={formDataError.confirm_password}
      />

      <AuthButton title="SIGN UP" onPress={handleSignUp} isLoading={isLoading} />

      <View style={styles.signUpContainer}>
        <Text style={styles.signUpText}>Have an account ? </Text>
        <Link href='/sign-in' asChild>
          <TouchableOpacity>
            <Text style={styles.signUpLink}>Sign in</Text>
          </TouchableOpacity>
        </Link>
      </View>
    </AuthLayout>
  );
}

const styles = StyleSheet.create({
  signUpContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  signUpText: {
    color: Colors.drakGray,
    fontSize: 14,
  },
  signUpLink: {
    color: Colors.primary,
    fontSize: 14,
    fontWeight: 'bold',
  },
});