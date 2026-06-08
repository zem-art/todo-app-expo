import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { Colors } from '@/constants/Colors';
import styles from '@/app/(home)/styles';

export const TodoCard = ({ item, isDarkMode, onPressDetail }: any) => {
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
