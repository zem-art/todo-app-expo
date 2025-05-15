import React, { useRef, useState } from "react";
import {
    View,
    TextInput,
    StyleSheet,
    Text,
    TouchableOpacity,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    Dimensions,
    ActivityIndicator,
    NativeSyntheticEvent,
    TextInputKeyPressEventData,
} from "react-native";
import { ToastAndroid } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Colors } from "@/constants/Colors";
import { IconSymbol } from "@/components/ui/IconSymbol";
import { useCountdown } from "@/hooks/useCountDown";

export default function OtpForm() {
    const [otp, setOtp] = useState(Array(6).fill(""));
    const [isLoading, setIsLoading] = useState(false);
    const [otpError, setOtpError] = useState("");
    const { email } = useLocalSearchParams();
    const inputsRef = useRef<(TextInput | null)[]>([]);
    const router = useRouter();
    const { formatTime, secondsRemaining, start, isActive } = useCountdown(60); // 180 detik = 3 menit

    const handleChange = (text: string, index: number) => {
        if (/^\d?$/.test(text)) {
            const updatedOtp = [...otp];
            updatedOtp[index] = text;
            setOtp(updatedOtp);
            setOtpError("");

            // Pindah fokus ke kolom berikutnya jika ada input
            if (text && index < 5) {
                inputsRef.current[index + 1]?.focus();
            }
        }
    };

    const handleKeyPress = (
        e: NativeSyntheticEvent<TextInputKeyPressEventData>,
        index: number
    ) => {
        if (e.nativeEvent.key === "Backspace" && otp[index] === "" && index > 0) {
            inputsRef.current[index - 1]?.focus();
        }
    };

    const handleSubmit = () => {
        const code = otp.join("");
        if (code.length < 6) {
            setOtpError("OTP harus terdiri dari 6 digit angka.");
            return;
        }

        try {
            setIsLoading(true);
            setOtpError("");
            // Kirim OTP ke backend untuk verifikasi

            router.push({
                pathname: "/password-no-auth",
                params: {
                    email: email,
                },
            });

            // Contoh: await verifyOtp(code);
            ToastAndroid.show(`Kode OTP: ${code}`, ToastAndroid.SHORT);
        } catch (error) {
            ToastAndroid.show("Gagal verifikasi OTP", ToastAndroid.SHORT);
        } finally {
            setTimeout(() => {
                setIsLoading(false);
            }, 500);
        }
    };

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : undefined}
            style={styles.container}
            keyboardVerticalOffset={Platform.OS === "ios" ? 40 : 0}
        >
            <ScrollView
                contentContainerStyle={styles.scrollContent}
                keyboardShouldPersistTaps="handled"
            >
                <View style={styles.content}>
                    <View style={styles.titleContainer}>
                        <Text style={[styles.titleText, { fontSize: 50, marginBottom: 0 }]}>
                            T O
                        </Text>
                        <Text style={[styles.titleText, { fontSize: 50, marginBottom: 0 }]}>
                            D O
                        </Text>
                        <Text style={[styles.titleText, { fontSize: 50, marginBottom: 0 }]}>
                            L I S T
                        </Text>
                        <IconSymbol
                            lib="Ionicons"
                            name="checkboxOutline"
                            size={24}
                            color={Colors.primary}
                            style={styles.checkIcon}
                        />
                    </View>
                    <Text style={[styles.titleText]}>Enter OTP Code</Text>

                    <View style={styles.otpContainer}>
                        {otp.map((digit, index) => (
                            <TextInput
                                key={index}
                                ref={(ref) => (inputsRef.current[index] = ref)}
                                value={otp[index]}
                                onChangeText={(text) => handleChange(text, index)}
                                onKeyPress={(e) => handleKeyPress(e, index)}
                                keyboardType="number-pad"
                                maxLength={1}
                                style={styles.otpInput}
                            />
                        ))}
                    </View>

                    {otpError !== "" && <Text style={styles.textError}>{otpError}</Text>}

                    <View style={styles.buttonContainer}></View>
                    <TouchableOpacity
                        disabled={isLoading}
                        style={styles.signInButton}
                        onPress={handleSubmit}
                    >
                        {isLoading ? (
                            <ActivityIndicator size={"small"} color={Colors.background} />
                        ) : (
                            <Text style={styles.signInText}>verification</Text>
                        )}
                    </TouchableOpacity>

                    <View style={[styles.inputContainer, { paddingHorizontal: 7 }]}>
                        <Text
                            style={[
                                styles.textError,
                                { fontSize: 12, color: Colors.mediumGray },
                            ]}
                        >
                            * Haven't received the email ? Please try resending to get the OTP
                            code.
                        </Text>
                        <Text
                            style={[styles.textError, { color: Colors.error, fontSize: 20 }]}
                        >
                            {formatTime()}
                        </Text>
                        {
                            !isActive && (
                                <TouchableOpacity
                                    disabled={isActive}
                                    onPress={start}
                                    style={styles.buttonResend}
                                >
                                    <Text style={{ color: Colors.background }}>Resend</Text>
                                </TouchableOpacity>
                            )
                        }
                    </View>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.background,
    },
    scrollContent: {
        flexGrow: 1,
        justifyContent: "center",
    },
    content: {
        flex: 1,
        padding: 20,
        justifyContent: "center",
        minHeight: Dimensions.get("window").height - 100,
    },
    titleContainer: {
        alignItems: "center",
        marginBottom: 40,
    },
    checkIcon: {
        position: "absolute",
        right: Dimensions.get("window").width * 0.2,
        top: 0,
    },
    titleText: {
        fontSize: 24,
        fontWeight: "bold",
        color: Colors.primary,
        textAlign: "center",
        marginBottom: 30,
    },
    otpContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom: 20,
        paddingHorizontal: 10,
    },
    otpInput: {
        width: 45,
        height: 55,
        borderWidth: 1,
        borderColor: Colors.borderLight,
        borderRadius: 10,
        textAlign: "center",
        fontSize: 22,
        backgroundColor: Colors.background,
    },
    inputContainer: {
        marginTop: 15,
        position: "relative",
    },
    signInButton: {
        backgroundColor: Colors.primary,
        padding: 15,
        borderRadius: 8,
        alignItems: "center",
    },
    signInText: {
        color: Colors.background,
        fontSize: 16,
        fontWeight: "bold",
        textTransform: "uppercase",
    },
    textError: {
        color: Colors.error,
        textAlign: "center",
        marginBottom: 15,
    },
    buttonContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
    },
    buttonResend: {
        alignSelf: "center",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: Colors.primary,
        padding: 10,
        width: 100,
        borderRadius: 10,
    },
});
