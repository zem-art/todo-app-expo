import { Container } from '@/components/Container'
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { Colors } from '@/constants/Colors';
import { RootState } from '@/redux/reducer-store';
import { useNavigation } from '@react-navigation/native';
import { useLocalSearchParams, useRouter } from 'expo-router/build/hooks';
import React, { useEffect, useState } from 'react'
import { Alert, Pressable, StyleSheet, Text, View } from 'react-native'
import { useSelector } from 'react-redux';

export default function DetailsScreen() {
    const router = useRouter()
    const navigation = useNavigation();
    const { id, createdAt, completed, description, title } =  useLocalSearchParams();
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

    const handleNavigation = (params:string) => {
        switch (params) {
            case 'add':
                Alert.alert('Add pressed')
                break;
            case 'edit':
                Alert.alert('Edit pressed')
                break;
            default:
                Alert.alert('Delete pressed')
                break;
        }
    }

    return (
        <Container style={[styles.container, { backgroundColor : !isDarkMode ? Colors.veryLightGray : Colors.veryDarkGray }]} isDarkMode={isDarkMode}>
            <ThemedView style={[styles.header, { backgroundColor : !isDarkMode ? Colors.background : Colors.veryDarkGray }]}>
                <Pressable style={[styles.buttonBack]} onPress={() => router.back()}>
                    <IconSymbol lib="AntDesign" name="left" size={24} color={isDarkMode ? Colors.veryLightGray : Colors.veryDarkGray} />
                </Pressable>
                <ThemedView style={[styles.CrudTodos, { backgroundColor : !isDarkMode ? Colors.background : Colors.veryDarkGray }]}>
                    <Pressable style={[styles.buttonBack]} onPress={() => handleNavigation('add')}>
                        <IconSymbol lib="AntDesign" name="clockcircleo" size={24} color={isDarkMode ? Colors.veryLightGray : Colors.veryDarkGray} />
                    </Pressable>
                    <Pressable style={[styles.buttonBack, { marginHorizontal: 15}]} onPress={() => handleNavigation('edit')}>
                        <IconSymbol lib="AntDesign" name="edit" size={24} color={isDarkMode ? Colors.veryLightGray : Colors.veryDarkGray} />
                    </Pressable>
                    <Pressable style={[styles.buttonBack, { marginRight : 10}]} onPress={() => handleNavigation('delete')}>
                        <IconSymbol lib="AntDesign" name="delete" size={24} color={isDarkMode ? Colors.veryLightGray : Colors.veryDarkGray} />
                    </Pressable>
                </ThemedView>
            </ThemedView>

            <ThemedView style={[styles.content, { backgroundColor : !isDarkMode ? Colors.background : Colors.veryDarkGray }]}>
                <ThemedView style={[styles.created_at, { backgroundColor : !isDarkMode ? Colors.background : Colors.veryDarkGray }]}>
                    <ThemedText isDarkMode={isDarkMode}>Date : {createdAt}</ThemedText>
                </ThemedView>
                <ThemedView style={[styles.contentTitle, { backgroundColor : !isDarkMode ? Colors.background : Colors.veryDarkGray }]}>
                    <ThemedText isDarkMode={isDarkMode} style={[styles.titleContent]}>{title}</ThemedText>
                </ThemedView>
                <ThemedView style={[styles.descriptionContent, { backgroundColor : !isDarkMode ? Colors.background : Colors.veryDarkGray }]}>
                     <ThemedText isDarkMode={isDarkMode} style={[styles.description]}>{description}</ThemedText>
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
    },
    content : {
        flex: 1 
    },
    created_at: {
        paddingHorizontal: 20,
        paddingTop: 10,
        paddingBottom: 10
    },
    contentTitle: {
        paddingHorizontal: 20,
        paddingTop: 10,
    },
    titleContent: {
        textTransform: "uppercase",
        fontWeight: 'bold',
        fontSize: 25,
    },
    descriptionContent: {
        padding : 20,
    },
    description: {
        fontSize: 16
    },
})