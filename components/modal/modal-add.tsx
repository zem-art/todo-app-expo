import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, KeyboardAvoidingView, Platform, ActivityIndicator, Button, Pressable } from "react-native";
import Modal from "react-native-modal";
import { PanGestureHandler, State, TextInput } from "react-native-gesture-handler";
import DateTimePicker, { DateTimePickerEvent } from "@react-native-community/datetimepicker";
import { Colors } from "@/constants/Colors";
import { Ionicons } from "@expo/vector-icons";
import { IconSymbol } from "../ui/IconSymbol";

interface BottomSheetModalProps {
  isVisible: boolean;
  onClose: () => void;
}

const BottomSheetModal: React.FC<BottomSheetModalProps> = ({ isVisible, onClose }) => {
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [date, setDate] = useState<Date>(new Date());
  const [show, setShow] = useState<boolean>(false);

  const handleGesture = (event: any) => {
    if (event.nativeEvent.translationY > 100) {
      onClose();
    }
    setDate(new Date())
  };

  // handle change input text
  // const handleInputChange = (field: keyof FormDataSignInPayload, value: string) => {
  //   setFormData((prev) => ({ ...prev, [field]: value }));
  //   setFormDataError({})
  // };

  const onChange = (event: DateTimePickerEvent, selectedDate?: Date) => {
    if (event.type === "set" && selectedDate) {
      setDate(selectedDate);
    }
    setShow(false); // Menutup date picker setelah pemilihan
  };

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
                  keyboardType="default"
                  // value={formData.email}
                  // onChangeText={(text) => handleInputChange('email', text)}
                  // autoCapitalize="none"
                  // editable={!isLoading}
                />
                {/* {formDataError.email && 
                  <Text style={styles.textError}>{formDataError.email}</Text>
                } */}
              </View>

              <View style={styles.inputContainer}>
                <TextInput
                  placeholder="Description"
                  multiline={true}
                  style={[styles.input, styles.textAreaInput]}
                  numberOfLines={50}
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
                <Pressable onPress={() => setShow(true)}>
                  <TextInput
                    style={[styles.input]}
                    placeholder="Deadline (Optional)"
                    value={date.toDateString() || ''}
                    editable={false}
                  />
                  <IconSymbol
                    name="calenderOutline"
                    lib="Ionicons"
                    size={24}
                    style={styles.iconTextInput}
                    color={Colors.background}
                  />
                </Pressable>
                {show && (
                  <DateTimePicker
                    value={date}
                    mode="date"
                    display={Platform.OS === "ios" ? "calendar" : "default"}
                    onChange={onChange}
                  />
                )}
              </View>


              <View style={styles.inputContainer}>
                <Pressable>
                  <TextInput
                    style={[styles.input]}
                    placeholder="Upload Image (Optional)"
                    editable={false}
                  />
                  <IconSymbol
                    name="imageOutline"
                    lib="Ionicons"
                    size={24}
                    style={styles.iconTextInput}
                    color={Colors.background}
                  />
                </Pressable>
              </View>

              <TouchableOpacity disabled={isLoading} style={styles.signInButton}>
                {isLoading ?
                  <ActivityIndicator size={'small'} color={Colors.background} /> 
                :
                  <Text style={styles.signInText}>add{' '}todo</Text>
                }
              </TouchableOpacity>
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
    backgroundColor: Colors.primary,
    padding: 20,
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
    alignItems: "center",
    height:'90%',
  },
  dragIndicator: {
    width: 50,
    height: 5,
    backgroundColor: Colors.background,
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
    borderColor: Colors.background,
    borderRadius: 8,
    padding: 15,
    fontSize: 16,
    backgroundColor: Colors.primary,
  },
  formContainer : {
    width: '100%',
    paddingHorizontal: 15,
    marginTop:5,
  },
  signInButton: {
    backgroundColor: Colors.background,
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 20,
  },
  signInText: {
    color: Colors.primary,
    fontSize: 16,
    fontWeight: 'bold',
    textTransform: 'uppercase'
  },
  iconTextInput : { 
    position: "absolute",
    right: 10,
    top: 15
  },
  textAreaInput : { 
    height: 200,
    textAlignVertical: "top"
  }
});

export default BottomSheetModal;
