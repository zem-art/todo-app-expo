import React, { useCallback, useEffect, useState } from 'react';
import styles from './styles';
import { Container } from '@/components/Container';
import ParallaxFlatList from "@/components/ParallaxFlatList";
import { IconSymbol } from "@/components/ui/IconSymbol";
import { Pressable, Text, View, BackHandler, ToastAndroid, FlatList } from 'react-native';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/reducer-store';
import { useIsFocused, useNavigation } from '@react-navigation/native';
import { useRouter, Link } from 'expo-router';
import { Colors } from '@/constants/Colors';
import { useBackHandler } from '@/utils/helpers/useBackHandler.utils';
import { useAuth } from '@/context/auth-provider';
import { todoService } from '@/services/todo.service';
import LoadingSpinner from '@/components/LoadingSpinner';
import { ListTodo } from '@/interfaces/home';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import BottomSheetModal from '@/components/modal/modal-add';

// Micro-components
import { TodoCard } from '@/components/home/TodoCard';
import { EmptyState } from '@/components/home/EmptyState';
import { HomeHeader } from '@/components/home/HomeHeader';

export default function HomeScreen() {
  const router = useRouter();
  const { logout, isLogin } = useAuth();
  const isFocused = useIsFocused();
  const navigation = useNavigation();

  const isDark = useSelector((state: RootState) => state.THEME_REDUCER.isDark);
  const { token } = useSelector((state: RootState) => state.AUTH_REDUCER);
  const { data: user } = useSelector((state: RootState) => state.USER_REDUCER as any);

  const [isDarkMode, setIsDarkMode] = useState(isDark);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [page, setPage] = useState(2);
  const [loadingMore, setLoadingMore] = useState<boolean>(false);
  const [hasMore, setHasMore] = useState(true);
  const [todos, setTodos] = useState<Array<ListTodo>>([]);
  const [modalVisible, setModalVisible] = useState<boolean>(false);

  const [filter, setFilter] = useState({
    status: 'all',
    order: 'newest',
  });

  useBackHandler(isFocused, () => {
    BackHandler.exitApp();
  });

  const onPressDetail = (parms?: any) => {
    router.push({
      pathname: '/(home)/details/details',
      params: { ...parms }
    });
  };

  useEffect(() => {
    setIsDarkMode(isDark);
  }, [isDark]);

  const fetchTodos = async (pageNumber = 1, reset = false) => {
    const isFirstLoad = pageNumber === 1;
    if (isFirstLoad) setIsLoading(true);
    else setLoadingMore(true);

    try {
      const response = await todoService.getTodos(token, pageNumber, 10);
      const data = response?.response?.data || [];
      const formattedData = data.map((item: any) => ({ ...item, status: item.status || "open" }));

      setTodos((prev) => (reset ? formattedData : [...prev, ...formattedData]));

      if (formattedData.length === 0) setHasMore(false);
      else setPage(pageNumber + 1);
    } catch (error: any) {
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
    setFilter({ status: 'all', order: 'newest' });
  }, []);

  const onLoadMore = () => {
    if (!loadingMore && hasMore) fetchTodos(page);
  };

  useEffect(() => {
    fetchData();
  }, [token, isLogin]);

  const applyFilter = (todos: Array<ListTodo>) => {
    let filteredTodos = [...todos];
    if (filter.status !== 'all') {
      filteredTodos = filteredTodos.filter((todo) => todo.status === filter.status);
    }
    filteredTodos.sort((a, b) => {
      const dateA = new Date(a.created_at).getTime();
      const dateB = new Date(b.created_at).getTime();
      return filter.order === 'newest' ? dateB - dateA : dateA - dateB;
    });
    return filteredTodos;
  };

  const filteredTodos = applyFilter(todos);
  const userName = user?.name ? user.name.split(' ')[0] : 'Kawan';
  const activeTodosCount = todos.filter(t => t.status !== 'completed').length;

  return (
    <Container style={[styles.container]} isDarkMode={isDarkMode}>
      <ParallaxFlatList
        isDarkMode={isDarkMode}
        HEADER_HEIGHT={10}
        refreshing={refreshing}
        onRefresh={onRefresh}
        onLoadMore={onLoadMore}
        loadingMore={loadingMore}
        header={
          <HomeHeader
            isDarkMode={isDarkMode}
            userName={userName}
            activeTodosCount={activeTodosCount}
            filter={filter}
            setFilter={setFilter}
          />
        }
      >
        <View style={styles.content}>
          <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 16, justifyContent: 'space-between' }}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <IconSymbol lib="Feather" name="list" size={20} color={isDarkMode ? '#FFF' : '#000'} />
              <Text style={[styles.sectionTitle, { color: isDarkMode ? '#FFF' : '#000', marginBottom: 0, marginLeft: 8 }]}>
                Tugas Terkini
              </Text>
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <View style={{ backgroundColor: isDarkMode ? '#2C2C2E' : '#E5E5EA', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12, marginRight: 12 }}>
                <Text style={{ color: isDarkMode ? '#FFF' : '#000', fontSize: 12, fontWeight: 'bold' }}>
                  {filteredTodos.length}
                </Text>
              </View>
              <Link href="/history" asChild>
                <Pressable style={{ backgroundColor: isDarkMode ? '#2C2C2E' : '#E5E5EA', padding: 6, borderRadius: 10, marginRight: 8 }}>
                  <IconSymbol lib="AntDesign" name="history" size={16} color={isDarkMode ? '#FFF' : '#000'} />
                </Pressable>
              </Link>
              <Link href="/(home)/profile/profile" asChild>
                <Pressable style={{ backgroundColor: isDarkMode ? '#2C2C2E' : '#E5E5EA', padding: 6, borderRadius: 10 }}>
                  <IconSymbol lib="Ionicons" name="person-outline" size={16} color={isDarkMode ? '#FFF' : '#000'} />
                </Pressable>
              </Link>
            </View>
          </View>

          {isLoading ? (
            <LoadingSpinner color={Colors.primary} backgroundColor="transparent" />
          ) : filteredTodos.length > 0 ? (
            <FlatList
              data={filteredTodos}
              keyExtractor={(item, index) => index.toString()}
              renderItem={({ item }) => (
                <TodoCard item={item} isDarkMode={isDarkMode} onPressDetail={onPressDetail} />
              )}
              scrollEnabled={false}
            />
          ) : (
            <EmptyState isDarkMode={isDarkMode} />
          )}
        </View>
      </ParallaxFlatList>

      <Pressable
        style={({ pressed }) => [
          styles.fab,
          {
            backgroundColor: Colors.primary,
            transform: [{ scale: pressed ? 0.92 : 1 }]
          }
        ]}
        onPress={() => setModalVisible(true)}>
        <IconSymbol lib="Feather" name="plus" size={28} color="#FFF" />
      </Pressable>

      <GestureHandlerRootView style={styles.GesturModal}>
        <BottomSheetModal isVisible={modalVisible} onClose={() => setModalVisible(false)} onSuccess={onRefresh} />
      </GestureHandlerRootView>
    </Container>
  );
}