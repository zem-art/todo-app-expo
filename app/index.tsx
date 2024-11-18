import { Link } from 'expo-router';
import React, { useState } from 'react'
import ParallaxScrollView from "@/components/ParallaxScrollView";
import { IconSymbol } from "@/components/ui/IconSymbol";
import { Alert, FlatList, Image, Pressable, StyleSheet, Switch, Text, View, VirtualizedList  } from 'react-native';
import dummy from "@/test.json";

export default function Index() {
  const [todos, setTodos] = useState(dummy)
  const [isDarkMode, setIsDarkMode] = useState(true);

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

  return (
    <View style={[styles.container, { backgroundColor: !isDarkMode ? '#A6AEBF' : '#272727' }]}>
    <ParallaxScrollView
      isDarkMode={isDarkMode}
      HEADER_HEIGHT={60}
      header={
        <View style={[styles.header, { backgroundColor: !isDarkMode ? '#F0F0F0' : '#1C1C1C' }]}>
          <Text style={[styles.textTitle, { color: isDarkMode ? '#F76C6A' : '#F79E89' }]}>
            TO DO LIST
          </Text>
          <View style={{ flexDirection : 'row'}}>
            <Pressable style={[styles.buttonSettings, { marginRight: 20}]} onPress={() => Alert.alert('Filter pressed')}>
              <IconSymbol lib="Feather" name="filter" size={24} color={isDarkMode ? '#F0F0F0' : '#272727'} />
            </Pressable>
            <Link href="/settings" asChild>
              <Pressable style={[styles.buttonSettings]}>
                <IconSymbol lib="Feather" name="settings" size={24} color={isDarkMode ? '#F0F0F0' : '#272727'} />
              </Pressable>
            </Link>
          </View>
        </View>
      }
    >
    {/* Main Content */}
    <View style={styles.content}>
      {/* Subtitle */}
      <Text style={[styles.subTitle, { color: isDarkMode ? '#F76C6A' : '#F79E89' }]}>
        LIST OF TODO
      </Text>

      {todos.map((item, i) => {
        const bgStatus: string = {
          completed: '#47663B',
          'on-track': '#F76C6A',
        }[item?.status] || '#F79E89';
        const { title, description, createdAt, completed } = item;
        return (
          <View style={[styles.card, { backgroundColor: bgStatus }]} key={i}>
            <View style={styles.cardHeader}>
              <Text style={styles.cardTitle}>{title}</Text>
              <IconSymbol
                lib={!completed ? "FontAwesome6" : "AntDesign"}
                name={!completed ? "clock" : "check"}
                size={15}
                color={isDarkMode ? '#F0F0F0' : '#272727'}
              />
            </View>
            <Text style={styles.cardDescription}>{description}</Text>
            <Text style={styles.cardFooter}>Created at : {createdAt}</Text>
          </View>
        );
      })}
    </View>
    </ParallaxScrollView>

    {/* Floating Action Button */}
    <Pressable style={[styles.fab, { backgroundColor: !isDarkMode ? '#F76C6A' : '#F79E89' }]} onPress={() => Alert.alert('Add Todo')}>
      <IconSymbol lib="Feather" name="plus" size={24} color={isDarkMode ? '#F0F0F0' : '#272727'} />
    </Pressable>
  </View>
  );
}

const styles = StyleSheet.create({
  header : {
    position : 'absolute',
    justifyContent : 'space-between',
    flexDirection : 'row',
    height: 178,
    width : '100%',
    paddingHorizontal : '4%',
    padding : '5%',
  },
  textTitle : {},
  buttonSettings: {
    alignItems: 'center',
  },
  container : {
    flex : 1,
    height : '3%',
    paddingTop : 25,
  },
  content: {},
  reactLogo: {
    height: 178,
    width: 290,
    bottom: 0,
    left: 0,
    position: 'absolute',
  },

  subTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  card: {
    padding: 16,
    borderRadius: 10,
    marginBottom: 16,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  cardTitle: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  cardDescription: {
    color: '#FFFFFF',
    fontSize: 14,
    marginBottom: 8,
  },
  cardFooter: {
    color: '#FFFFFF',
    fontSize: 12,
  },
  fab: {
    position: 'absolute',
    bottom: 16,
    right: 16,
    height: 56,
    width: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 3,
  },
});

{/* <VirtualizedList
  data={todos}
  keyExtractor={(item) => item.id.toString()} // pastikan id unik dan dalam bentuk string
  renderItem={({ item }) => (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <Text style={styles.cardTitle}>{item.title}</Text>
        <IconSymbol lib="FontAwesome6" name="clock" size={15} color={isDarkMode ? '#F0F0F0' : '#272727'} />
      </View>
      <Text style={styles.cardDescription}>{item.description}</Text>
      <Text style={styles.cardFooter}>Created at {item.createdAt}</Text>
    </View>
  )}
  initialNumToRender={10}  // render beberapa item pertama saja
  maxToRenderPerBatch={10}  // mengatur jumlah maksimal item yang dirender per batch
  windowSize={5}  // mengatur ukuran jendela rendering
/> */}

{/* <FlatList
  data={todos}
  keyExtractor={(item) => item.id}
  renderItem={({ item }) => (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <Text style={styles.cardTitle}>{item.title}</Text>
        <IconSymbol lib="FontAwesome6" name="clock" size={15} color={isDarkMode ? '#F0F0F0' : '#272727'} />
      </View>
      <Text style={styles.cardDescription}>{item.description}</Text>
      <Text style={styles.cardFooter}>Created at {item.createdAt}</Text>
    </View>
  )}
  initialNumToRender={10}  // render beberapa item pertama saja
  maxToRenderPerBatch={10}  // mengatur jumlah maksimal item yang dirender per batch
  windowSize={5}  // mengatur ukuran jendela rendering
/> */}
