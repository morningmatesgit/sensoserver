import {
  View,
  StyleSheet,
  TouchableOpacity,
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
import { useAuth } from "../../context/AppContext";
import Text from "../../components/ui/Text";
import Button from "../../components/ui/Button";
import BackButton from "../../components/ui/BackButton";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { responsiveFontSize as rf } from "react-native-responsive-dimensions";
import { Ionicons } from "@expo/vector-icons";

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const { login, isLoading, googleAuth } = useAuth();
  const insets = useSafeAreaInsets();

  const handleBack = () => {
    router.replace("/dashboard/dashboard");
  };

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }

    try {
      await login(email.toLowerCase().trim(), password);
      router.replace("/dashboard/dashboard");
    } catch (error: any) {
      Alert.alert("Login Failed", error.message || "Invalid credentials");
    }
  };

  return (
    <View style={[styles.outerContainer, { paddingTop: insets.top, paddingBottom: insets.bottom }]}>
      <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent />
      <KeyboardAvoidingView
        style={styles.keyboardAvoidingView}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <ScrollView
          style={styles.container}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          {/* Header */}
          <View style={styles.header}>
            <BackButton onPress={handleBack} />
            <Text weight="medium" style={styles.headerTitle}>Sign In</Text>
            <View style={styles.placeholder} />
          </View>

          {/* Content */}
          <View style={styles.content}>
            <Text variant="h2" weight="semibold" style={styles.title}>Welcome Back</Text>
            <Text variant="bodySmall" style={styles.subtitle}>Sign in to continue monitoring your plants</Text>

            {/* Form */}
            <View style={styles.form}>
              <View style={styles.inputContainer}>
                <Text weight="medium" style={styles.inputLabel}>Email</Text>
                <TextInput
                  style={styles.input}
                  value={email}
                  onChangeText={setEmail}
                  placeholder="Enter your email"
                  placeholderTextColor="#9ca3af"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  allowFontScaling={false}
                />
              </View>

              <View style={styles.inputContainer}>
                <Text weight="medium" style={styles.inputLabel}>Password</Text>
                <View style={styles.passwordWrapper}>
                  <TextInput
                    style={styles.passwordInput}
                    value={password}
                    onChangeText={setPassword}
                    placeholder="Enter your password"
                    placeholderTextColor="#9ca3af"
                    secureTextEntry={!showPassword}
                    allowFontScaling={false}
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
              </View>

              <TouchableOpacity 
                style={styles.forgotPasswordContainer} 
                onPress={() => router.push('/auth/forgetpassword')}
              >
                <Text variant="caption" weight="medium" style={styles.forgotPasswordText}>Forgot Password?</Text>
              </TouchableOpacity>
            </View>

            {/* Login Button */}
            <Button
              title={isLoading ? "Signing In..." : "Sign In"}
              onPress={handleLogin}
              loading={isLoading}
              style={styles.loginButton}
              size="medium"
            />

            {/* Separator */}
            <View style={styles.separatorContainer}>
              <View style={styles.separatorLine} />
              <Text variant="caption" weight="medium" style={styles.separatorText}>OR</Text>
              <View style={styles.separatorLine} />
            </View>

            {/* Google Button */}
            <Button
              title="Continue with Google"
              variant="neutral"
              onPress={async () => {
                try {
                  await googleAuth();
                  router.replace("/dashboard/dashboard");
                } catch (e: any) {
                  Alert.alert("Google Error", e.message);
                }
              }}
              icon={<Ionicons name="logo-google" size={wp(5)} color="#1a3c2a" />}
              style={styles.googleButton}
              size="medium"
            />

            {/* Signup Link */}
            <View style={styles.signupContainer}>
              <Text variant="bodySmall" style={styles.signupText}>Don't have an account? </Text>
              <TouchableOpacity onPress={() => router.push("/auth/signup")}>
                <Text variant="bodySmall" weight="medium" style={styles.signupLink}>Sign Up</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  outerContainer: { flex: 1, backgroundColor: "#f0f4f0" },
  keyboardAvoidingView: { flex: 1 },
  container: { flex: 1, backgroundColor: "#f0f4f0" },
  scrollContent: { flexGrow: 1, paddingBottom: hp(3) },
  header: { 
    flexDirection: "row", 
    justifyContent: "space-between", 
    alignItems: "center", 
    paddingHorizontal: wp(4), 
    paddingTop: hp(1), 
    paddingBottom: hp(2) 
  },
  headerTitle: { 
    color: "#1a3c2a", 
    fontSize: Platform.OS === "android" ? rf(2.2) : rf(2.4) 
  },
  placeholder: { width: wp(11) },
  content: { paddingHorizontal: wp(6), paddingTop: hp(2.5) },
  title: { 
    color: "#1a3c2a", 
    marginBottom: hp(1),
    fontSize: Platform.OS === "android" ? rf(3.2) : rf(3.5)
  },
  subtitle: { 
    color: "#6b8a7a", 
    marginBottom: hp(5),
    fontSize: Platform.OS === "android" ? rf(1.8) : rf(2)
  },
  form: { gap: hp(2.5), marginBottom: hp(4) },
  inputContainer: { gap: hp(1) },
  inputLabel: { 
    color: "#1a3c2a", 
    fontSize: Platform.OS === "android" ? rf(1.8) : rf(2) 
  },
  input: { 
    backgroundColor: "#ffffff", 
    borderRadius: wp(3), 
    paddingHorizontal: wp(4), 
    paddingVertical: hp(2), 
    fontSize: Platform.OS === "android" ? rf(1.8) : rf(2), 
    color: "#1a3c2a", 
    borderWidth: 1, 
    borderColor: "#e2e8e4",
    fontFamily: Platform.OS === "android" ? "Inter-Regular" : undefined,
  },
  passwordWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: "#ffffff",
    borderRadius: wp(3),
    borderWidth: 1,
    borderColor: "#e2e8e4",
  },
  passwordInput: {
    flex: 1,
    paddingHorizontal: wp(4),
    paddingVertical: hp(2),
    fontSize: Platform.OS === "android" ? rf(1.8) : rf(2),
    color: "#1a3c2a",
    fontFamily: Platform.OS === "android" ? "Inter-Regular" : undefined,
  },
  eyeIcon: {
    paddingHorizontal: wp(4),
  },
  forgotPasswordContainer: { alignSelf: 'flex-end' },
  forgotPasswordText: { 
    color: '#2d5a3d', 
    fontSize: Platform.OS === "android" ? rf(1.6) : rf(1.8) 
  },
  loginButton: { marginBottom: hp(3), elevation: 3 },
  separatorContainer: { flexDirection: 'row', alignItems: 'center', marginBottom: hp(3) },
  separatorLine: { flex: 1, height: 1, backgroundColor: '#e2e8e4' },
  separatorText: { 
    marginHorizontal: wp(2.5), 
    color: '#6b8a7a', 
    fontSize: Platform.OS === "android" ? rf(1.6) : rf(1.8) 
  },
  signupContainer: { 
    flexDirection: "row", 
    justifyContent: "center", 
    alignItems: "center", 
    paddingBottom: hp(5) 
  },
  signupText: { 
    color: "#6b8a7a", 
    fontSize: Platform.OS === "android" ? rf(1.8) : rf(2) 
  },
  signupLink: { 
    color: "#2d5a3d", 
    fontSize: Platform.OS === "android" ? rf(1.8) : rf(2) 
  },
  googleButton: { marginBottom: hp(2.5) },
});
