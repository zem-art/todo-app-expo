import ParallaxScrollView from "@/components/ParallaxScrollView";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { IconSymbol } from "@/components/ui/IconSymbol";
import { useState } from "react";
import { Alert, FlatList, Image, Pressable, StyleSheet, Switch, Text, View } from 'react-native';
import dummy from "@/test.json";

export default function Index() {
  const [isDarkMode, setIsDarkMode] = useState(true);

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

  const todos:any = dummy;

  return (
    <View style={[styles.container, { backgroundColor: !isDarkMode ? '#F0F0F0' : '#272727' }]}>
    {/* Header */}
    <ParallaxScrollView
      isDarkMode={isDarkMode}
      HEADER_HEIGHT={60}
      header={
        <View style={[styles.header, { backgroundColor: !isDarkMode ? '#F0F0F0' : '#272727' }]}>
          <Text style={[styles.textTitle, { color: isDarkMode ? '#F76C6A' : '#F76C6A' }]}>
            TO DO LIST
          </Text>
          <View style={{ flexDirection : 'row'}}>
            <Pressable style={[styles.buttonSettings, { marginRight: 20}]} onPress={() => Alert.alert('Filter pressed')}>
              <IconSymbol lib="Feather" name="filter" size={24} color={isDarkMode ? '#F0F0F0' : '#272727'} />
            </Pressable>
            <Pressable style={styles.buttonSettings} onPress={() => Alert.alert('Settings pressed')}>
              <IconSymbol lib="Feather" name="settings" size={24} color={isDarkMode ? '#F0F0F0' : '#272727'} />
            </Pressable>
          </View>
        </View>
      }
    >
    {/* Main Content */}
    <View style={styles.content}>
      {/* Subtitle */}
      <Text style={[styles.subTitle, { color: isDarkMode ? '#FFFFFF' : '#272727' }]}>
        LIST OF TODO
      </Text>

      {/* Todo Cards */}
      <FlatList
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
        )}/>
      </View>
    </ParallaxScrollView>

    {/* Floating Action Button */}
    <Pressable style={styles.fab} onPress={() => Alert.alert('Add Todo')}>
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
  textTitle : {
    // fontFamily : ''
  },
  buttonSettings: {
    alignItems: 'center',
    // backgroundColor : 'yellow'
  },
  container : {
    flex : 1,
    height : '3%',
    paddingTop : 25,
  },
  content: {
    // flex: 1,
    // backgroundColor : 'yellow',
    // alignItems: 'center',
    // justifyContent: 'center',
    // padding: 20,
  },
  reactLogo: {
    height: 178,
    width: 290,
    bottom: 0,
    left: 0,
    position: 'absolute',
  },

  // container: {
  //   flex: 1,
  // },
  // header: {
  //   flexDirection: 'row',
  //   justifyContent: 'space-between',
  //   alignItems: 'center',
  //   padding: 16,
  //   borderBottomWidth: 1,
  //   borderBottomColor: '#E0E0E0',
  // },
  // textTitle: {
  //   fontSize: 18,
  //   fontWeight: 'bold',
  // },
  // buttonSettings: {
  //   padding: 8,
  // },
  // content: {
  //   padding: 16,
  // },
  subTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  card: {
    backgroundColor: '#F76C6A',
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
    backgroundColor: '#F76C6A',
    height: 56,
    width: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 3,
  },
});
