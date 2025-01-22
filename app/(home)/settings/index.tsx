import React, { useEffect, useState } from 'react';
import { Link } from 'expo-router';
import { useNavigation } from '@react-navigation/native';
import { Alert, BackHandler, Image, Pressable, StyleSheet, View } from 'react-native';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { useDispatch, useSelector } from 'react-redux';
import { setThemeActions } from '@/redux/actions';
import { AppDispatch, RootState } from '@/redux/reducer-store';
import convertToHyphen from '@/utils/string';
import { Container } from '@/components/Container';
import { Colors } from '@/constants/Colors';

export default function Settings() {
    const navigation = useNavigation();
    const isDark = useSelector((state:RootState) => state.THEME_REDUCER.isDark);
    const dispatch = useDispatch<AppDispatch>();
    const [isDarkMode, setIsDarkMode] = useState(isDark);

    const toggleTheme = () => {
        dispatch(setThemeActions())
        setIsDarkMode(!isDarkMode);
    };

    useEffect(() => {
        const backAction = () => {
          navigation.goBack(); // Navigasi ke Home
          return true; // Tangkap aksi back
        };
    
        const backHandler = BackHandler.addEventListener(
          'hardwareBackPress',
          backAction
        );
    
        return () => backHandler.remove(); // Bersihkan listener
      }, [navigation, isDark]);

    return (
        <Container style={[styles.container]} isDarkMode={isDarkMode}>
            <ParallaxScrollView
                isDarkMode={isDarkMode}
                HEADER_HEIGHT={400}
                header={
                    <View style={[styles.header, 
                    { backgroundColor: !isDarkMode ? Colors.veryLightGray : Colors.veryDarkGray }
                    ]}>
                        <View style={[styles.subHeader]}>
                            <Link href="/home" style={[styles.button]} asChild>
                                <Pressable>
                                    <IconSymbol lib="AntDesign" name="left" size={24} color={isDarkMode ? Colors.veryLightGray : Colors.veryDarkGray} />
                                </Pressable>
                            </Link>
                            <ThemedText style={[styles.textTitle, { color: isDarkMode ? Colors.secondary : Colors.primary }]}>
                                TO DO LIST
                            </ThemedText>
                            <Pressable style={[styles.button]} onPress={() => toggleTheme()}>
                                <IconSymbol 
                                    lib={!isDarkMode ? "MaterialIcons" : "Entypo"} 
                                    name={!isDarkMode ? "darkMode" : "lightMode"}
                                    color={isDarkMode ? Colors.veryLightGray : Colors.veryDarkGray}
                                    size={24}
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
                <ThemedText style={[styles.textSubtitle]} isDarkMode={isDarkMode}>Customize your app experience.</ThemedText>
                <ThemedView isDarkMode={isDarkMode} style={[styles.content, { marginTop :20}]}>
                    <ThemedText style={[styles.textLabelContent]} isDarkMode={isDarkMode}>Full Name</ThemedText>
                    <ThemedText type='subtitle' style={[styles.textValueContent, { textTransform: 'uppercase', color: isDarkMode ? Colors.secondary : Colors.primary }]} isDarkMode={isDarkMode}>{convertToHyphen('ucup surucup')}</ThemedText>
                </ThemedView>
                <ThemedView isDarkMode={isDarkMode} style={[styles.content]}>
                    <ThemedText style={[styles.textLabelContent]} isDarkMode={isDarkMode}>Email</ThemedText>
                    <ThemedText type='subtitle' style={[styles.textValueContent, { color: isDarkMode ? Colors.secondary : Colors.primary }]} isDarkMode={isDarkMode}>ucup@gmail.com</ThemedText>
                </ThemedView>
                <ThemedView isDarkMode={isDarkMode} style={[styles.content]}>
                    <ThemedText style={[styles.textLabelContent]} isDarkMode={isDarkMode}>Password</ThemedText>
                    <Pressable onPress={() => Alert.alert('Change Password pressed')}>
                        <ThemedText type='defaultSemiBold' style={[styles.textValueContent, styles.textLink, { color: isDarkMode ? Colors.secondary : Colors.primary }]} isDarkMode={isDarkMode}>change{' '}password</ThemedText>
                    </Pressable>
                </ThemedView>
                <ThemedView style={[styles.pathButton]} isDarkMode={isDarkMode}>
                    <Pressable style={[styles.ButtonLogout, { backgroundColor: isDarkMode ? Colors.secondary : Colors.primary }]} onPress={() => Alert.alert('Logout pressed')}>
                        <ThemedText style={[styles.textButton]}>log{' '}out</ThemedText>
                    </Pressable>
                </ThemedView>
            </ParallaxScrollView>
        </Container>
    )
}

const styles = StyleSheet.create({
    container: {},
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
    textSubtitle: {},
    subHeader: {
        // backgroundColor : 'red',
        flexDirection : 'row',
        alignItems : 'center',
        justifyContent : 'space-between',
        top: 0,
        height: '15%',
        paddingHorizontal: 15
    },
    button: {
        alignItems: 'center',
    },
    reactLogo: {
        marginTop : 20,
        alignSelf : 'center',
    },
    titleContainer: {
        flexDirection: 'row',
        gap: 8,
    },
    content: {
        alignItems : 'center',
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginVertical: 12,
        // marginBottom: 20,
    },
    textLabelContent: {
        // fontWeight: 'bold',
        color: Colors.mediumGray,
    },
    textValueContent: {
        fontWeight: 'bold',
    },
    pathButton: {
        marginTop: '8.5%',
        marginBottom: '2%',
        height: '100%',
    },
    ButtonLogout: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 12,
        paddingHorizontal: 32,
        borderRadius: 4,
        elevation: 3,
    },
    textButton: {
        fontSize: 16,
        lineHeight: 21,
        fontWeight: 'bold',
        letterSpacing: 0.25,
        color: 'white',
        textTransform: 'uppercase'
    },
    textLink: {
        textTransform: 'capitalize',
        textDecorationLine: 'underline',
        lineHeight: 22,
        // backgroundColor: 'red'
    }
})
