import React, { useRef } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import BottomSheet from "react-native-gesture-bottom-sheet";

interface BottomSheetModalProps {
  isVisible: boolean;
  onClose: () => void;
}

const BottomSheetModal: React.FC<BottomSheetModalProps> = ({ isVisible, onClose }) => {
    // Needed in order to use .show()
    const bottomSheet = useRef();
    return (
        <BottomSheet hasDraggableIcon ref={bottomSheet} height={600}>
            <View style={styles.container}>
                <Text style={styles.title}>Hello, I'm a modal!</Text>
                <TouchableOpacity style={styles.closeButton} onPress={onClose}>
                <Text style={styles.closeText}>Close</Text>
                </TouchableOpacity>
            </View>
        </BottomSheet>
    );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 20,
  },
  closeButton: {
    backgroundColor: "#ff5252",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  closeText: {
    color: "white",
    fontSize: 16,
  },
});

export default BottomSheetModal;
