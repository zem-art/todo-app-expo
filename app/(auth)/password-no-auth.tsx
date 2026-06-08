import React, { useState } from 'react';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { ToastAndroid, BackHandler } from 'react-native';
import { authService } from '@/services/auth.service';
import { FormDataForgotPasswordPayload } from '@/interfaces/auth';
import { validateForm, ValidationSchema } from '@/utils/validators/formData';
import { useDoubleBackPress } from '@/utils/helpers/useBackHandler.utils';
import { useIsFocused } from '@react-navigation/native';
import { AuthLayout } from '@/components/auth/AuthLayout';
import { AuthInput } from '@/components/auth/AuthInput';
import { AuthButton } from '@/components/auth/AuthButton';

export default function PasswordScreenNoAuth() {
  const isFocused = useIsFocused();
  const router = useRouter();
  const { email } = useLocalSearchParams();
  const [formData, setFormData] = useState<FormDataForgotPasswordPayload>({ password: '', confirm_password: '' });
  const [formDataError, setFormDataError] = useState<FormDataForgotPasswordPayload>({ password: '', confirm_password: '' });
  const [isLoading, setIsLoading] = useState(false);

  const forgotValidationSchema : ValidationSchema<FormDataForgotPasswordPayload> = {
    password: (value:any) => (!value ? "Password is required" : undefined),
    confirm_password: (value:any) => (!value ? "Confirm Password is required" : undefined),
  };

  const handleForgot = async () => {
    const isValid = validateForm(formData, forgotValidationSchema, setFormDataError);
    if(formData.password !== formData.confirm_password) {
      setFormDataError((prev) => ({ ...prev, confirm_password: "Password and Confirm Password do not match" }));
      return;
    }
    if (isValid) {
      try {
        setIsLoading(true);
        const apiResponse = await authService.resetPassword(email as string, formData.password as string);

        if(apiResponse.status >= 200 && apiResponse.status <= 204) {
          ToastAndroid.show(apiResponse.message, ToastAndroid.SHORT);
          router.replace('/sign-in')
        } else {
          ToastAndroid.show(apiResponse.message || 'Maaf Terjadi Kesalahan Harap Menunggu Beberapa Saat Lagi', ToastAndroid.SHORT);
        }
      } catch (error:any) {
        ToastAndroid.show('Maaf Terjadi Kesalahan Harap Menunggu Beberapa Saat Lagi', ToastAndroid.SHORT);
      } finally {
        setTimeout(() => setIsLoading(false), 500);
      }
    }
  };

  useDoubleBackPress(isFocused, () => {
    BackHandler.exitApp();
  });

  const handleInputChange = (field: keyof FormDataForgotPasswordPayload, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setFormDataError({})
  };

  return (
    <AuthLayout>
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
      
      <AuthButton title="UPDATE" onPress={handleForgot} isLoading={isLoading} />
    </AuthLayout>
  );
}