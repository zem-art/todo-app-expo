import React from 'react';
import { StyleProp, TextStyle } from 'react-native';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import AntDesign from '@expo/vector-icons/AntDesign';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import Feather from '@expo/vector-icons/Feather';
import Entypo from '@expo/vector-icons/Entypo';
import Ionicons from '@expo/vector-icons/Ionicons';

const Libraries = {
  MaterialIcons,
  AntDesign,
  FontAwesome,
  FontAwesome6,
  Feather,
  Entypo,
  Ionicons,
} as const;

export type LibraryType = keyof typeof Libraries;

export interface IconProps {
  lib?: LibraryType;
  name: string;
  size?: number;
  color?: string;
  style?: StyleProp<TextStyle>;
}

export function IconSymbol({
  lib = 'MaterialIcons',
  name,
  size = 24,
  color,
  style,
}: IconProps) {
  const Component = Libraries[lib];
  return <Component name={name as any} size={size} color={color} style={style} />;
}