import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView, Alert, Switch } from 'react-native';
import { Colors } from '@/constants/Colors';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { useRouter, Link } from 'expo-router';
import { useSelector, useDispatch } from 'react-redux';
import { AppDispatch, RootState } from '@/redux/reducer-store';
import { setThemeActions } from '@/redux/actions';
import { useAuth } from '@/context/auth-provider';
import convertToHyphen from '@/utils/helpers/string';

const Profile = () => {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const { logout } = useAuth();

  const isDark = useSelector((state: RootState) => state.THEME_REDUCER.isDark);
  const { data }: any = useSelector((state: RootState) => state.USER_REDUCER);

  const [isDarkMode, setIsDarkMode] = useState(isDark);

  const toggleTheme = () => {
    dispatch(setThemeActions());
    setIsDarkMode(!isDarkMode);
  };

  const confirmLogout = async () => {
    Alert.alert(
      "Keluar Akun",
      "Apakah Anda yakin ingin keluar?",
      [
        { text: "Batal", style: "cancel" },
        { text: "Ya, Keluar", onPress: () => logout(), style: "destructive" },
      ]
    );
  };

  // Get User Initial
  const userName = data?.username ? convertToHyphen(data.username) : "User";
  const userInitial = userName.charAt(0).toUpperCase();

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: isDarkMode ? Colors.veryDarkGray : Colors.background }]}
      contentContainerStyle={{ paddingBottom: 60 }}
    >
      {/* Header / Top Navigation */}
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.backButton}>
          <IconSymbol lib="AntDesign" name="left" size={24} color={isDarkMode ? '#FFF' : '#000'} />
        </Pressable>
        <Text style={[styles.headerTitle, { color: isDarkMode ? '#FFF' : '#000' }]}>Profil Saya</Text>
        <View style={{ width: 40 }} />
      </View>

      {/* Avatar & User Info */}
      <View style={styles.profileSection}>
        <View style={styles.avatarContainer}>
          <Text style={styles.avatarText}>{userInitial}</Text>
        </View>
        <Text style={[styles.userName, { color: isDarkMode ? '#FFF' : '#000' }]}>{userName}</Text>
        <Text style={styles.userEmail}>{data?.email || "email@example.com"}</Text>
      </View>

      {/* Cards Section */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: isDarkMode ? '#FFF' : '#000' }]}>Akun</Text>

        <View style={[styles.card, { backgroundColor: isDarkMode ? '#1C1C1E' : '#FFFFFF' }]}>
          <Link href="/profile/password" asChild>
            <Pressable style={styles.cardRow}>
              <View style={styles.cardRowLeft}>
                <View style={[styles.iconContainer, { backgroundColor: isDarkMode ? '#2C2C2E' : '#F2F2F7' }]}>
                  <IconSymbol lib="Feather" name="lock" size={20} color={isDarkMode ? '#FFF' : Colors.primary} />
                </View>
                <Text style={[styles.cardText, { color: isDarkMode ? '#FFF' : '#000' }]}>Ubah Kata Sandi</Text>
              </View>
              <IconSymbol lib="Feather" name="chevron-right" size={20} color="#8E8E93" />
            </Pressable>
          </Link>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: isDarkMode ? '#FFF' : '#000' }]}>Preferensi</Text>

        <View style={[styles.card, { backgroundColor: isDarkMode ? '#1C1C1E' : '#FFFFFF' }]}>
          <View style={styles.cardRow}>
            <View style={styles.cardRowLeft}>
              <View style={[styles.iconContainer, { backgroundColor: isDarkMode ? '#2C2C2E' : '#F2F2F7' }]}>
                <IconSymbol lib="Feather" name={isDarkMode ? "moon" : "sun"} size={20} color={isDarkMode ? '#FFF' : Colors.primary} />
              </View>
              <Text style={[styles.cardText, { color: isDarkMode ? '#FFF' : '#000' }]}>Mode Gelap</Text>
            </View>
            <Switch
              value={isDarkMode}
              onValueChange={toggleTheme}
              trackColor={{ false: '#D1D1D6', true: Colors.primary }}
              thumbColor={'#FFFFFF'}
            />
          </View>
        </View>
      </View>

      {/* Logout Button */}
      <View style={styles.logoutContainer}>
        <Pressable
          style={({ pressed }) => [
            styles.logoutButton,
            { opacity: pressed ? 0.7 : 1 }
          ]}
          onPress={confirmLogout}
        >
          <IconSymbol lib="Feather" name="log-out" size={20} color="#FF3B30" style={{ marginRight: 8 }} />
          <Text style={styles.logoutText}>Keluar Akun</Text>
        </Pressable>
      </View>

    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 15,
  },
  backButton: {
    padding: 8,
    marginLeft: -8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
  },
  profileSection: {
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 40,
  },
  avatarContainer: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  avatarText: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#FFF',
  },
  userName: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
    textTransform: 'uppercase'
  },
  userEmail: {
    fontSize: 15,
    color: '#8E8E93',
  },
  section: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 12,
    opacity: 0.6,
  },
  card: {
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  cardRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  cardRowLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  cardText: {
    fontSize: 16,
    fontWeight: '500',
  },
  logoutContainer: {
    paddingHorizontal: 20,
    marginTop: 20,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 59, 48, 0.1)', // Soft transparent red
    paddingVertical: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 59, 48, 0.2)',
  },
  logoutText: {
    color: '#FF3B30',
    fontSize: 16,
    fontWeight: 'bold',
  }
});

export default Profile;