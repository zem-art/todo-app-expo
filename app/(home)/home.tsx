import React, { useEffect, useState } from 'react'
import { Container } from '@/components/Container';
import ParallaxScrollView from "@/components/ParallaxScrollView";
import { IconSymbol } from "@/components/ui/IconSymbol";
import { Alert, Pressable, StyleSheet, Text, View, Switch, VirtualizedList, FlatList, BackHandler, ToastAndroid } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/reducer-store';
import { useIsFocused, useNavigation } from '@react-navigation/native';
import { Link, useRouter } from 'expo-router';
import dummy from "@/test.json";
import { Colors } from '@/constants/Colors';
import { useBackHandler } from '@/utils/helpers/useBackHandler.utils';
import { useAuth } from '@/context/auth-provider';
import { fetchApi } from '@/utils/helpers/fetchApi.utils';
import { ConfigApiURL } from '@/constants/Config';
import LoadingSpinner from '@/components/LoadingSpinner';
import { ListTodo } from '@/interfaces/home';

export default function HomeScreen() {
  const router = useRouter();
  const { logout, isLogin } = useAuth()
  const isFocused = useIsFocused();
  const navigation = useNavigation();
  const isDark = useSelector((state:RootState) => state.THEME_REDUCER.isDark);
  const { token, login } = useSelector((state:RootState) => state.AUTH_REDUCER);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isDarkMode, setIsDarkMode] = useState(isDark);
  const [todos, setTodos] = useState<Array<ListTodo>>([]);

  // useEffect Theme System
  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      // Log makesure state Redux
      console.log('Refreshed Home State:', isDark); 
    });
    setIsDarkMode(isDark)
    // Clean up listeners when component is unmounted
    return unsubscribe;
  }, [navigation, isDark]);
  
  const handleListTodo = async () => {
    setIsLoading(true);
    try {
      const additionalHeaders = {
        Authorization: `Bearer ${token}`,
      };
      const data = await fetchApi(
        `/api${ConfigApiURL.env_url}/todo/${ConfigApiURL.prefix_url}/list?limit=50`,
        "GET",
        undefined,
        additionalHeaders);
      // if (!data?.response?.data) throw new Error("Invalid response data");
      if (!data?.response?.data) setTodos([]);
      // console.log("Response data:", data.response.data);
      const arrayData = data.response.data.map((item: any) => ({
        ...item,
        status: item.status || 'open',
      }));
      setTodos(arrayData);
    } catch (error:any) {
      if (error?.status === 401) {
        ToastAndroid.show("Sesi Anda telah berakhir", ToastAndroid.SHORT);
        logout();
      }
      // console.error("Error ==>", error?.status);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    handleListTodo()
  }, [token, isLogin, isLoading])
  

  // Using the back handler
  useBackHandler( isFocused, () => {
    console.log("Custom exit logic executed!");
    BackHandler.exitApp(); // Default exit action
  })

  const triggerError = () => {
    throw new Error("Test error message");
  };

  const onPressDetail = (parms?:any) => {
    router.push({
      pathname : '/(home)/details',
      params : { ...parms }
    })
  }

  return (
    <Container style={[styles.container]} isDarkMode={isDarkMode}>
      <ParallaxScrollView
        isDarkMode={isDarkMode}
        HEADER_HEIGHT={60}
        header={
          <View style={[styles.header, { backgroundColor: !isDarkMode ? Colors.veryLightGray : Colors.veryDarkGray }]}>
            <ThemedText style={[styles.textTitle, { color: isDarkMode ? Colors.secondary : Colors.primary }]}>
              TO DO LIST
            </ThemedText>
            <View style={{ flexDirection : 'row'}}>
              <Pressable style={[styles.buttonSettings, { marginRight: 20}]} onPress={() => logout()}>
                <IconSymbol lib="Feather" name="filter" size={24} color={isDarkMode ? Colors.veryLightGray : Colors.veryDarkGray} />
              </Pressable>
              <Link href="/settings" asChild>
                <Pressable style={[styles.buttonSettings]}>
                  <IconSymbol lib="Feather" name="settings" size={24} color={isDarkMode ? Colors.veryLightGray : Colors.veryDarkGray} />
                </Pressable>
              </Link>
            </View>
          </View>
        }
      >
      {/* Main Content */}
      <View style={styles.content}>
        {/* Subtitle */}
        <Text style={[styles.subTitle, { color: isDarkMode ? Colors.secondary : Colors.primary }]}>
          LIST OF TODO
        </Text>

        {
          isLoading ?
            <LoadingSpinner color="#FF5733" backgroundColor="#f0f0f0" />
            :
            <>
              {todos.map((item, i) => {
                const statusColors: Record<"completed" | "on-track", string> = {
                  completed: Colors.grayishDarkGreen,
                  "on-track": Colors.secondary,
                };
                const color = statusColors[item?.status as "completed" | "on-track"] || Colors.primary;
                
                const { title, description, created_at, completed, id_todo } = item;
                const substr = 70
                return (
                  <Pressable style={[styles.card, { backgroundColor: color }]} key={i} onPress={() => onPressDetail(item)}>
                    <View style={styles.cardHeader}>
                      <Text style={styles.cardTitle}>{title}</Text>
                      <IconSymbol
                        lib={!completed ? "FontAwesome6" : "AntDesign"}
                        name={!completed ? "clock" : "check"}
                        size={15}
                        color={isDarkMode ? Colors.veryLightGray : Colors.veryDarkGray}
                        />
                    </View>
                    <Text style={styles.cardDescription}>{description.length < substr ? description : `${description.substring(0, substr)}...`}</Text>
                    <Text style={styles.cardFooter}>Created at : {created_at}</Text>
                  </Pressable>
                );
            })}
          </> 
        }

        
      </View>
      </ParallaxScrollView>

      {/* Floating Action Button */}
      <Pressable style={[styles.fab, { backgroundColor: !isDarkMode ? Colors.secondary : Colors.primary }]} onPress={() => Alert.alert('Add Todo')}>
        <IconSymbol lib="Feather" name="plus" size={24} color={isDarkMode ? Colors.veryLightGray : Colors.veryDarkGray} />
      </Pressable>
  </Container>
  );
}

