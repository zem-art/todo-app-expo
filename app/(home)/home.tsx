import React, { useCallback, useEffect, useState } from 'react'
import styles from './styles';
import { Container } from '@/components/Container';
import ParallaxFlatList from "@/components/ParallaxFlatList";
import { IconSymbol } from "@/components/ui/IconSymbol";
import { Pressable, Text, View, Switch, VirtualizedList, FlatList, BackHandler, ToastAndroid } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/reducer-store';
import { useIsFocused, useNavigation } from '@react-navigation/native';
import { Link, useRouter } from 'expo-router';
import { Colors } from '@/constants/Colors';
import { useBackHandler } from '@/utils/helpers/useBackHandler.utils';
import { useAuth } from '@/context/auth-provider';
import { todoService } from '@/services/todo.service';
import LoadingSpinner from '@/components/LoadingSpinner';
import { ListTodo } from '@/interfaces/home';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import BottomSheetModal from '@/components/modal/modal-add';
import FilterComponent from '@/components/modal/modal-filter';

const TodoCard = ({ item, isDarkMode, onPressDetail }: any) => {
  const { title, description, created_at, status } = item;
  const substr = 70;
  
  const isCompleted = status === "completed";
  const statusColor = isCompleted ? Colors.grayishDarkGreen : Colors.secondary;
  const badgeBgColor = isCompleted ? 'rgba(92, 184, 92, 0.15)' : 'rgba(255, 165, 0, 0.15)';
  
  const cardBgColor = isDarkMode ? '#1C1C1E' : '#FFFFFF';
  const textColor = isDarkMode ? '#FFFFFF' : '#000000';
  const borderColor = isDarkMode ? '#2C2C2E' : '#E5E5EA';

  return (
    <Pressable 
      style={({ pressed }) => [
        styles.card,
        { 
          backgroundColor: cardBgColor, 
          borderColor: borderColor,
          transform: [{ scale: pressed ? 0.98 : 1 }] 
        }
      ]} 
      onPress={() => onPressDetail(item)}
    >
      <View style={styles.cardHeader}>
        <Text style={[styles.cardTitle, { color: textColor }]} numberOfLines={1}>
          {title}
        </Text>
        <View style={[styles.statusBadge, { backgroundColor: badgeBgColor }]}>
          <IconSymbol
            lib={!isCompleted ? "FontAwesome6" : "AntDesign"}
            name={!isCompleted ? "clock" : "check"}
            size={12}
            color={statusColor}
          />
          <Text style={[styles.statusText, { color: statusColor }]}>
            {isCompleted ? 'Completed' : 'On Track'}
          </Text>
        </View>
      </View>
      <Text style={[styles.cardDescription, { color: textColor }]}>
        {description?.length < substr ? description : `${description?.substring(0, substr)}...`}
      </Text>
      <View style={styles.cardFooter}>
        <Text style={[styles.dateText, { color: textColor }]}>
          {new Date(created_at).toLocaleDateString('id-ID', { month: 'short', day: 'numeric', year: 'numeric' })}
        </Text>
      </View>
    </Pressable>
  );
};

const EmptyState = ({ isDarkMode }: any) => (
  <View style={styles.emptyContainer}>
    <View style={[styles.emptyIconContainer, { backgroundColor: isDarkMode ? '#2C2C2E' : '#F2F2F7' }]}>
      <IconSymbol lib="Ionicons" name="leaf-outline" size={48} color={Colors.primary} />
    </View>
    <Text style={[styles.emptyTitle, { color: isDarkMode ? '#FFF' : '#000' }]}>Semua Selesai!</Text>
    <Text style={[styles.emptySubTitle, { color: isDarkMode ? '#FFF' : '#000' }]}>
      Kamu belum memiliki tugas saat ini. Santai dulu, atau tambah tugas baru untuk memulai produktivitasmu.
    </Text>
  </View>
);

export default function HomeScreen() {
  const router = useRouter();
  const { logout, isLogin } = useAuth()
  const isFocused = useIsFocused();
  const navigation = useNavigation();
  const isDark = useSelector((state:RootState) => state.THEME_REDUCER.isDark);
  const { token } = useSelector((state:RootState) => state.AUTH_REDUCER);
  const { data: user } = useSelector((state:RootState) => state.USER_REDUCER as any);
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

  useBackHandler( isFocused, () => {
    BackHandler.exitApp();
  })

  const onPressDetail = (parms?:any) => {
    router.push({
      pathname : '/(home)/details/details',
      params : { ...parms }
    })
  }

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
    });
    setIsDarkMode(isDark)
    return unsubscribe;
  }, [navigation, isDark]);

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
            <View style={[styles.header, { backgroundColor: !isDarkMode ? Colors.veryLightGray : Colors.veryDarkGray }]}>
              <View style={styles.headerTextContainer}>
                <Text style={[styles.greetingText, { color: isDarkMode ? Colors.secondary : Colors.primary }]}>
                  Halo, {userName} 👋
                </Text>
                <Text style={[styles.subGreetingText, { color: isDarkMode ? '#FFF' : '#000' }]}>
                  {todos.length > 0 ? `Ada ${todos.filter(t => t.status !== 'completed').length} tugas yang belum selesai` : 'Jadwalmu hari ini kosong'}
                </Text>
              </View>
              
              <View style={styles.headerActions}>
                <GestureHandlerRootView style={{ marginRight: 8 }}>
                  <FilterComponent isDarkMode={isDarkMode} filter={filter} setFilter={setFilter} />
                </GestureHandlerRootView>
                <Link href="/settings" asChild>
                  <Pressable style={[styles.buttonSettings, { backgroundColor: isDarkMode ? '#2C2C2E' : '#E5E5EA' }]}>
                    <IconSymbol lib="Feather" name="settings" size={20} color={isDarkMode ? '#FFF' : '#000'} />
                  </Pressable>
                </Link>
              </View>
            </View>
          }
        >
        <View style={styles.content}>
          <Text style={[styles.sectionTitle, { color: isDarkMode ? '#FFF' : '#000' }]}>
            Tugas Terkini
          </Text>

          { isLoading ? (
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
        <BottomSheetModal isVisible={modalVisible} onClose={() => setModalVisible(false)} />
      </GestureHandlerRootView>
    </Container>
  );
}