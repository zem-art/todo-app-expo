import React from 'react';
import { View, Text } from 'react-native';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { Colors } from '@/constants/Colors';
import styles from '@/app/(home)/styles';

export const EmptyState = ({ isDarkMode }: { isDarkMode: boolean }) => (
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
