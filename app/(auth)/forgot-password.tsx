import React, { useState } from 'react';
import { View, Text, StyleSheet, ToastAndroid } from 'react-native';
import { Colors } from '@/constants/Colors';
import { router } from 'expo-router';
import { authService } from '@/services/auth.service';
import { FormDataEmailPayload } from '@/interfaces/auth';
import { validateForm, ValidationSchema } from '@/utils/validators/formData';
import { AuthLayout } from '@/components/auth/AuthLayout';
import { AuthInput } from '@/components/auth/AuthInput';
import { AuthButton } from '@/components/auth/AuthButton';

export default function ForgotPassword() {
  const [formData, setFormData] = useState<FormDataEmailPayload>({ email: '' });
  const [formDataError, setFormDataError] = useState<FormDataEmailPayload>({ email: '' });
  const [isLoading, setIsLoading] = useState(false);

  const signInValidationSchema: ValidationSchema<FormDataEmailPayload> = {
    email: (value: any) => (!value ? "Email is required" : undefined),
  };

  const handleForgotMail = async () => {
    const isValid = validateForm(formData, signInValidationSchema, setFormDataError);
    if (isValid) {
      try {
        setIsLoading(true);
        const data = await authService.forgotPassword(formData.email as string);
        
        if(data.status >= 200 && data.status <= 204) {
          router.push({
            pathname: "/otp-mail",
            params: { email: formData.email }
          });
        } else {
          ToastAndroid.show(data.message || 'Maaf Terjadi Kesalahan Harap Menunggu Beberapa Saat Lagi', ToastAndroid.SHORT);
        }
      } catch (error: any) {
        ToastAndroid.show('Maaf Terjadi Kesalahan Harap Menunggu Beberapa Saat Lagi', ToastAndroid.SHORT);
      } finally {
        setTimeout(() => setIsLoading(false), 500);
      }
    }
  };

  const handleInputChange = (field: keyof FormDataEmailPayload, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setFormDataError({})
  };

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

      <Text style={styles.hintText}>
        * Please check the email you registered, we have sent an OTP code to reset your password.
      </Text>

      <View style={styles.buttonRow}>
        <AuthButton
          title="BACK"
          variant="secondary"
          onPress={() => router.back()}
          disabled={isLoading}
          style={styles.halfButton}
        />
        <AuthButton
          title="SEND"
          onPress={handleForgotMail}
          isLoading={isLoading}
          style={styles.halfButton}
        />
      </View>
    </AuthLayout>
  );
}

const styles = StyleSheet.create({
  hintText: {
    fontSize: 12,
    color: Colors.mediumGray,
    marginBottom: 15,
  },
  buttonRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  halfButton: {
    width: '48%',
  },
});