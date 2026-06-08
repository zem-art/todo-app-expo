import React, { ReactNode } from 'react';
import { View, Text, KeyboardAvoidingView, ScrollView, Platform, StyleSheet, Dimensions } from 'react-native';
import { Colors } from '@/constants/Colors';
import { IconSymbol } from '@/components/ui/IconSymbol';

interface AuthLayoutProps {
  children: ReactNode;
  subtitle?: string;
  titleFontSize?: number;
}

export function AuthLayout({ children, subtitle, titleFontSize = 50 }: AuthLayoutProps) {
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
            <Text style={[styles.titleText, { fontSize: titleFontSize, marginBottom: subtitle ? 0 : undefined }]}>T O</Text>
            <Text style={[styles.titleText, { fontSize: titleFontSize, marginBottom: subtitle ? 0 : undefined }]}>D O</Text>
            <Text style={[styles.titleText, { fontSize: titleFontSize, marginBottom: subtitle ? 0 : undefined }]}>L I S T</Text>
            <IconSymbol 
              lib="Ionicons" 
              name="checkboxOutline" 
              size={24} 
              color={Colors.primary} 
              style={styles.checkIcon} 
            />
          </View>
          
          {subtitle && <Text style={styles.subtitleText}>{subtitle}</Text>}

          <View style={styles.formContainer}>
            {children}
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
    minHeight: Dimensions.get('window').height - 100,
  },
  titleContainer: {
    alignItems: 'center',
    marginBottom: 40,
    position: 'relative',
  },
  titleText: {
    color: Colors.primary,
    fontWeight: 'bold',
    letterSpacing: 8,
  },
  checkIcon: {
    position: 'absolute',
    right: Dimensions.get('window').width * 0.2,
    top: 0,
  },
  subtitleText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.primary,
    textAlign: 'center',
    marginBottom: 30,
  },
  formContainer: {
    width: '100%',
    paddingHorizontal: 15,
  },
});
