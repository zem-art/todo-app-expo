import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { Colors } from '@/constants/Colors';
import styles from '@/app/(home)/styles';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import FilterComponent from '@/components/modal/modal-filter';
import { Link } from 'expo-router';
import { IconSymbol } from '../ui/IconSymbol';

interface HomeHeaderProps {
  isDarkMode: boolean;
  userName: string;
  activeTodosCount: number;
  filter: any;
  setFilter: (filter: any) => void;
}

export const HomeHeader = ({ isDarkMode, userName, activeTodosCount, filter, setFilter }: HomeHeaderProps) => {
  return (
    <View style={[styles.header, { backgroundColor: !isDarkMode ? Colors.veryLightGray : Colors.veryDarkGray }]}>
      <View style={styles.headerTextContainer}>
        <Text style={[styles.greetingText, { color: isDarkMode ? Colors.secondary : Colors.primary }]}>
          Halo, {userName} 👋
        </Text>
        <Text style={[styles.subGreetingText, { color: isDarkMode ? '#FFF' : '#000' }]}>
          {activeTodosCount > 0 ? `Ada ${activeTodosCount} tugas yang belum selesai` : 'Jadwalmu hari ini kosong'}
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
  );
};
