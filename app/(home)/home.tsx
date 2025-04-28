import React, { useCallback, useEffect, useState } from 'react'
import styles from './styles';
import { Container } from '@/components/Container';
import ParallaxFlatList from "@/components/ParallaxFlatList";
import { IconSymbol } from "@/components/ui/IconSymbol";
import { Alert, Pressable, Text, View, Switch, VirtualizedList, FlatList, BackHandler, ToastAndroid } from 'react-native';
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
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import BottomSheetModal from '@/components/modal/modal-add';
import FilterComponent from '@/components/modal/modal-filter';

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
  const [modalVisible, setModalVisible] = useState<boolean>(false);

  // State for filter and sort
  const [filter, setFilter] = useState({
    status: 'all', // 'all', 'open', 'completed'
    order: 'newest', // 'newest', 'oldest'
  });

  // Using the back handler to handle the back button press
  useBackHandler( isFocused, () => {
    console.log("Custom exit logic executed!");
    BackHandler.exitApp(); // Default exit action
  })

  // Function to handle the press event on the card
  const onPressDetail = (parms?:any) => {
    router.push({
      pathname : '/(home)/details/details',
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
      let base_url = !!ConfigApiURL.env_url ?
        `/api${ConfigApiURL.env_url}/todo/${ConfigApiURL.prefix_url}/list?page=${pageNumber}` : 
        `/api/todo/${ConfigApiURL.prefix_url}/list?page=${pageNumber}`;
      const response = await fetchApi(
        base_url,
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
      console.log('Error fetching todos:', error);
      if (error?.status === 401) {
        ToastAndroid.show("Your session has expired", ToastAndroid.SHORT);
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
    setFilter({ status: 'all', order: 'newest' }); // Reset filter on refresh
  }, []);
  
  const onLoadMore = () => {
    if (!loadingMore && hasMore) fetchTodos(page);
  };
  
  useEffect(() => {
    fetchData();
  }, [token, isLogin]);

  // Filter and sort todos based on the selected filter
  const applyFilter = (todos: Array<ListTodo>) => {
    let filteredTodos = [...todos];
  
    // Filter by status
    if (filter.status !== 'all') {
      filteredTodos = filteredTodos.filter((todo) => todo.status === filter.status);
    }
  
    // Sort by created_at
    filteredTodos.sort((a, b) => {
      const dateA = new Date(a.created_at).getTime();
      const dateB = new Date(b.created_at).getTime();
      return filter.order === 'newest' ? dateB - dateA : dateA - dateB;
    });
  
    return filteredTodos;
  };

  // Apply filter to todos
  const filteredTodos = applyFilter(todos);

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
                <GestureHandlerRootView style={{ position: 'absolute', right: 20, top: 0 }}>
                  <FilterComponent isDarkMode={isDarkMode} filter={filter} setFilter={setFilter} />
                </GestureHandlerRootView>
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
                data={filteredTodos}
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
      <Pressable 
        style={[styles.fab, { backgroundColor: !isDarkMode ? Colors.secondary : Colors.primary }]}
        onPress={() => setModalVisible(true)}>
        <IconSymbol lib="Feather" name="plus" size={24} color={isDarkMode ? Colors.veryLightGray : Colors.veryDarkGray} />
      </Pressable>
      <GestureHandlerRootView style={styles.GesturModal}>
        <BottomSheetModal isVisible={modalVisible} onClose={() => setModalVisible(false)} />
      </GestureHandlerRootView>
    </Container>
  );
}