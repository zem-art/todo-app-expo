import React from 'react';
import { StyleProp, TextStyle } from 'react-native';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import AntDesign from '@expo/vector-icons/AntDesign';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import Feather from '@expo/vector-icons/Feather';

// Mapping sederhana untuk icon
const IconMap = {
  MaterialIcons: {
    home: 'home',
    send: 'send',
    code: 'code',
    right: 'chevron-right',
  },
  AntDesign: {
    up: 'arrowup',
    down: 'arrowdown',
    home: 'home',
    check: 'check',
  },
  FontAwesome: {
    like: 'thumbs-o-up',
    dislike: 'thumbs-o-down',
  },
  FontAwesome6: {
    clock: 'clock',
  },
  Feather: {
    settings: 'settings',
    plus: 'plus',
    filter: 'filter',
  },
} as const;

// Library components
const Libraries = {
  MaterialIcons,
  AntDesign,
  FontAwesome,
  FontAwesome6,
  Feather,
} as const;

type LibraryType = keyof typeof Libraries;
type IconNameType<T extends LibraryType> = keyof typeof IconMap[T];

interface IconProps<T extends LibraryType> {
  lib?: T;
  name: string;
  // name: IconNameType<T>;
  size?: number;
  color: string;
  style?: StyleProp<TextStyle>;
}

export function IconSymbol<T extends LibraryType = 'MaterialIcons'>({
  lib = 'MaterialIcons' as T,
  name,
  size = 24,
  color,
  style,
}: IconProps<T>) {
  const Component = Libraries[lib];
  // const iconName = IconMap[lib][name];
  const iconName = IconMap[lib]?.[name as keyof typeof IconMap[typeof lib]];

  return <Component name={iconName} size={size} color={color} style={style} />;
}