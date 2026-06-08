import React, { useRef, useState } from "react";
import { View, TextInput, StyleSheet, Text, TouchableOpacity, NativeSyntheticEvent, TextInputKeyPressEventData, BackHandler, ToastAndroid } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Colors } from "@/constants/Colors";
import { useCountdown } from "@/hooks/useCountDown";
import { useDoubleBackPress } from "@/utils/helpers/useBackHandler.utils";
import { useIsFocused } from "@react-navigation/native";
import { authService } from "@/services/auth.service";
import { AuthLayout } from "@/components/auth/AuthLayout";
import { AuthButton } from "@/components/auth/AuthButton";

export default function OtpForm() {
    const isFocused = useIsFocused();
    const [otp, setOtp] = useState(Array(6).fill(""));
    const [isLoading, setIsLoading] = useState(false);
    const [isLoadingSend, setisLoadingSend] = useState(false)
    const [otpError, setOtpError] = useState("");
    const { email } = useLocalSearchParams();
    const inputsRef = useRef<(TextInput | null)[]>([]);
    const router = useRouter();
    const { formatTime, secondsRemaining, start, isActive } = useCountdown(170);

    const handleChange = (text: string, index: number) => {
        if (/^\d?$/.test(text)) {
            const updatedOtp = [...otp];
            updatedOtp[index] = text;
            setOtp(updatedOtp);
            setOtpError("");

            if (text && index < 5) {
                inputsRef.current[index + 1]?.focus();
            }
        }
    };

    const handleKeyPress = (e: NativeSyntheticEvent<TextInputKeyPressEventData>, index: number) => {
        if (e.nativeEvent.key === "Backspace" && otp[index] === "" && index > 0) {
            inputsRef.current[index - 1]?.focus();
        }
    };

    const handleSubmit = async () => {
        const code = otp.join("");
        if (code.length < 6) {
            setOtpError("OTP harus terdiri dari 6 digit angka.");
            return;
        }

        try {
            setIsLoading(true);
            setOtpError("");

            const data = await authService.verifyOtp(email as string, code);

            if(data.status >= 200 && data.status <= 204) {
                router.push({ pathname: "/password-no-auth", params: { email: email } });
                ToastAndroid.show(`OTP Code Successfully Verified : ${code}`, ToastAndroid.SHORT);
            } else {
                ToastAndroid.show(data?.message || 'Maaf Terjadi Kesalahan', ToastAndroid.SHORT);
            }
        } catch (error) {
            ToastAndroid.show("Gagal verifikasi OTP", ToastAndroid.SHORT);
        } finally {
            setTimeout(() => setIsLoading(false), 500);
        }
    };

    useDoubleBackPress(isFocused, () => {
        BackHandler.exitApp();
    });

    const handleResendOtp = async () => {
        try {
            setisLoadingSend(true);
            const data = await authService.forgotPassword(email as string);
            
            if(data.status >= 200 && data.status <= 204) {
                ToastAndroid.show('Successfully sent email back' , ToastAndroid.SHORT);
                start();
            } else {
                ToastAndroid.show(data?.message || 'Maaf Terjadi Kesalahan', ToastAndroid.SHORT);
            }
        } catch (error: any) {
            ToastAndroid.show('Maaf Terjadi Kesalahan', ToastAndroid.SHORT);
        } finally {
            setTimeout(() => setisLoadingSend(false), 500);
        }
    };

    return (
        <AuthLayout subtitle="Enter OTP Code">
            <View style={styles.otpContainer}>
                {otp.map((digit, index) => (
                    <TextInput
                        key={index}
                        ref={(ref) => { inputsRef.current[index] = ref; }}
                        value={otp[index]}
                        onChangeText={(text) => handleChange(text, index)}
                        onKeyPress={(e) => handleKeyPress(e, index)}
                        keyboardType="number-pad"
                        maxLength={1}
                        style={styles.otpInput}
                        editable={!isLoading}
                    />
                ))}
            </View>

            {otpError !== "" && <Text style={styles.textError}>{otpError}</Text>}

            <AuthButton title="VERIFICATION" onPress={handleSubmit} isLoading={isLoading} />

            <View style={styles.hintContainer}>
                <Text style={styles.hintText}>
                    * Haven't received the email ? Please try resending to get the OTP code.
                </Text>
                <Text style={styles.timerText}>{formatTime()}</Text>
                
                {!isActive && (
                    <TouchableOpacity disabled={isLoadingSend} onPress={handleResendOtp} style={styles.buttonResend}>
                        <Text style={{ color: Colors.background }}>Resend</Text>
                    </TouchableOpacity>
                )}
            </View>
        </AuthLayout>
    );
}

const styles = StyleSheet.create({
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
    textError: {
        color: Colors.error,
        textAlign: "center",
        marginBottom: 15,
    },
    hintContainer: {
        marginTop: 15,
        alignItems: 'center',
    },
    hintText: {
        fontSize: 12,
        color: Colors.mediumGray,
        textAlign: 'center',
        marginBottom: 10,
    },
    timerText: {
        color: Colors.error,
        fontSize: 20,
        marginBottom: 10,
    },
    buttonResend: {
        backgroundColor: Colors.primary,
        padding: 10,
        width: 100,
        borderRadius: 10,
        alignItems: 'center',
    },
});
