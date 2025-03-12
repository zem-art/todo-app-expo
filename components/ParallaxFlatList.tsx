import type { PropsWithChildren, ReactElement } from 'react';
import { StyleSheet } from 'react-native';
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

export default function ParallaxFlatList({ children, header, isDarkMode, HEADER_HEIGHT=130 }: Props ) {
  const scrollRef = useAnimatedRef<Animated.FlatList<any>>();
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
    <ThemedView style={[styles.container]}>
      <Animated.FlatList
        ref={scrollRef}
        scrollEventThrottle={16}
        scrollIndicatorInsets={{ bottom }}
        contentContainerStyle={{ paddingBottom: bottom }}
        data={[]} // FlatList tetap membutuhkan data, tapi di sini kosong karena hanya untuk container
        ListHeaderComponent={
          <>
            <Animated.View style={[styles.header, { height: HEADER_HEIGHT }, headerAnimatedStyle]}>
              {header}
            </Animated.View>
            <ThemedView style={[styles.content]} isDarkMode={isDarkMode}>
              {children}
            </ThemedView>
          </>
        }
        renderItem={null} // Tidak ada item karena ini hanya wrapper
      />
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
});
