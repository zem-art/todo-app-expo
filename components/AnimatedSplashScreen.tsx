import React, { useEffect, useState } from 'react';
import { Animated, StyleSheet, View, Text } from 'react-native';
import { Colors } from '@/constants/Colors';
import { IconSymbol } from './ui/IconSymbol';

interface AnimatedSplashScreenProps {
  isAppReady: boolean;
  onAnimationComplete: () => void;
  isDarkMode: boolean;
}

export const AnimatedSplashScreen = ({ isAppReady, onAnimationComplete, isDarkMode }: AnimatedSplashScreenProps) => {
  const [animation] = useState(new Animated.Value(0));

  useEffect(() => {
    if (isAppReady) {
      Animated.timing(animation, {
        toValue: 1,
        duration: 500, // 500ms fade-out/scale-up
        useNativeDriver: true,
      }).start(() => {
        onAnimationComplete();
      });
    }
  }, [isAppReady, animation, onAnimationComplete]);

  // Interpolations
  const opacity = animation.interpolate({
    inputRange: [0, 0.8, 1],
    outputRange: [1, 1, 0], // Keeps solid until the very end, then fades
  });

  const scale = animation.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 1.2], // Slightly scales up for cinematic effect
  });

  return (
    <Animated.View
      style={[
        styles.container,
        {
          backgroundColor: isDarkMode ? Colors.veryDarkGray : Colors.background,
          opacity: opacity,
          transform: [{ scale: scale }],
        },
      ]}
    >
      <View style={styles.logoContainer}>
        <View style={styles.iconWrapper}>
          <IconSymbol lib="Ionicons" name="checkbox-outline" size={60} color={Colors.primary} />
        </View>
        <Text style={[styles.title, { color: isDarkMode ? '#FFF' : '#000' }]}>TO DO LIST</Text>
        <Text style={styles.subtitle}>Supercharge your productivity</Text>
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 9999, // Ensure it sits on top of everything
  },
  logoContainer: {
    alignItems: 'center',
  },
  iconWrapper: {
    width: 100,
    height: 100,
    borderRadius: 32,
    backgroundColor: 'rgba(52, 199, 89, 0.1)', // Subtle primary color background
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  title: {
    fontSize: 32,
    fontWeight: '800',
    letterSpacing: 4,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    fontWeight: '500',
    color: '#8E8E93',
    letterSpacing: 1,
  },
});
