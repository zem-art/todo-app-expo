import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  ToastAndroid,
  ActivityIndicator,
} from 'react-native';
import { IconSymbol } from "@/components/ui/IconSymbol";
import { Colors } from '@/constants/Colors';
import { Link, useRouter } from 'expo-router';
import { FormDataSignUpError, FormDataSignUpPayload } from '@/interfaces/auth';
import { ConfigApiURL } from '@/constants/Config';
import { fetchApi } from '@/utils/helpers/fetchApi.utils';

export default function SignUp() {
  const router = useRouter();
  const [formData, setFormData] = useState<FormDataSignUpPayload>({
    username: '',
    email: '',
    password: '',
    confirm_password: '',
  });
  const [formDataError, setFormDataError] = useState<FormDataSignUpError>({
    username: '',
    email: '',
    password: '',
    confirm_password: '',
  });
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState<boolean>(false);

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
    // Implement your login logic here
    // console.log('Sign Up attempt with:', formData);

    if (!validateForm(formData, setFormDataError)) return;

    try {
      setIsLoading(true)
      const data = await fetchApi(
        `/api${ConfigApiURL.env_url}/auth/${ConfigApiURL.prefix_url}/mobile/user/sign_up`,
        'POST',
        formData,
      )
      // console.log('==>',data)
      if(data.status_code >= 200 && data.status_code <= 204) 
        router.replace('/(auth)/sign-in')
        ToastAndroid.show('Berhasil Mendaftar..', ToastAndroid.SHORT);
    } catch (error) {
      ToastAndroid.show('Maaf Terjadi Kesalahan Harap Menunggu Beberapa Saat Lagi', ToastAndroid.SHORT);
      console.log('Erorr ==> : ', error)
    } finally {
      setTimeout(() => {
        setIsLoading(false)
      }, 500);
    }
  };

  // handle change input text
  const handleInputChange = (field: keyof FormDataSignUpPayload, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setFormDataError({})
  };
    
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={styles.container}
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
                style={styles.input}
                placeholder="Username"
                value={formData.username}
                onChangeText={(text) => handleInputChange('username', text)}
                keyboardType="default"
                autoCapitalize="characters"
              />
              {formDataError.username && 
                <Text style={styles.textError}>{formDataError.username}</Text>
              }
            </View>

            <View style={styles.inputContainer}>
              <TextInput
                style={[styles.input]}
                placeholder="Email"
                value={formData.email}
                onChangeText={(text) => handleInputChange('email', text)}
                keyboardType="email-address"
                autoCapitalize="none"
              />
              {formDataError.email && 
                <Text style={styles.textError}>{formDataError.email}</Text>
              }
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

            <TouchableOpacity style={styles.signInButton} disabled={isLoading} onPress={handleSignUp}>
              {isLoading ? 
                <ActivityIndicator size={'small'} color={Colors.background} /> 
              : 
              <Text style={styles.signInText}>SIGN UP</Text>
              }
            </TouchableOpacity>

            <View style={styles.signUpContainer}>
              <Text style={styles.signUpText}>Have an account ? </Text>
              <Link href='/sign-in' asChild>
                <TouchableOpacity>
                  <Text style={styles.signUpLink}>Sign in</Text>
                </TouchableOpacity>
              </Link>
            </View>
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