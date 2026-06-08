import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, KeyboardAvoidingView, Platform, ActivityIndicator, Pressable, ToastAndroid } from "react-native";
import Modal from "react-native-modal";
import { PanGestureHandler, TextInput } from "react-native-gesture-handler";
import DateTimePicker, { DateTimePickerEvent } from "@react-native-community/datetimepicker";
import { Colors } from "@/constants/Colors";
import { IconSymbol } from "../ui/IconSymbol";
import { TodoFormData } from "@/interfaces/todo";
import { validateForm, ValidationSchema } from "@/utils/validators/formData";
import { todoService } from '@/services/todo.service';
import { useSelector } from "react-redux";
import { RootState } from "@/redux/reducer-store";
import { useAuth } from "@/context/auth-provider";
import { formatDateTime } from "@/utils/date";

interface BottomSheetModalProps {
  isVisible: boolean;
  onClose: () => void;
}

const BottomSheetModal: React.FC<BottomSheetModalProps> = ({ isVisible, onClose }) => {
  const { logout } = useAuth();
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [date, setDate] = useState<Date>(new Date());
  const [show, setShow] = useState<boolean>(false);
  const { token } = useSelector((state: RootState) => state.AUTH_REDUCER);
  const isDarkMode = useSelector((state: RootState) => state.THEME_REDUCER.isDark);

  const [formData, setFormData] = useState<TodoFormData>({
    title: '',
    description: '',
    date: '',
    image: ''
  })

  const [formDataError, setFormDataError] = useState<TodoFormData>({
    title: '',
    description: '',
    date: '',
    image: ''
  })

  const handleGesture = (event: any) => {
    if (event.nativeEvent.translationY > 100) {
      handleCloseModal();
    }
  };

  const handleCloseModal = async () => {
    onClose();
    setFormData({
      title: '',
      description: '',
      date: '',
      image: ''
    })
    setDate(new Date())
    setFormDataError({})
  }

  const handleInputChange = (field: keyof TodoFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setFormDataError({})
  };

  const onChange = (event: DateTimePickerEvent, selectedDate?: Date) => {
    if (event.type === "set" && selectedDate) {
      setDate(selectedDate);
    }
    setShow(false);
  };

  const TodoValidationSchema: ValidationSchema<TodoFormData> = {
    title: (value: any) => (!value ? "Title is required" : undefined),
    description: (value: any) => (!value ? "Description is required" : undefined),
  };

  const handleSubmit = async () => {
    const isValid = validateForm(formData, TodoValidationSchema, setFormDataError);
    if (isValid) {
      try {
        setIsLoading(true)
        const convertDate = formatDateTime(date, "YYYY-MM-DD")
        formData.date = convertDate
        const data = await todoService.createTodo(token, formData as any);
        if (data.status >= 200 && data.status <= 204) {
          handleCloseModal()
          ToastAndroid.show('Selamat, Anda telah berhasil membuat todo', ToastAndroid.SHORT);
        }
      } catch (error: any) {
        if (error?.status === 401) {
          ToastAndroid.show("Your session has expired", ToastAndroid.SHORT);
          logout();
        }
        ToastAndroid.show('Maaf Terjadi Kesalahan Harap Menunggu Beberapa Saat Lagi', ToastAndroid.SHORT);
        console.log('Error ==> : ', error)
      } finally {
        setTimeout(() => {
          setIsLoading(false)
        }, 500);
      }
    }
  }

  // Dynamic colors based on theme
  const modalBgColor = isDarkMode ? '#1C1C1E' : '#FFFFFF';
  const inputBgColor = isDarkMode ? '#2C2C2E' : '#F2F2F7';
  const textColor = isDarkMode ? '#FFFFFF' : '#000000';
  const placeholderColor = isDarkMode ? '#8E8E93' : '#8E8E93';

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={styles.container}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 40 : 0}
    >
      <Modal
        isVisible={isVisible}
        swipeDirection="down"
        onSwipeComplete={handleCloseModal}
        onBackdropPress={handleCloseModal}
        animationIn="slideInUp"
        animationOut="slideOutDown"
        style={styles.modal}
        animationInTiming={300}
        animationOutTiming={300}
        backdropOpacity={0.4}
      >
        <PanGestureHandler onGestureEvent={handleGesture}>
          <View style={[styles.modalContent, { backgroundColor: modalBgColor }]}>
            <View style={styles.dragIndicator} />
            
            <View style={styles.headerContainer}>
              <Text style={[styles.headerTitle, { color: textColor }]}>Buat Tugas Baru</Text>
            </View>

            <View style={styles.formContainer}>
              {/* Title Input */}
              <View style={styles.inputContainer}>
                <TextInput
                  style={[styles.input, { backgroundColor: inputBgColor, color: textColor }]}
                  placeholder="Judul Tugas..."
                  placeholderTextColor={placeholderColor}
                  keyboardType="default"
                  value={formData?.title}
                  onChangeText={(text) => handleInputChange('title', text)}
                  editable={!isLoading}
                />
                {formDataError.title ? <Text style={styles.textError}>{formDataError.title}</Text> : null}
              </View>

              {/* Description Input */}
              <View style={styles.inputContainer}>
                <TextInput
                  placeholder="Ketik deskripsi tugas di sini..."
                  placeholderTextColor={placeholderColor}
                  multiline={true}
                  style={[styles.input, styles.textAreaInput, { backgroundColor: inputBgColor, color: textColor }]}
                  value={formData?.description}
                  onChangeText={(text) => handleInputChange('description', text)}
                  editable={!isLoading}
                />
                {formDataError.description ? <Text style={styles.textError}>{formDataError.description}</Text> : null}
              </View>

              {/* Date Picker Input */}
              <View style={styles.inputContainer}>
                <Pressable onPress={() => setShow(true)}>
                  <View style={[styles.inputWithIcon, { backgroundColor: inputBgColor }]}>
                    <IconSymbol
                      name="calender-outline"
                      lib="Ionicons"
                      size={20}
                      color={Colors.primary}
                      style={{ marginRight: 10 }}
                    />
                    <Text style={{ color: date ? textColor : placeholderColor, flex: 1, fontSize: 16 }}>
                      {date.toDateString() || 'Pilih Tenggat Waktu (Opsional)'}
                    </Text>
                  </View>
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

              {/* Submit Button */}
              <TouchableOpacity 
                disabled={isLoading} 
                style={[styles.submitButton, { opacity: isLoading ? 0.7 : 1 }]} 
                onPress={handleSubmit}
              >
                {isLoading ? (
                  <ActivityIndicator size={'small'} color="#FFF" /> 
                ) : (
                  <Text style={styles.submitText}>Simpan Tugas</Text>
                )}
              </TouchableOpacity>
            </View>
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
    padding: 24,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    alignItems: "center",
  },
  dragIndicator: {
    width: 40,
    height: 4,
    backgroundColor: '#D1D1D6',
    borderRadius: 2,
    marginBottom: 20,
  },
  headerContainer: {
    width: '100%',
    marginBottom: 24,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  formContainer: {
    width: '100%',
  },
  inputContainer: {
    marginBottom: 16,
    width: '100%',
  },
  input: {
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
  },
  textAreaInput: {
    height: 120,
    textAlignVertical: "top",
    paddingTop: 16,
  },
  inputWithIcon: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  submitButton: {
    backgroundColor: Colors.primary,
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 20,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  submitText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
  textError: {
    color: '#FF3B30',
    fontSize: 12,
    marginTop: 6,
    marginLeft: 4,
  },
});

export default BottomSheetModal;
