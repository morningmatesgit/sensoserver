import {
  View,
  StyleSheet,
  TextInput,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
  StatusBar,
} from "react-native";
import React, { useState } from "react";
import { router } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { forgotPassword } from "../../services/authService";
import Text from "../../components/ui/Text";
import Button from "../../components/ui/Button";
import BackButton from "../../components/ui/BackButton";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { responsiveFontSize as rf } from "react-native-responsive-dimensions";

export default function ForgotPasswordScreen() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const insets = useSafeAreaInsets();

  const handleBack = () => router.back();

  const handleSubmit = async () => {
    if (!email) {
      Alert.alert("Error", "Please enter your email");
      return;
    }

    try {
      setLoading(true);
      await forgotPassword(email.toLowerCase().trim());

      Alert.alert("Success", "If an account exists with that email, a password reset link has been sent.");
      router.replace("/auth/login");
    } catch (error: any) {
      Alert.alert(
        "Error",
        error.message || "Something went wrong"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={[styles.outerContainer, { paddingTop: insets.top, paddingBottom: insets.bottom }]}>
      <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent />
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <ScrollView contentContainerStyle={styles.container}>
          {/* Header */}
          <View style={styles.header}>
            <BackButton onPress={handleBack} />
            <Text weight="medium" style={styles.headerTitle}>Forgot Password</Text>
            <View style={{ width: wp(11) }} />
          </View>

          {/* Content */}
          <View style={styles.content}>
            <Text variant="h2" weight="semibold" style={styles.title}>Reset your password</Text>
            <Text variant="bodySmall" style={styles.subtitle}>
              Enter your registered email and we’ll send you a reset link
            </Text>

            <View style={styles.inputContainer}>
              <Text weight="medium" style={styles.label}>Email</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter your email"
                placeholderTextColor="#9ca3af"
                keyboardType="email-address"
                autoCapitalize="none"
                value={email}
                onChangeText={setEmail}
              />
            </View>

            <Button
              title="Send Reset Link"
              onPress={handleSubmit}
              loading={loading}
              style={styles.button}
            />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  outerContainer: { flex: 1, backgroundColor: "#f0f4f0" },
  container: { flexGrow: 1 },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: wp(4),
    paddingTop: hp(1),
    paddingBottom: hp(2),
    alignItems: "center",
  },
  headerTitle: { color: "#1a3c2a", fontSize: rf(2) },
  content: { paddingHorizontal: wp(6), paddingTop: hp(5) },
  title: { color: "#1a3c2a", marginBottom: hp(1) },
  subtitle: { color: "#6b8a7a", marginBottom: hp(4) },
  inputContainer: { marginBottom: hp(3) },
  label: { color: "#1a3c2a", marginBottom: hp(1), fontSize: rf(1.8) },
  input: {
    backgroundColor: "#fff",
    borderRadius: wp(3),
    paddingHorizontal: wp(4),
    paddingVertical: hp(2),
    borderWidth: 1,
    borderColor: "#e2e8e4",
    fontSize: rf(1.8),
  },
  button: { elevation: 3 },
});
