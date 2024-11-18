import React, { useState } from 'react'
import { StyleSheet, Text, View } from 'react-native'

export default function Settings() {
    const [isDarkMode, setIsDarkMode] = useState(false);
    return (
        <View style={[styles.container, { backgroundColor: !isDarkMode ? '#F0F0F0' : '#272727' }]}>
            <Text> Hello</Text>
        </View>
    )
}

const styles = StyleSheet.create({
    container : {
        flex : 1,
        height : '3%',
        paddingTop : 25,
    },
})
