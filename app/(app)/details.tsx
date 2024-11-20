import { Container } from '@/components/Container'
import { RootState } from '@/redux/reducer-store';
import { useNavigation } from '@react-navigation/native';
import React, { useEffect, useState } from 'react'
import { StyleSheet } from 'react-native'
import { useSelector } from 'react-redux';

export default function DetailsScreen() {
    const navigation = useNavigation();
    const isDark = useSelector((state:RootState) => state.THEME_REDUCER.isDark);
    const [isDarkMode, setIsDarkMode] = useState(isDark);

    useEffect(() => {
        const unsubscribe = navigation.addListener('focus', () => {
          // Log makesure state Redux
          console.log('Refreshed Detail State:', isDark);
        });
        setIsDarkMode(isDark)
        // Clean up listeners when component is unmounted
        return unsubscribe;
      }, [navigation, isDark]);

    return (
        <Container style={[styles.container]} isDarkMode={isDarkMode}>
            <div>DetailsScreen</div>
        </Container>
    )
}

const styles = StyleSheet.create({
    container: {}
})