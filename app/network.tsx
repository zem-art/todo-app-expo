import { StyleSheet, Image } from 'react-native'
import React from 'react'
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';

export default function Network() {
  return (
    <>
        <ThemedView style={styles.container}>
            <Image
                source={require('@/assets/images/disconnect.png')}
                style={[styles.reactLogo]}
            />
            <ThemedText type="subtitle">Oops...!</ThemedText>
            <ThemedText type="subtitle">Looks like you're offline 😢</ThemedText>
        </ThemedView>
    </>
  )
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      padding: 20,
    },
    link: {
      marginTop: 15,
      paddingVertical: 15,
    },
    reactLogo: {
      height: '30%',
      width: '60%',
      marginBottom: 10,
    }
  });