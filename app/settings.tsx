import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { Link } from 'expo-router';
import React, { useState } from 'react'
import { Image, Pressable, StyleSheet, View } from 'react-native'

export default function Settings() {
    const [isDarkMode, setIsDarkMode] = useState(false);
    const toggleTheme = () => {
        setIsDarkMode(!isDarkMode);
    };

    return (
        <View style={[styles.container, { backgroundColor: !isDarkMode ? '#A6AEBF' : '#272727' }]}>
            <ParallaxScrollView
                isDarkMode={isDarkMode}
                HEADER_HEIGHT={400}
                header={
                    <View style={[styles.header, 
                    { backgroundColor: !isDarkMode ? '#F0F0F0' : '#1C1C1C' }
                    ]}>
                        <View style={[styles.subHeader]}>
                            <Link href="/" style={[styles.button]} asChild>
                                <Pressable>
                                    <IconSymbol lib="AntDesign" name="arrowleft" size={24} color={isDarkMode ? '#F0F0F0' : '#272727'} />
                                </Pressable>
                            </Link>
                            <ThemedText style={[styles.textTitle, { color: isDarkMode ? '#F76C6A' : '#F79E89' }]}>
                                TO DO LIST
                            </ThemedText>
                            <Pressable style={[styles.button]} onPress={() => toggleTheme()}>
                                <IconSymbol 
                                    lib={!isDarkMode ? "MaterialIcons" : "Entypo"} 
                                    name={!isDarkMode ? "darkMode" : "lightMode"}
                                    size={24}
                                    color={isDarkMode ? '#F0F0F0' : '#272727'}
                                />
                            </Pressable>
                        </View>
                        <Image
                            source={require('@/assets/images/ilustration.png')}
                            style={[styles.reactLogo]}
                        />
                    </View>
                }>
                {/* Main Content */}
                <ThemedView style={styles.titleContainer} isDarkMode={isDarkMode}>
                    <ThemedText type="title" isDarkMode={isDarkMode}>Settings</ThemedText>
                </ThemedView>
                <ThemedText isDarkMode={isDarkMode}>This app includes example code to help you get started.</ThemedText>
            </ParallaxScrollView>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex : 1,
        height : '3%',
        paddingTop : 25,
    },
    header: {
        height : '100%',
        width : 'auto',
        backgroundColor : 'red',
        borderBottomWidth : 0.5,
        borderBottomColor : 'grey'
    },
    textTitle: {
        fontWeight : 'bold'
    },
    subHeader: {
        // backgroundColor : 'red',
        flexDirection : 'row',
        alignItems : 'center',
        justifyContent : 'space-between',
        top: 0,
        height : '15%',
        paddingHorizontal : 15
    },
    button: {
        alignItems: 'center',
        // backgroundColor : 'red'
    },
    reactLogo: {
        marginTop : 20,
        alignSelf : 'center',
    },
    titleContainer: {
        flexDirection: 'row',
        gap: 8,
    },
})
