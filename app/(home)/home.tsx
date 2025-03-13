import React, { useCallback, useEffect, useState } from 'react'
import { Container } from '@/components/Container';
import ParallaxFlatList from "@/components/ParallaxFlatList";
import { IconSymbol } from "@/components/ui/IconSymbol";
import { Alert, Pressable, StyleSheet, Text, View, Switch, VirtualizedList, FlatList, BackHandler, ToastAndroid } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/reducer-store';
import { useIsFocused, useNavigation } from '@react-navigation/native';
import { Link, useRouter } from 'expo-router';
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
  const [isDarkMode, setIsDarkMode] = useState(isDark);
  
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [page, setPage] = useState(2);
  const [loadingMore, setLoadingMore] = useState<boolean>(false);
  const [hasMore, setHasMore] = useState(true); // Status jika masih ada data
  const [todos, setTodos] = useState<Array<ListTodo>>([]);

  // Using the back handler
  useBackHandler( isFocused, () => {
    console.log("Custom exit logic executed!");
    BackHandler.exitApp(); // Default exit action
  })

  // Swict page detail
  const onPressDetail = (parms?:any) => {
    router.push({
      pathname : '/(home)/details',
      params : { ...parms }
    })
  }

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

  // fecthTodos default, loadMore, refreash
  const fetchTodos = async (pageNumber = 1, reset = false) => {
    const isFirstLoad = pageNumber === 1;
    if (isFirstLoad) setIsLoading(true);
    else setLoadingMore(true);

    try {
      const additionalHeaders = { Authorization: `Bearer ${token}` };
      const response = await fetchApi(
        `/api${ConfigApiURL.env_url}/todo/${ConfigApiURL.prefix_url}/list?page=${pageNumber}`,
        "GET",
        undefined,
        additionalHeaders
      );
  
      const data = response?.response?.data || [];
      const formattedData = data.map((item: any) => ({ ...item, status: item.status || "open" }));
  
      setTodos((prev) => (reset ? formattedData : [...prev, ...formattedData]));
  
      if (formattedData.length === 0) setHasMore(false);
      else setPage(pageNumber + 1);
    } catch (error: any) {
      if (error?.status === 401) {
        ToastAndroid.show("Sesi Anda telah berakhir", ToastAndroid.SHORT);
        logout();
      }
    } finally {
      if (isFirstLoad) setIsLoading(false);
      else setLoadingMore(false);
    }
  };

  const fetchData = () => fetchTodos();
  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setHasMore(true);
    setPage(2);
    fetchTodos(1, true).finally(() => setRefreshing(false));
  }, []);
  
  const onLoadMore = () => {
    if (!loadingMore && hasMore) fetchTodos(page);
  };
  
  useEffect(() => {
    fetchData();
  }, [token, isLogin]);

  return (
    <Container style={[styles.container]} isDarkMode={isDarkMode}>
      <ParallaxFlatList
        isDarkMode={isDarkMode}
        HEADER_HEIGHT={60}
        refreshing={refreshing}
        onRefresh={onRefresh}
        onLoadMore={onLoadMore} // Load more
        loadingMore={loadingMore}
        header={
          <View style={[styles.header, { backgroundColor: !isDarkMode ? Colors.veryLightGray : Colors.veryDarkGray }]}>
            <ThemedText style={[styles.textTitle, { color: isDarkMode ? Colors.secondary : Colors.primary }]}>
              TO DO LIST
            </ThemedText>
            <View style={{ flexDirection : 'row'}}>
              <Pressable style={[styles.buttonSettings, { marginRight: 20}]} onPress={() => Alert.alert('Filter pressed')}>
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
        <Text style={[styles.subTitle, { color: isDarkMode ? Colors.secondary : Colors.primary }]}>
          LIST OF TODO
        </Text>

        { isLoading ?
          <LoadingSpinner color="#FF5733" backgroundColor="#f0f0f0" />
          :
          <>
            <FlatList
              data={todos}
              keyExtractor={(item, index) => index.toString()}
              renderItem={({ item }) => {
                const { title, description, created_at, completed, id_todo } = item;
                const substr = 70
                const statusColors: Record<"completed" | "on-track", string> = {
                  completed: Colors.grayishDarkGreen,
                  "on-track": Colors.secondary,
                };
                const color = statusColors[item?.status as "completed" | "on-track"] || Colors.primary;
                return (
                  <Pressable style={[styles.card, { backgroundColor: color }]} onPress={() => onPressDetail(item)}>
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
                )
              }}
            />
          </> 
        }
      </View>
      </ParallaxFlatList>

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