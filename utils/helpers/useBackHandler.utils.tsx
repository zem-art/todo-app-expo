import { useEffect, useState } from 'react';
import { BackHandler, Alert, ToastAndroid } from 'react-native';

/**
 * 
 * @param isFocused with a bolean value, namely isFocus()
 * @param onExit Using a backhandler only, namely Backhandler.Exit()
 * @returns 
 */
export const useBackHandler = (isFocused:boolean, onExit:any) => {
  const handleBackPress = () => {
    Alert.alert(
      "Exit Application",
      "Are you sure you want to exit the application?",
      [
        { text: "Cancel", style: "cancel" },
        { text: "Exit", onPress: onExit || (() => BackHandler.exitApp()) }
      ],
      { cancelable: true }
    );
    return true; // Prevent default back action
  };

  useEffect(() => {
    if (isFocused) {
      const backHandler = BackHandler.addEventListener(
        'hardwareBackPress',
        handleBackPress
      );

      // Cleanup listener when screen is unfocused
      return () => backHandler.remove();
    }
  }, [isFocused, onExit]);

  return null;
};

/**
 * 
 * @param isFocused with a bolean value, namely isFocus()
 * @param exitCallback You can use the Backhandler.Exit() function or you can use Alert.alert()
 * @returns 
 */
export const useDoubleBackPress = (isFocused:boolean, exitCallback:any) => {
    const [backPressCount, setBackPressCount] = useState(0);

    useEffect(() => {
      if (isFocused) {
        const backHandler = BackHandler.addEventListener(
          'hardwareBackPress',
          handleBackPress
        );
  
        return () => backHandler.remove(); // Cleanup listener
      }
    }, [isFocused, backPressCount]);
  
    const handleBackPress = () => {
      if (backPressCount === 0) {
        // Jika tombol back ditekan pertama kali
        ToastAndroid.show('Silahkan klik tombol kembali sekali lagi untuk keluar', ToastAndroid.SHORT);
        setBackPressCount(1);
  
        // Reset hitungan tombol back setelah 1 detik
        setTimeout(() => setBackPressCount(0), 1000);
        return true; // Cegah aksi default
      } else {
        // Jika tombol back ditekan kedua kali
        if (exitCallback) {
          exitCallback(); // Eksekusi callback jika ada
        } else {
          Alert.alert(
            "Exit Application",
            "Are you sure you want to exit the application?",
            [
              { text: "Cancel", style: "cancel" },
              { text: "Exit", onPress: () => BackHandler.exitApp() }
            ],
            { cancelable: true }
          );
        }
        return true; // Cegah aksi default
      }
    };
  
    return null;
};


/**
 * HOW TO USE BACKHANDLER FUNCTION
 * 
 * this is use BackHandler
 * 
*   useBackHandler(isFocused, () => {
        console.log("Custom exit logic executed!");
        BackHandler.exitApp(); // Default exit action
    });
 * 
 * 
 * this is useDoublePress
*   useDoubleBackPress(isFocused, () => {
    console.log("Custom exit logic executed!");
    //  BackHandler.exitApp(); // Default exit action
 
    //  Alert.alert(
    //    "Exit Application",
    //    "Are you sure you want to exit the application?",
    //    [
    //      { text: "Cancel", style: "cancel" },
    //      { text: "Exit", onPress: () => BackHandler.exitApp() }
    //    ],
    //    { cancelable: true }
    //  );
    });
 * 
 * 
 * 
 * 
 */


// // useEffect BackHandller Handphone
//   useEffect(() => {
//     if (isFocused) {
//       const backHandler = BackHandler.addEventListener(
//         'hardwareBackPress',
//         handleBackPress
//       );
//       // Cleanup listener when screen is off
//       return () => backHandler.remove();
//     }
//   }, [isFocused]);

//   const handleBackPress = () => {
//     Alert.alert(
//       "Exit Application", // Pop-up title
//       "Are you sure you want to exit the application ?", // Message
//       [
//         { text: "Cancel", style: "cancel" }, // Cancel button
//         { text: "Exit", onPress: () => BackHandler.exitApp() } // Exit button
//       ],
//       { cancelable: true } // Close if area outside pop-up is touched
//     );
//     return true; // Prevent default action of back button
//   };