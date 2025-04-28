import { StyleSheet } from 'react-native';
import { Colors } from '../../constants/Colors'; // Adjust the path to your Colors file if needed

const styles = StyleSheet.create({
    container : {},
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
      fontWeight : 'bold',
    },
    buttonSettings: {
      alignItems: 'center',
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
      color: Colors.background,
      fontSize: 18,
      fontWeight: 'bold',
    },
    cardDescription: {
      color: Colors.background,
      fontSize: 14,
      marginBottom: 8,
    },
    cardFooter: {
      color: Colors.background,
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
    GesturModal : {
      position: 'absolute',
    },
});

export default styles;