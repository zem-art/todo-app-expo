// PasswordScreen.tsx 
import React, { useState } from 'react';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Colors } from '@/constants/Colors';
import { ConfigApiURL } from '@/constants/Config';
import { fetchApi } from '@/utils/helpers/fetchApi.utils';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { FormDataForgotPasswordPayload } from '@/interfaces/auth';
import { validateForm, ValidationSchema } from '@/utils/validators/formData';
import { View, Text, KeyboardAvoidingView, StyleSheet, Platform, TouchableOpacity, ActivityIndicator, Dimensions, ScrollView, TextInput, Pressable, ToastAndroid, BackHandler } from 'react-native';
import { useDoubleBackPress } from '@/utils/helpers/useBackHandler.utils';
import { useIsFocused } from '@react-navigation/native';

export default function PasswordScreenNoAuth() {
  const isFocused = useIsFocused();
  const router = useRouter();
  const { email } = useLocalSearchParams();
  const [formData, setFormData] = useState<FormDataForgotPasswordPayload>({
    password: '',
    confirm_password : '',
  });
  const [formDataError, setFormDataError] = useState<FormDataForgotPasswordPayload>({
    password: '',
    confirm_password: '',
  });
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState<boolean>(false);

  // handle change input text
  const handleInputChange = (field: keyof FormDataForgotPasswordPayload, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setFormDataError({})
  };

  const forgotValidationSchema : ValidationSchema<FormDataForgotPasswordPayload> = {
    password: (value:any) => (!value ? "Password is required" : undefined),
    confirm_password: (value:any) => (!value ? "Confirm Password is required" : undefined),
  };

  const handleForgot = async () => {
    // Implement your logic here
    const isValid = validateForm(formData, forgotValidationSchema, setFormDataError);
    if(formData.password !== formData.confirm_password) {
      setFormDataError((prev) => ({ ...prev, confirm_password: "Password and Confirm Password do not match" }));
      return;
    }
    if (isValid) {
      try {
        setIsLoading(true);
        let base_url = !!ConfigApiURL.env_url ?
          `/api${ConfigApiURL.env_url}/auth/${ConfigApiURL.prefix_url}/mobile/user/reset_password` :
          `/api/auth/${ConfigApiURL.prefix_url}/mobile/user/reset_password`;

        const payload = {
          email : email,
          update_password : formData.password,
        }

        const apiResponse = await fetchApi(
          base_url,
          'POST',
          payload,
        )

        const response = apiResponse.message || apiResponse.data || undefined || null
        // console.log('Response api ==> : ', apiResponse);
        if(apiResponse.status_code >= 200 && apiResponse.status_code <= 204) {
          ToastAndroid.show(response, ToastAndroid.SHORT);
          router.replace('/sign-in')
        } else {
          // console.log('Error Sign ==> : ', response);
          ToastAndroid.show(response?.message || 'Maaf Terjadi Kesalahan Harap Menunggu Beberapa Saat Lagi', ToastAndroid.SHORT);
        }

      } catch (error:any) {
        // console.log('Erorr Sign ==> : ', error)
        ToastAndroid.show('Maaf Terjadi Kesalahan Harap Menunggu Beberapa Saat Lagi', ToastAndroid.SHORT);
      } finally {
        setTimeout(() => {
          setIsLoading(false)
        }, 500);
      }
    }
  };

  // Using the back handler
  useDoubleBackPress(isFocused, () => {
    // console.log("Custom exit logic executed!");
    BackHandler.exitApp(); // Default exit action
  });

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={[styles.container, { backgroundColor: Colors.veryLightGray }]}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 40 : 0}
      >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.content}>
          <View style={styles.titleContainer}>
            <Text style={styles.titleText}>T O</Text>
            <Text style={styles.titleText}>D O</Text>
            <Text style={styles.titleText}>L I S T</Text>
            <IconSymbol lib="Ionicons" name="checkboxOutline" size={24} color={Colors.primary} style={styles.checkIcon}/>
          </View>

          <View style={styles.formContainer}>
            <View style={styles.inputContainer}>
              <TextInput
                style={[styles.input, styles.passwordInput]}
                placeholder="Password"
                value={formData.password}
                onChangeText={(text) => handleInputChange('password', text)}
                secureTextEntry={!showPassword}
              />
              {formDataError.password && 
                <Text style={styles.textError}>{formDataError.password}</Text>
              }
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
            </View>

            <View style={styles.inputContainer}>
              <TextInput
                  style={[styles.input, styles.passwordInput]}
                  placeholder="Confirm Password"
                  value={formData.confirm_password}
                  onChangeText={(text) => handleInputChange('confirm_password', text)}
                  secureTextEntry={!showConfirmPassword}
              />
              {formDataError.confirm_password && 
                <Text style={styles.textError}>{formDataError.confirm_password}</Text>
              }
              <TouchableOpacity
                style={styles.passwordToggle}
                onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                <IconSymbol
                  lib="Ionicons"
                  name={showConfirmPassword ? 'eyeOffOutline' : 'eyeOutline'} 
                  size={24} 
                  color={Colors.drakGray}
                />
              </TouchableOpacity>
            </View>
            <TouchableOpacity style={styles.signInButton} disabled={isLoading} onPress={handleForgot}>
              {isLoading ? 
                <ActivityIndicator size={'small'} color={Colors.background} /> 
              : 
                <Text style={styles.signInText}>upda{''}te</Text>
              }
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
  },
  content: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    minHeight: Dimensions.get('window').height - 100, // Menambahkan minimum height
  },
  titleContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  titleText: {
    fontSize: 50,
    color: Colors.primary,
    fontWeight: 'bold',
    letterSpacing: 8,
  },
  checkIcon: {
    position: 'absolute',
    right: Dimensions.get('window').width * 0.2,
    top: 0,
  },
  formContainer: {
    width: '100%',
    paddingHorizontal: 15,
  },
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
  forgotPassword: {
    alignSelf: 'flex-end',
    marginBottom: 20,
  },
  forgotPasswordText: {
    color: Colors.drakGray,
    fontSize: 14,
  },
  signInButton: {
    backgroundColor: Colors.primary,
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 20,
  },
  signInText: {
    color: Colors.background,
    fontSize: 16,
    fontWeight: 'bold',
    textTransform: 'uppercase',
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
  textError : {
    color: Colors.error,
    marginTop: 5,
  },
});