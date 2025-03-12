import { Container } from '@/components/Container'
import LoadingSpinner from '@/components/LoadingSpinner';
import ParallaxFlatList from '@/components/ParallaxFlatList';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { Colors } from '@/constants/Colors';
import { ConfigApiURL } from '@/constants/Config';
import { useAuth } from '@/context/auth-provider';
import { Todo } from '@/interfaces/home';
import { RootState } from '@/redux/reducer-store';
import { fetchApi } from '@/utils/helpers/fetchApi.utils';
import { useNavigation } from '@react-navigation/native';
import { useLocalSearchParams, useRouter } from 'expo-router/build/hooks';
import React, { useEffect, useState } from 'react'
import { Alert, Pressable, StyleSheet, Text, ToastAndroid, View } from 'react-native'
import { useSelector } from 'react-redux';

export default function DetailsScreen() {
    const router = useRouter()
    const { logout } = useAuth()
    const navigation = useNavigation();
    const { id_todo } =  useLocalSearchParams();
    const isDark = useSelector((state:RootState) => state.THEME_REDUCER.isDark);
    const { token, login } = useSelector((state:RootState) => state.AUTH_REDUCER);
    const [isDarkMode, setIsDarkMode] = useState(isDark);
    const [stateDetail, setStateDetail] = useState<Todo>()
    const [isLoading, setIsLoading] = useState(false)
    console.log('token ==> : ', token)

    useEffect(() => {
        const unsubscribe = navigation.addListener('focus', () => {
          // Log makesure state Redux
          console.log('Refreshed Detail State:', isDark);
        });
        setIsDarkMode(isDark)
        // Clean up listeners when component is unmounted
        return unsubscribe;
    }, [navigation, isDark]);

    useEffect(() => {
        const handleDetailTodo = async () => {
            setIsLoading(true)
            try {
                const additionalHeaders = {
                    Authorization: `Bearer ${token}`,
                };
                const data = await fetchApi(
                    `/api${ConfigApiURL.env_url}/todo/${ConfigApiURL.prefix_url}/detail/${id_todo}/exist`,
                    "GET",
                    undefined,
                    additionalHeaders);
                setStateDetail(data.response.data)
            } catch (error:any) {
                // console.error("Error ==>", error?.status);
                if (error?.status === 401) {
                    ToastAndroid.show("Sesi Anda telah berakhir", ToastAndroid.SHORT);
                    logout();
                }
            } finally {
                setIsLoading(false)
            }
        }
        handleDetailTodo()
    }, [])

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

    console.log('loading ==> : ', isLoading)

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

            {
                isLoading ? 
                    <LoadingSpinner color="#FF5733" backgroundColor="#f0f0f0" />
                :
                <ThemedView style={[styles.content, { backgroundColor : !isDarkMode ? Colors.background : Colors.veryDarkGray }]}>
                    <ThemedView style={[styles.created_at, { backgroundColor : !isDarkMode ? Colors.background : Colors.veryDarkGray }]}>
                        <ThemedText isDarkMode={isDarkMode}>Date : {stateDetail?.created_at}</ThemedText>
                    </ThemedView>
                    <ThemedView style={[styles.contentTitle, { backgroundColor : !isDarkMode ? Colors.background : Colors.veryDarkGray }]}>
                        <ThemedText isDarkMode={isDarkMode} style={[styles.titleContent]}>{stateDetail?.title}</ThemedText>
                    </ThemedView>
                    <ThemedView style={[styles.descriptionContent, { backgroundColor : !isDarkMode ? Colors.background : Colors.veryDarkGray }]}>
                        <ThemedText isDarkMode={isDarkMode} style={[styles.description]}>{stateDetail?.description}</ThemedText>
                    </ThemedView>
                </ThemedView>
            }
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