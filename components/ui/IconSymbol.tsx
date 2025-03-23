import React from 'react';
import { StyleProp, TextStyle } from 'react-native';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import AntDesign from '@expo/vector-icons/AntDesign';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import Feather from '@expo/vector-icons/Feather';
import Entypo from '@expo/vector-icons/Entypo';
import Ionicons from '@expo/vector-icons/Ionicons';

// Mapping sederhana untuk icon
const IconMap = {
  MaterialIcons: {
    home: 'home',
    send: 'send',
    code: 'code',
    right: 'chevron-right',
    darkMode : 'dark-mode',
    history: 'history',
  },
  AntDesign: {
    up: 'arrowup',
    down: 'arrowdown',
    home: 'home',
    check: 'check',
    left : 'left',
    clockcircleo: 'clockcircleo',
    edit: 'edit',
    delete: 'delete',
  },
  FontAwesome: {
    like: 'thumbs-o-up',
    dislike: 'thumbs-o-down',
    history: 'history',
  },
  FontAwesome6: {
    clock: 'clock',
    history: 'history',
  },
  Feather: {
    settings: 'settings',
    plus: 'plus',
    filter: 'filter',
  },
  Entypo : {
    lightMode : 'light-up'
  },
  Ionicons : {
    checkboxOutline : 'checkbox-outline',
    eyeOffOutline : 'eye-off-outline',
    eyeOutline : 'eye-outline',
    calenderOutline : 'calendar-outline',
    imageOutline: 'image-outline'
  }
} as const;

// Library components
const Libraries = {
  MaterialIcons,
  AntDesign,
  FontAwesome,
  FontAwesome6,
  Feather,
  Entypo,
  Ionicons,
} as const;

type LibraryType = keyof typeof Libraries;
type IconNameType<T extends LibraryType> = keyof typeof IconMap[T];

interface IconProps<T extends LibraryType> {
  lib?: T;
  name: string;
  // name: IconNameType<T>;
  size?: number;
  color?: string;
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