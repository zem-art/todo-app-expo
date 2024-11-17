import { View, type ViewProps } from 'react-native';

import { useThemeColor } from '@/hooks/useThemeColor';

export type ThemedViewProps = ViewProps & {
  lightColor?: string;
  darkColor?: string;
  isDarkMode?: boolean;
};

export function ThemedView({ style, lightColor, darkColor, isDarkMode=false, ...otherProps }: ThemedViewProps) {
  
  const backgroundColor = useThemeColor({ light: lightColor, dark: darkColor }, 'background', isDarkMode);

  return <View style={[{ backgroundColor }, style]} {...otherProps} />;
}
