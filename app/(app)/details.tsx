import { Container } from '@/components/Container'
import { ThemedView } from '@/components/ThemedView';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { RootState } from '@/redux/reducer-store';
import { useNavigation } from '@react-navigation/native';
import { useLocalSearchParams, useRouter } from 'expo-router/build/hooks';
import React, { useEffect, useState } from 'react'
import { Pressable, StyleSheet, Text, View } from 'react-native'
import { useSelector } from 'react-redux';

export default function DetailsScreen() {
    const router = useRouter()
    const navigation = useNavigation();
    const { id, createdAt, completed, description } =  useLocalSearchParams();
    const isDark = useSelector((state:RootState) => state.THEME_REDUCER.isDark);
    const [isDarkMode, setIsDarkMode] = useState(isDark);

    useEffect(() => {
        const unsubscribe = navigation.addListener('focus', () => {
          // Log makesure state Redux
          console.log('Refreshed Detail State:', isDark);
        });
        setIsDarkMode(isDark)
        // Clean up listeners when component is unmounted
        return unsubscribe;
      }, [navigation, isDark]);

    return (
        <Container style={[styles.container]} isDarkMode={isDarkMode}>
            <ThemedView style={[styles.header, { backgroundColor : 'white' }]}>
                <Pressable style={[styles.buttonBack]} onPress={() => router.back()}>
                    <IconSymbol lib="AntDesign" name="left" size={24} />
                </Pressable>
                <ThemedView style={[styles.CrudTodos]}>
                    <Pressable style={[styles.buttonBack]}>
                        <IconSymbol lib="AntDesign" name="clockcircleo" size={24} />
                    </Pressable>
                    <Pressable style={[styles.buttonBack, { marginHorizontal: 10}]}>
                        <IconSymbol lib="AntDesign" name="edit" size={24} />
                    </Pressable>
                    <Pressable style={[styles.buttonBack]}>
                        <IconSymbol lib="AntDesign" name="delete" size={24} />
                    </Pressable>
                </ThemedView>
            </ThemedView>
        </Container>
    )
}

const styles = StyleSheet.create({
    container: {},
    header : {
        height : '7%',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 10,
    },
    buttonBack : {},
    CrudTodos : {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    }
})