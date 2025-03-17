// LoginScreen.tsx
import React, { useEffect, useState } from 'react';
import AsyncStorage from "@react-native-async-storage/async-storage";
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
  BackHandler,
  ActivityIndicator,
  ToastAndroid,
} from 'react-native';
import Checkbox from 'expo-checkbox';
import { IconSymbol } from "@/components/ui/IconSymbol";
import { Colors } from '@/constants/Colors';
import { Link } from 'expo-router';
import { useIsFocused } from '@react-navigation/native';
import { useDoubleBackPress } from '@/utils/helpers/useBackHandler.utils';
import { useAuth } from '@/context/auth-provider';
import { fetchApi } from '@/utils/helpers/fetchApi.utils';
import { ConfigApiURL } from '@/constants/Config';
import { FormDataSignInError, FormDataSignInPayload } from '@/interfaces/auth';
import { validateForm, ValidationSchema } from '@/utils/validators/formData';


export default function SignIn() {
  const { setLogin } = useAuth();
  const isFocused = useIsFocused();
  const [isChecked, setChecked] = useState<boolean>(false);
  const [formData, setFormData] = useState<FormDataSignInPayload>({
    email: '',
    password: '',
  });
  const [formDataError, setFormDataError] = useState<FormDataSignInError>({
    email: '',
    password: '',
  });

  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState<boolean>(false);

  const signInValidationSchema : ValidationSchema<FormDataSignInError> = {
    email: (value:any) => (!value ? "Email is required" : undefined),
    password: (value:any) => (!value ? "Password is required" : undefined),
  };

  const handleLogin = async () => {
    // Implement your login logic here

    const isValid = validateForm(formData, signInValidationSchema, setFormDataError);
    if (isValid) {
      try {
        setIsLoading(true)
        const data = await fetchApi(
          `/api${ConfigApiURL.env_url}/auth/${ConfigApiURL.prefix_url}/mobile/user/sign_in`,
          'POST',
          formData,
        )
        // console.log(data)
        const token = data.response.token || undefined || null
        if(data.status_code >= 200 && data.status_code <= 204 && token) {
          setLogin(true, token, data.response.data) 
          ToastAndroid.show('Selamat, Anda telah berhasil login', ToastAndroid.SHORT);
          if(isChecked) {
            saveRememberMe(formData)
          } else {
            await AsyncStorage.removeItem("remember_me");
          }
        }
      } catch (error:any) {
        ToastAndroid.show('Maaf Terjadi Kesalahan Harap Menunggu Beberapa Saat Lagi', ToastAndroid.SHORT);
        console.log('Erorr ==> : ', error)
      } finally {
        setTimeout(() => {
          setIsLoading(false)
        }, 500);
      }
    }
  };

  // Using the back handler
  useDoubleBackPress(isFocused, () => {
    console.log("Custom exit logic executed!");
    BackHandler.exitApp(); // Default exit action
  });

  // handle change input text
  const handleInputChange = (field: keyof FormDataSignInPayload, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setFormDataError({})
  };

  const saveRememberMe = async (value:any) => {
    await AsyncStorage.setItem("remember_me", JSON.stringify(value));
  };

  const getRememberMe = async () => {
    const value = await AsyncStorage.getItem("remember_me");
    return value ? JSON.parse(value) : false;
  };

  useEffect(() => {
    getRememberMe().then((data:any) => {
      if (data) {
        setFormData(data)
        setChecked(true);
      }
    });
  }, []);

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
                  placeholder="Email"
                  value={formData.email}
                  onChangeText={(text) => handleInputChange('email', text)}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  editable={!isLoading}
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
                  editable={!isLoading}
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

              <View style={styles.rememberMeForgotPass}>
                <TouchableOpacity style={[styles.forgotPassword, { flexDirection : 'row'}]} onPress={() => setChecked(!isChecked)}>
                  <Checkbox style={styles.checkbox} value={isChecked} color={isChecked ? Colors.primary : undefined}/>
                  <Text style={styles.forgotPasswordText}>remember{' '}me</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.forgotPassword}>
                  <Text style={styles.forgotPasswordText}>forgot{' '}password?</Text>
                </TouchableOpacity>
              </View>

              <TouchableOpacity disabled={isLoading} style={styles.signInButton} onPress={handleLogin}>
                {isLoading ?
                  <ActivityIndicator size={'small'} color={Colors.background} /> 
                :
                  <Text style={styles.signInText}>SIGN IN</Text>
                }
              </TouchableOpacity>

              <View style={styles.signUpContainer}>
                <Text style={styles.signUpText}>Don't have an account? </Text>
                <Link href='/sign-up' asChild>
                  <TouchableOpacity>
                    <Text style={styles.signUpLink}>Sign up</Text>
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
  rememberMeForgotPass : { 
    flexDirection: 'row',
    justifyContent:'space-between'
  },
  checkbox : {
    marginRight: 10,
  },
  forgotPassword: {
    alignSelf: 'flex-end',
    marginBottom: 20,
  },
  forgotPasswordText: {
    color: Colors.drakGray,
    fontSize: 14,
    textTransform: 'capitalize'
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