const styles = StyleSheet.create({
  container : {},
  header : {
    position : 'absolute',
    justifyContent : 'space-between',
    flexDirection : 'row',
    height: 178,
    width : '100%',
    paddingHorizontal : '4%',
    padding : '5%',
  },
  textTitle : {
    fontWeight : 'bold',
  },
  buttonSettings: {
    alignItems: 'center',
  },
  content: {},
  reactLogo: {
    height: 178,
    width: 290,
    bottom: 0,
    left: 0,
    position: 'absolute',
  },

  subTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  card: {
    padding: 16,
    borderRadius: 10,
    marginBottom: 16,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  cardTitle: {
    color: Colors.background,
    fontSize: 18,
    fontWeight: 'bold',
  },
  cardDescription: {
    color: Colors.background,
    fontSize: 14,
    marginBottom: 8,
  },
  cardFooter: {
    color: Colors.background,
    fontSize: 12,
  },
  fab: {
    position: 'absolute',
    bottom: 16,
    right: 16,
    height: 56,
    width: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 3,
  },
});

{/* <VirtualizedList
  data={todos}
  keyExtractor={(item) => item.id.toString()} // pastikan id unik dan dalam bentuk string
  renderItem={({ item }) => (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <Text style={styles.cardTitle}>{item.title}</Text>
        <IconSymbol lib="FontAwesome6" name="clock" size={15} color={isDarkMode ? '#F0F0F0' : '#272727'} />
      </View>
      <Text style={styles.cardDescription}>{item.description}</Text>
      <Text style={styles.cardFooter}>Created at {item.createdAt}</Text>
    </View>
  )}
  initialNumToRender={10}  // render beberapa item pertama saja
  maxToRenderPerBatch={10}  // mengatur jumlah maksimal item yang dirender per batch
  windowSize={5}  // mengatur ukuran jendela rendering
/> */}

{/* <FlatList
  data={todos}
  keyExtractor={(item) => item.id}
  renderItem={({ item }) => (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <Text style={styles.cardTitle}>{item.title}</Text>
        <IconSymbol lib="FontAwesome6" name="clock" size={15} color={isDarkMode ? '#F0F0F0' : '#272727'} />
      </View>
      <Text style={styles.cardDescription}>{item.description}</Text>
      <Text style={styles.cardFooter}>Created at {item.createdAt}</Text>
    </View>
  )}
  initialNumToRender={10}  // render beberapa item pertama saja
  maxToRenderPerBatch={10}  // mengatur jumlah maksimal item yang dirender per batch
  windowSize={5}  // mengatur ukuran jendela rendering
/> */}
