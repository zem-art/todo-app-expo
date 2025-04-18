import { Container } from '@/components/Container'
import LoadingSpinner from '@/components/LoadingSpinner';
import BottomSheetModalEdit from '@/components/modal/modal-edit';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { Colors } from '@/constants/Colors';
import { ConfigApiURL } from '@/constants/Config';
import { useAuth } from '@/context/auth-provider';
import { TodoDetail } from '@/interfaces/home';
import { RootState } from '@/redux/reducer-store';
import { fetchApi } from '@/utils/helpers/fetchApi.utils';
import { useNavigation } from '@react-navigation/native';
import { Tooltip } from '@rneui/themed';
import { useLocalSearchParams, useRouter } from 'expo-router/build/hooks';
import React, { useEffect, useState } from 'react'
import { Alert, Pressable, StyleSheet, Text, ToastAndroid, View } from 'react-native'
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { useSelector } from 'react-redux';

export default function DetailsScreen() {
    const router = useRouter()
    const { logout } = useAuth()
    const navigation = useNavigation();
    const { id_todo } =  useLocalSearchParams();
    const isDark = useSelector((state:RootState) => state.THEME_REDUCER.isDark);
    const { token, login } = useSelector((state:RootState) => state.AUTH_REDUCER);
    const [isDarkMode, setIsDarkMode] = useState<boolean>(isDark);
    const [stateDetail, setStateDetail] = useState<TodoDetail>({})
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const [openTooltip, setOpenTooltip] = useState<boolean>(false);
    const [modalVisible, setModalVisible] = useState<boolean>(false);

    useEffect(() => {
        const unsubscribe = navigation.addListener('focus', () => {
          // Log makesure state Redux
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
                let base_url = !!ConfigApiURL.env_url ?
                    `/api${ConfigApiURL.env_url}/todo/${ConfigApiURL.prefix_url}/detail/${id_todo}/exist` : 
                    `/api/todo/${ConfigApiURL.prefix_url}/detail/${id_todo}/exist`;
                const data = await fetchApi(
                    base_url,
                    "GET",
                    undefined,
                    additionalHeaders);
                setStateDetail({...data.response.data})
            } catch (error:any) {
                // console.error("Error ==>", error?.status);
                if (error?.status === 401) {
                    ToastAndroid.show("Your session has expired", ToastAndroid.SHORT);
                    logout();
                }
            } finally {
                setIsLoading(false)
            }
        }
        handleDetailTodo()
    }, [])

    const handleDeleteTodoTemporary = async (uid:string) => {
        try {
        setIsLoading(true)
        const additionalHeaders = {
            Authorization: `Bearer ${token}`,
        };
        const base_url = !!ConfigApiURL.env_url ?
            `/api${ConfigApiURL.env_url}/todo/${ConfigApiURL.prefix_url}/delete/${uid}/temporary` :
            `/api/todo/${ConfigApiURL.prefix_url}/delete/${uid}/temporary`
        const data = await fetchApi(
            base_url,
            'DELETE',
            undefined,
            additionalHeaders,
        )
        if(data.status_code >= 200 && data.status_code <= 204){
            ToastAndroid.show('Selamat, Anda telah berhasil menghapus todo', ToastAndroid.SHORT);
            router.replace('/(home)/home')
        }
        } catch (error:any) {
            if (error?.status === 401) {
                ToastAndroid.show("Your session has expired", ToastAndroid.SHORT);
                logout();
            }
            ToastAndroid.show('Maaf Terjadi Kesalahan Harap Menunggu Beberapa Saat Lagi', ToastAndroid.SHORT);
            console.log('Erorr ==> : ', error)
        } finally {
            setTimeout(() => {
                setIsLoading(false)
            }, 500);
        }
    }

    const handleNavigation = (params:string) => {
        switch (params) {
            case 'add':
                Alert.alert('Add pressed')
                break;
            case 'edit':
                setModalVisible(true)
                break;
            default:
                Alert.alert(
                    "Confirm Delete",
                    "Are you sure you want to delete ? 🤔",
                    [
                    { text: "Cancel", style: "cancel" },
                    { text: "Delete", onPress: () => handleDeleteTodoTemporary(stateDetail?.id_todo || '') },
                    ]
                );
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
                    <Pressable style={[styles.buttonBack]}>
                        <Tooltip
                            visible={openTooltip}
                            onOpen={() => setOpenTooltip(true)}
                            onClose={() => setOpenTooltip(false)}
                            popover={
                                <Text>{stateDetail?.updated_at}</Text>
                            }
                            backgroundColor={Colors.primary}
                            
                        >
                            <IconSymbol lib="AntDesign" name="clockcircleo" size={24} color={isDarkMode ? Colors.veryLightGray : Colors.veryDarkGray} />
                        </Tooltip>
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
            <GestureHandlerRootView style={styles.GesturModal}>
                <BottomSheetModalEdit isVisible={modalVisible} onClose={() => setModalVisible(false)} params={stateDetail}/>
            </GestureHandlerRootView>
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
    GesturModal : {
        position: 'absolute',
    },
})