import React, { useEffect, useState } from 'react';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { View, Text, TouchableOpacity, StyleSheet, BackHandler, ToastAndroid } from 'react-native';
import Checkbox from 'expo-checkbox';
import { Colors } from '@/constants/Colors';
import { Link } from 'expo-router';
import { useIsFocused } from '@react-navigation/native';
import { useDoubleBackPress } from '@/utils/helpers/useBackHandler.utils';
import { useAuth } from '@/context/auth-provider';
import { authService } from '@/services/auth.service';
import { FormDataSignInError, FormDataSignInPayload } from '@/interfaces/auth';
import { validateForm, ValidationSchema } from '@/utils/validators/formData';
import { AuthLayout } from '@/components/auth/AuthLayout';
import { AuthInput } from '@/components/auth/AuthInput';
import { AuthButton } from '@/components/auth/AuthButton';

export default function SignIn() {
  const { setLogin } = useAuth();
  const isFocused = useIsFocused();
  const [formData, setFormData] = useState<FormDataSignInPayload>({ email: '', password: '' });
  const [formDataError, setFormDataError] = useState<FormDataSignInError>({ email: '', password: '' });
  const [isChecked, setChecked] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState(false);

  const signInValidationSchema: ValidationSchema<FormDataSignInError> = {
    email: (value: any) => (!value ? "Email is required" : undefined),
    password: (value: any) => (!value ? "Password is required" : undefined),
  };

  const handleLogin = async () => {
    const isValid = validateForm(formData, signInValidationSchema, setFormDataError);
    if (isValid) {
      try {
        setIsLoading(true)
        const data = await authService.login(formData.email, formData.password);
        if (data && data.token) {
          setLogin(true, data.token, data.user)
          ToastAndroid.show('Selamat, Anda telah berhasil login', ToastAndroid.SHORT);
          if (isChecked) {
            saveRememberMe(formData)
          } else {
            await AsyncStorage.removeItem("remember_me");
          }
        } else {
          ToastAndroid.show('Login failed', ToastAndroid.SHORT);
        }
      } catch (error: any) {
        console.log('==ERROR =>', error.message)
        ToastAndroid.show('Maaf Terjadi Kesalahan Harap Menunggu Beberapa Saat Lagi', ToastAndroid.SHORT);
      } finally {
        setTimeout(() => setIsLoading(false), 500);
      }
    }
  };

  useDoubleBackPress(isFocused, () => {
    BackHandler.exitApp();
  });

  const handleInputChange = (field: keyof FormDataSignInPayload, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setFormDataError({})
  };

  const saveRememberMe = async (value: any) => {
    await AsyncStorage.setItem("remember_me", JSON.stringify(value));
  };

  const getRememberMe = async () => {
    const value = await AsyncStorage.getItem("remember_me");
    return value ? JSON.parse(value) : {};
  };

  useEffect(() => {
    getRememberMe().then((data: any) => {
      try {
        if (data.email && data.password) {
          setFormData(data)
          setChecked(true);
        }
      } catch (error) {
        console.log('Error parsing remember me data:', error);
      }
    });
  }, []);

  return (
    <AuthLayout>
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

      <View style={styles.rememberMeForgotPass}>
        <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center' }} onPress={() => setChecked(!isChecked)}>
          <Checkbox style={styles.checkbox} value={isChecked} onValueChange={() => setChecked(!isChecked)} color={isChecked ? Colors.primary : undefined} />
          <Text style={styles.forgotPasswordText}>remember me</Text>
        </TouchableOpacity>

        <Link href='/forgot-password' asChild>
          <TouchableOpacity>
            <Text style={styles.forgotPasswordText}>forgot password?</Text>
          </TouchableOpacity>
        </Link>
      </View>

      <AuthButton title="SIGN IN" onPress={handleLogin} isLoading={isLoading} />

      <View style={styles.signUpContainer}>
        <Text style={styles.signUpText}>Don't have an account? </Text>
        <Link href='/sign-up' asChild>
          <TouchableOpacity>
            <Text style={styles.signUpLink}>Sign up</Text>
          </TouchableOpacity>
        </Link>
      </View>
    </AuthLayout>
  );
}

const styles = StyleSheet.create({
  rememberMeForgotPass: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  checkbox: {
    marginRight: 10,
  },
  forgotPasswordText: {
    color: Colors.drakGray,
    fontSize: 14,
    textTransform: 'capitalize',
  },
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