import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, KeyboardAvoidingView, Platform, ActivityIndicator, Pressable, ToastAndroid } from "react-native";
import Modal from "react-native-modal";
import { PanGestureHandler, TextInput } from "react-native-gesture-handler";
import DateTimePicker, { DateTimePickerEvent } from "@react-native-community/datetimepicker";
import { Colors } from "@/constants/Colors";
import { IconSymbol } from "../ui/IconSymbol";
import { TodoFormData } from "@/interfaces/todo";
import { validateForm, ValidationSchema } from "@/utils/validators/formData";
import { fetchApi } from "@/utils/helpers/fetchApi.utils";
import { ConfigApiURL } from "@/constants/Config";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/reducer-store";
import { useAuth } from "@/context/auth-provider";
import { formatDateTime } from "@/utils/date";
import { useRouter } from "expo-router";
import { TodoDetail } from "@/interfaces/home";
interface BottomSheetModalProps {
  isVisible: boolean;
  onClose: () => void;
  params?: TodoDetail;
}

const BottomSheetModalEdit: React.FC<BottomSheetModalProps> = ({ isVisible, onClose, params }) => {
  const { logout } = useAuth();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [date, setDate] = useState<Date>(new Date());
  const [show, setShow] = useState<boolean>(false);
  const { token, login } = useSelector((state:RootState) => state.AUTH_REDUCER);
  const [formData, setFormData] = useState<TodoFormData>({
    title: '',
    description: '',
    date: '',
    image: '',
  })

  const [formDataError, setFormDataError] = useState<TodoFormData>({
    title: '',
    description: '',
    date: '',
    image: ''
  })

  const handleGesture = (event: any) => {
    if (event.nativeEvent.translationY > 100) {
      onClose();
    }
  };

  const handleCloseModal = async () => {
    onClose();
    // setFormData({
    //   title: '',
    //   description: '',
    //   date: '',
    //   image: ''
    // })
    // setDate(new Date())
    // setFormDataError({})
  }

  // // handle change input text
  const handleInputChange = (field: keyof TodoFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setFormDataError({})
  };

  const onChange = (event: DateTimePickerEvent, selectedDate?: Date) => {
    if (event.type === "set" && selectedDate) {
      setDate(selectedDate);
      const convertDate = formatDateTime(selectedDate, "YYYY-MM-DD")
      // console.log(convertDate)
      setFormData({
        ...formData,
        date : convertDate
      })
    }
    setShow(false); // Menutup date picker setelah pemilihan
  };

  const TodoValidationSchema : ValidationSchema<TodoFormData> = {
    title: (value:any) => (!value ? "Title is required" : undefined),
    description: (value:any) => (!value ? "Description is required" : undefined),
  };

  const handleSubmit = async () => {
    const isValid = validateForm(formData, TodoValidationSchema, setFormDataError);
    if(isValid){
      try {
        setIsLoading(true)
        const additionalHeaders = {
          Authorization: `Bearer ${token}`,
        };
        // console.log(formData)
        const base_url = !!ConfigApiURL.env_url ?
          `/api${ConfigApiURL.env_url}/todo/${ConfigApiURL.prefix_url}/edit/${params?.id_todo}/exist` :
          `/api/todo/${ConfigApiURL.prefix_url}/edit/${params?.id_todo}/exist`
        const data = await fetchApi(
          base_url,
          'PUT',
          formData,
          additionalHeaders,
        )
        if(data.status_code >= 200 && data.status_code <= 204) 
          router.replace('/(home)/home')
          ToastAndroid.show('Selamat, Anda telah berhasil update todo', ToastAndroid.SHORT);
      } catch (error:any) {
        if (error?.status === 401) {
          ToastAndroid.show("Your session has expired", ToastAndroid.SHORT);
          logout();
        }
        ToastAndroid.show('Maaf Terjadi Kesalahan Harap Menunggu Beberapa Saat Lagi', ToastAndroid.SHORT);
        console.log('Erorr ==> : ', error)
      } finally {
        setTimeout(() => {
          setIsLoading(false)
        }, 500);
      }
    }
  }

  useEffect(() => {
    setFormData({
      ...params
    })
  }, [params])

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
        backdropOpacity={0.2} // 🔥 Bikin background transparan
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
                  value={formData?.title}
                  onChangeText={(text) => handleInputChange('title', text)}
                  editable={!isLoading}
                />
                {formDataError.title && 
                  <Text style={styles.textError}>{formDataError.title}</Text>
                }
              </View>

              <View style={styles.inputContainer}>
                <TextInput
                  placeholder="Description"
                  multiline={true}
                  style={[styles.input, styles.textAreaInput]}
                  numberOfLines={50}
                  value={formData?.description}
                  onChangeText={(text) => handleInputChange('description', text)}
                  editable={!isLoading}
                />
                {formDataError.description && 
                  <Text style={styles.textError}>{formDataError.description}</Text>
                }
              </View>

              <View style={styles.inputContainer}>
                <Pressable onPress={() => setShow(true)}>
                  <TextInput
                    style={[styles.input]}
                    placeholder="Deadline (Optional)"
                    value={formData.date ? 
                      formatDateTime(String(formData.date), 'DD/MM/YYYY') 
                      : ''
                    }
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

              <TouchableOpacity disabled={isLoading} style={styles.signInButton} onPress={handleSubmit}>
                {isLoading ?
                  <ActivityIndicator size={'small'} color={Colors.background} /> 
                :
                  <Text style={styles.signInText}>edit{' '}todo</Text>
                }
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
    height: 350,
    textAlignVertical: "top"
  },
  textError : {
    color: Colors.error,
    marginTop: 5,
  },
});

export default BottomSheetModalEdit;
