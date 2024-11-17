import type { PropsWithChildren, ReactElement } from 'react';
import { StyleSheet, useColorScheme, View } from 'react-native';
import Animated, {
  interpolate,
  useAnimatedRef,
  useAnimatedStyle,
  useScrollViewOffset,
} from 'react-native-reanimated';

import { ThemedView } from '@/components/ThemedView';
import { useBottomTabOverflow } from '@/components/ui/TabBarBackground';

// const HEADER_HEIGHT = 100;

type Props = PropsWithChildren<{
  header: ReactElement;
  isDarkMode? : boolean;
  HEADER_HEIGHT? :number;
}>;

export default function ParallaxScrollView({ children, header, isDarkMode, HEADER_HEIGHT=130 }: Props ) {
  const colorScheme = useColorScheme() ?? 'light';
  const scrollRef = useAnimatedRef<Animated.ScrollView>();
  const scrollOffset = useScrollViewOffset(scrollRef);
  const bottom = useBottomTabOverflow();
  const headerAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateY: interpolate(
            scrollOffset.value,
            [-HEADER_HEIGHT, 0, HEADER_HEIGHT],
            [-HEADER_HEIGHT / 2, 0, HEADER_HEIGHT * 0.75]
          ),
        },
        {
          scale: interpolate(scrollOffset.value, [-HEADER_HEIGHT, 0, HEADER_HEIGHT], [2, 1, 1]),
        },
      ],
    };
  });

  return (
    <ThemedView style={styles.container}>
      <Animated.ScrollView
        ref={scrollRef}
        scrollEventThrottle={16}
        scrollIndicatorInsets={{ bottom }}
        contentContainerStyle={{ paddingBottom: bottom }}>
        <Animated.View
          style={[
            styles.header,
            headerAnimatedStyle,
            { height: HEADER_HEIGHT }
          ]}>
          {header}
        </Animated.View>
        <ThemedView style={styles.content} isDarkMode={isDarkMode}>{children}</ThemedView>
      </Animated.ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    overflow: 'hidden',
  },
  content: {
    flex: 1,
    padding: 20,
    gap: 16,
    overflow: 'hidden',
  },

  // headerContent: {
  //   flex: 1,
  //   justifyContent: 'center',
  //   alignItems: 'center',
  // },
  // headerText: {
  //   fontSize: 18,
  //   fontWeight: 'bold',
  //   color: '#fff',
  // },
  // taskCard: {
  //   backgroundColor: '#F76C6A',
  //   borderRadius: 10,
  //   padding: 20,
  //   marginBottom: 16,
  // },
  // taskTitle: {
  //   fontSize: 16,
  //   fontWeight: 'bold',
  //   color: '#fff',
  // },
  // taskDescription: {
  //   fontSize: 14,
  //   color: '#fff',
  //   marginTop: 4,
  // },
  // taskDate: {
  //   fontSize: 12,
  //   color: '#fff',
  //   marginTop: 8,
  //   fontStyle: 'italic',
  // },
});
