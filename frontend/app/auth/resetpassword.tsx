import {
  View,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert,
  ScrollView,
  Platform,
  StatusBar,
} from "react-native";
import React, { useState } from "react";
import { useLocalSearchParams, router } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import axios from "axios";
import Text from "../../components/ui/Text";
import Button from "../../components/ui/Button";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { responsiveFontSize as rf } from "react-native-responsive-dimensions";

const API_URL = process.env.EXPO_PUBLIC_API_BASE_URL;

export default function ResetPasswordScreen() {
  const { token, email } = useLocalSearchParams();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const insets = useSafeAreaInsets();

  const handleReset = async () => {
    if (!password || !confirmPassword) {
      Alert.alert("Error", "All fields required");
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert("Error", "Passwords do not match");
      return;
    }

    try {
      setLoading(true);
      await axios.post(`${API_URL}/api/auth/reset-password`, {
        email: email,
        resetToken: token,
        newPassword: password,
      });

      Alert.alert("Success", "Password reset successfully");
      router.replace("/auth/login");
    } catch (error: any) {
      Alert.alert(
        "Error",
        error.response?.data?.message || "Invalid or expired link"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={[styles.outerContainer, { paddingTop: insets.top, paddingBottom: insets.bottom }]}>
      <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent />
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        <Text variant="h2" weight="semibold" style={styles.title}>Create New Password</Text>
        <Text variant="bodySmall" style={styles.subtitle}>
          Your new password must be different from previous ones
        </Text>

        <View style={styles.passwordWrapper}>
          <TextInput
            style={styles.passwordInput}
            placeholder="New password"
            placeholderTextColor="#9ca3af"
            secureTextEntry={!showPassword}
            value={password}
            onChangeText={setPassword}
          />
          <TouchableOpacity
            style={styles.eyeIcon}
            onPress={() => setShowPassword(!showPassword)}
          >
            <Ionicons
              name={showPassword ? "eye-outline" : "eye-off-outline"}
              size={wp(5)}
              color="#6b8a7a"
            />
          </TouchableOpacity>
        </View>

        <View style={styles.passwordWrapper}>
          <TextInput
            style={styles.passwordInput}
            placeholder="Confirm password"
            placeholderTextColor="#9ca3af"
            secureTextEntry={!showConfirmPassword}
            value={confirmPassword}
            onChangeText={setConfirmPassword}
          />
          <TouchableOpacity
            style={styles.eyeIcon}
            onPress={() => setShowConfirmPassword(!showConfirmPassword)}
          >
            <Ionicons
              name={showConfirmPassword ? "eye-outline" : "eye-off-outline"}
              size={wp(5)}
              color="#6b8a7a"
            />
          </TouchableOpacity>
        </View>

        <Button
          title={loading ? "Updating..." : "Reset Password"}
          onPress={handleReset}
          loading={loading}
          style={styles.button}
        />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  outerContainer: {
    flex: 1,
    backgroundColor: "#f0f4f0",
  },
  container: {
    flexGrow: 1,
    paddingHorizontal: wp(6),
    justifyContent: "center",
  },
  title: {
    color: "#1a3c2a",
    marginBottom: hp(1),
    fontSize: rf(3),
  },
  subtitle: {
    color: "#6b8a7a",
    marginBottom: hp(4),
    fontSize: rf(1.8),
  },
  passwordWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: "#ffffff",
    borderRadius: wp(3),
    borderWidth: 1,
    borderColor: "#e2e8e4",
    marginBottom: hp(2),
  },
  passwordInput: {
    flex: 1,
    paddingHorizontal: wp(4),
    paddingVertical: hp(2),
    fontSize: rf(1.8),
    color: "#1a3c2a",
  },
  eyeIcon: {
    paddingHorizontal: wp(4),
  },
  button: {
    marginTop: hp(1),
    elevation: 3,
  },
});
