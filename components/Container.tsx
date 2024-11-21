import { StyleSheet, View, type ViewProps } from 'react-native';

export type ContainerProps = ViewProps & {
    children?: React.ReactNode; // Tambahkan children sebagai bagian dari properti
    isDarkMode : boolean;
  };


export function Container({ style, isDarkMode, children, ...props }: ContainerProps) {
    return <View style={[styles.container, style, { backgroundColor: !isDarkMode ? '#A6AEBF' : '#272727'}]} {...props}>{children}</View>
}

const styles = StyleSheet.create({
    container: {
        flex : 1,
        paddingTop : '6.5%',
    },
})