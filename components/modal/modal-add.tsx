import React from "react";
import { View, Text, TouchableOpacity, StyleSheet, KeyboardAvoidingView, Platform } from "react-native";
import Modal from "react-native-modal";
import { PanGestureHandler, State, TextInput } from "react-native-gesture-handler";
import { Colors } from "react-native/Libraries/NewAppScreen";

interface BottomSheetModalProps {
  isVisible: boolean;
  onClose: () => void;
}

const BottomSheetModal: React.FC<BottomSheetModalProps> = ({ isVisible, onClose }) => {
  const handleGesture = (event: any) => {
    console.log(event.nativeEvent.translationY)
    if (event.nativeEvent.translationY > 100) {
      onClose();
    }
  };

  // handle change input text
  // const handleInputChange = (field: keyof FormDataSignInPayload, value: string) => {
  //   setFormData((prev) => ({ ...prev, [field]: value }));
  //   setFormDataError({})
  // };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={styles.container}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 40 : 0}
    >
      <Modal
        isVisible={isVisible}
        swipeDirection="down"
        onSwipeComplete={onClose}
        onBackdropPress={onClose}
        animationIn="slideInUp"
        animationOut="slideOutDown"
        style={styles.modal}
        animationInTiming={300}
        animationOutTiming={300}
        backdropOpacity={0} // 🔥 Bikin background transparan
      >
        <PanGestureHandler onGestureEvent={handleGesture}>
          <View style={styles.modalContent}>
            <View style={styles.dragIndicator} />
            {/* <Text style={styles.modalText}>Hello, I'm a modal add todo...!</Text> */}
            <View style={styles.formContainer}>
              <View style={styles.inputContainer}>
                <TextInput
                  style={styles.input}
                  placeholder="Title"
                  // value={formData.email}
                  // onChangeText={(text) => handleInputChange('email', text)}
                  keyboardType="default"
                  // autoCapitalize="none"
                  // editable={!isLoading}
                />
                {/* {formDataError.email && 
                  <Text style={styles.textError}>{formDataError.email}</Text>
                } */}
              </View>

              <View style={styles.inputContainer}>
                <TextInput
                  style={styles.input}
                  placeholder="Description"
                  // value={formData.email}
                  // onChangeText={(text) => handleInputChange('email', text)}
                  // keyboardType="email-address"
                  // autoCapitalize="none"
                  // editable={!isLoading}
                />
                {/* {formDataError.email && 
                  <Text style={styles.textError}>{formDataError.email}</Text>
                } */}
              </View>

              <View style={styles.inputContainer}>
                <TextInput
                  style={styles.input}
                  placeholder="Description"
                  // value={formData.email}
                  // onChangeText={(text) => handleInputChange('email', text)}
                  // keyboardType="email-address"
                  // autoCapitalize="none"
                  // editable={!isLoading}
                />
                {/* {formDataError.email && 
                  <Text style={styles.textError}>{formDataError.email}</Text>
                } */}
              </View>
            </View>
            
            {/* <TouchableOpacity style={styles.closeButton} onPress={onClose}>
              <Text style={styles.closeText}>Close</Text>
            </TouchableOpacity> */}
          </View>
        </PanGestureHandler>
      </Modal>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  modal: {
    justifyContent: "flex-end",
    margin: 0,
  },
  modalContent: {
    backgroundColor: "white",
    padding: 20,
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
    alignItems: "center",
    height:'90%',
  },
  dragIndicator: {
    width: 50,
    height: 5,
    backgroundColor: "#ccc",
    borderRadius: 3,
    marginBottom: 10,
  },
  modalText: {
    fontSize: 16,
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
  inputContainer: {
    marginBottom: 15,
    position: 'relative',
  },
  input: {
    borderWidth: 1,
    borderColor: Colors.borderLight,
    borderRadius: 8,
    padding: 15,
    fontSize: 16,
    backgroundColor: Colors.background,
  },
  formContainer : {
    width: '100%',
    paddingHorizontal: 15,
    marginTop:5,
  }
});

export default BottomSheetModal;
