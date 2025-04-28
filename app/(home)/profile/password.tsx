// PasswordScreen.tsx 
import { IconSymbol } from '@/components/ui/IconSymbol';
import { Colors } from '@/constants/Colors';
import { ConfigApiURL } from '@/constants/Config';
import { useAuth } from '@/context/auth-provider';
import { FormDataForgotPasswordPayload } from '@/interfaces/auth';
import { RootState } from '@/redux/reducer-store';
import { fetchApi } from '@/utils/helpers/fetchApi.utils';
import { validateForm, ValidationSchema } from '@/utils/validators/formData';
import { useIsFocused } from '@react-navigation/native';
import { Link, useRouter } from 'expo-router';
import React, { useState } from 'react';
import { View, Text, KeyboardAvoidingView, StyleSheet, Platform, TouchableOpacity, ActivityIndicator, Dimensions, ScrollView, TextInput, Pressable, ToastAndroid } from 'react-native';
import { useSelector } from 'react-redux';

export default function PasswordScreen() {
  const router = useRouter();
  const isDark = useSelector((state:RootState) => state.THEME_REDUCER.isDark);
  const { data, meta, login }:any = useSelector((state:RootState) => state.USER_REDUCER);
  const [isDarkMode, setIsDarkMode] = useState(isDark);
  const [formData, setFormData] = useState<FormDataForgotPasswordPayload>({
    password: '',
    current_password : '',
    confirm_password: '',
  });
  const [formDataError, setFormDataError] = useState<FormDataForgotPasswordPayload>({
    password: '',
    confirm_password: '',
    current_password : '',
  });
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState<boolean>(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState<boolean>(false);

  // handle change input text
  const handleInputChange = (field: keyof FormDataForgotPasswordPayload, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setFormDataError({})
  };

  const forgotValidationSchema : ValidationSchema<FormDataForgotPasswordPayload> = {
    password: (value:any) => (!value ? "Password is required" : undefined),
    confirm_password: (value:any) => (!value ? "Confirm Password is required" : undefined),
    current_password: (value:any) => (!value ? "Current Password is required" : undefined),
  };

  const handleForgot = async () => {
    // Implement your logic here
    const isValid = validateForm(formData, forgotValidationSchema, setFormDataError);
    if (isValid) {
      try {
        setIsLoading(true)
        let base_url = !!ConfigApiURL.env_url ?
          `/api${ConfigApiURL.env_url}/auth/${ConfigApiURL.prefix_url}/mobile/user/forgot_password` :
          `/api/auth/${ConfigApiURL.prefix_url}/mobile/user/forgot_password`;

        const payload = {
          email : data.email,
          current_password : formData.current_password,
          update_password : formData.password,
        }
        const apiResponse = await fetchApi(
          base_url,
          'POST',
          payload,
        )

        const response = apiResponse.message || apiResponse.data || undefined || null
        // console.log('Response Sign ==> : ', response);
        if(apiResponse.status_code >= 200 && apiResponse.status_code <= 204) {
          ToastAndroid.show(response, ToastAndroid.SHORT);
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

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={[styles.container, { backgroundColor: !isDarkMode ? Colors.veryLightGray : Colors.veryDarkGray }]}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 40 : 0}
      >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.content}>
          <View style={{ position: 'absolute', top: 35, left: 10, height:50 }}>
            {/* <Link href="#" asChild> */}
              <Pressable style={{ padding: 10 }} onPress={() => router.back()}>
                <IconSymbol lib="AntDesign" name="left" size={24} color={isDarkMode ? Colors.veryLightGray : Colors.veryDarkGray} />
              </Pressable>
            {/* </Link> */}
          </View>
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
                placeholder="Current Password"
                value={formData.current_password}
                onChangeText={(text) => handleInputChange('current_password', text)}
                secureTextEntry={!showCurrentPassword}
              />
              {formDataError.current_password && 
                <Text style={styles.textError}>{formDataError.current_password}</Text>
              }
              <TouchableOpacity
                style={styles.passwordToggle}
                onPress={() => setShowCurrentPassword(!showCurrentPassword)}
                >
                <IconSymbol 
                lib="Ionicons"
                name={showCurrentPassword ? 'eyeOffOutline' : 'eyeOutline'} 
                size={24} 
                color={Colors.drakGray}
                />
              </TouchableOpacity>
            </View>

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