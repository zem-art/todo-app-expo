import React, { useEffect, useState } from 'react';
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
  ActivityIndicator,
  ToastAndroid,
} from 'react-native';
import { IconSymbol } from "@/components/ui/IconSymbol";
import { Colors } from '@/constants/Colors';
import { Link, router } from 'expo-router';
import { useAuth } from '@/context/auth-provider';
import { fetchApi } from '@/utils/helpers/fetchApi.utils';
import { ConfigApiURL } from '@/constants/Config';
import { FormDataEmailPayload } from '@/interfaces/auth';
import { validateForm, ValidationSchema } from '@/utils/validators/formData';

export default function ForgotPassword() {
  const [formData, setFormData] = useState<FormDataEmailPayload>({
    email: 't06496253@gmail.com',
  });
  const [formDataError, setFormDataError] = useState<FormDataEmailPayload>({
    email: '',
  });
  const [isLoading, setIsLoading] = useState(false)

  const signInValidationSchema: ValidationSchema<FormDataEmailPayload> = {
    email: (value: any) => (!value ? "Email is required" : undefined),
  };

  const handleForgotMail = async () => {
    // Implement your login logic here
    const isValid = validateForm(formData, signInValidationSchema, setFormDataError);
    if (isValid) {
      try {
        setIsLoading(true)
        let base_url = !!ConfigApiURL.env_url ?
          `/api${ConfigApiURL.env_url}/auth/${ConfigApiURL.prefix_url}/mobile/user/forgot_password_email` :
          `/api/auth/${ConfigApiURL.prefix_url}/mobile/user/forgot_password_email`;

        const data = await fetchApi(
          base_url,
          'POST',
          formData,
        )

        console.log('Response : ', data);
        
        const response = data.response || data.data || undefined || null
        if(data.status_code >= 200 && data.status_code <= 204) {
          router.push({
            pathname: "/otp-mail",
            params: { email: formData.email }
          });
        } else {
          console.log('Error : ', response);
          ToastAndroid.show(response?.message || 'Maaf Terjadi Kesalahan Harap Menunggu Beberapa Saat Lagi', ToastAndroid.SHORT);
        }
      } catch (error: any) {
        // console.log('Erorr Sign ==> : ', error)
        ToastAndroid.show('Maaf Terjadi Kesalahan Harap Menunggu Beberapa Saat Lagi', ToastAndroid.SHORT);
      } finally {
        setTimeout(() => {
          setIsLoading(false)
        }, 500);
      }
    }
  };

  // handle change input text
  const handleInputChange = (field: keyof FormDataEmailPayload, value: string) => {
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
            <IconSymbol lib="Ionicons" name="checkboxOutline" size={24} color={Colors.primary} style={styles.checkIcon} />
          </View>

          <View style={styles.formContainer}>
            <View style={[styles.inputContainer, { marginBottom: 10 }]}>
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

            <View style={[styles.inputContainer, { paddingHorizontal: 7 }]}>
              <Text style={[styles.textError, { fontSize: 12, color: Colors.mediumGray }]}>
                * Please check the email you registered, we have sent an OTP code to reset your password.</Text>
            </View>

            <View style={[styles.inputContainer]}>
              <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                <TouchableOpacity disabled={isLoading} style={[styles.signInButton, { backgroundColor: Colors.drakGray }]} onPress={() => router.back()}>
                  <Text style={styles.signInText}>bac{''}k</Text>
                </TouchableOpacity>

                <TouchableOpacity disabled={isLoading} style={styles.signInButton} onPress={handleForgotMail}>
                  {isLoading ?
                    <ActivityIndicator size={'small'} color={Colors.background} />
                    :
                    <Text style={styles.signInText}>send</Text>
                  }
                </TouchableOpacity>
              </View>
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
  rememberMeForgotPass: {
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  checkbox: {
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
    width: '48%',
  },
  signInText: {
    color: Colors.background,
    fontSize: 16,
    fontWeight: 'bold',
    textTransform: 'uppercase',
  },
  textError: {
    color: Colors.error,
    marginTop: 5,
  },
});