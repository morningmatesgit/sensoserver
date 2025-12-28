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

export default function SignupScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [name, setName] = useState("");
  const { register, isLoading, googleAuth } = useAuth();
  const insets = useSafeAreaInsets();

  const handleBack = () => {
    router.replace("/dashboard/dashboard");
  };

  const handleSignup = async () => {
    if (!name || !email || !password || !confirmPassword) {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert("Error", "Passwords do not match");
      return;
    }

    try {
      await register(name.trim(), email.toLowerCase().trim(), password);
      router.replace("/dashboard/dashboard");
    } catch (error: any) {
      Alert.alert("Registration Failed", error.message);
    }
  };

  const handleGoogleSignup = async () => {
    try {
        await googleAuth();
        router.replace("/dashboard/dashboard");
    } catch (error: any) {
      Alert.alert("Google Login Failed", error.message);
    }
  };

  const handleLoginNavigation = () => {
    router.push("/auth/login");
  };

  return (
    <View style={[styles.outerContainer, { paddingTop: insets.top, paddingBottom: insets.bottom }]}>
      <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent />
      <KeyboardAvoidingView
        style={styles.keyboardAvoidingView}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 20}
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
            <Text weight="medium" style={styles.headerTitle}>Sign Up</Text>
            <View style={styles.placeholder} />
          </View>

          <View style={styles.content}>
            <Text variant="h2" weight="semibold" style={styles.title}>Create Account</Text>
            <Text variant="bodySmall" style={styles.subtitle}>
              Join Senso to start monitoring your plants
            </Text>

            {/* Form */}
            <View style={styles.form}>
              <View style={styles.inputContainer}>
                <Text weight="medium" style={styles.inputLabel}>Full Name</Text>
                <TextInput
                  style={styles.input}
                  value={name}
                  onChangeText={setName}
                  placeholder="Enter your full name"
                  placeholderTextColor="#9ca3af"
                  allowFontScaling={false}
                />
              </View>

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
                    placeholder="Create a password"
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

              <View style={styles.inputContainer}>
                <Text weight="medium" style={styles.inputLabel}>Confirm Password</Text>
                <View style={styles.passwordWrapper}>
                  <TextInput
                    style={styles.passwordInput}
                    value={confirmPassword}
                    onChangeText={setConfirmPassword}
                    placeholder="Confirm your password"
                    placeholderTextColor="#9ca3af"
                    secureTextEntry={!showConfirmPassword}
                    allowFontScaling={false}
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
              </View>
            </View>

            {/* Signup Button */}
            <Button
              title={isLoading ? "Creating Account..." : "Create Account"}
              onPress={handleSignup}
              loading={isLoading}
              style={styles.signupButton}
              size="medium"
            />

            {/* OR Divider */}
            <View style={styles.dividerContainer}>
              <View style={styles.dividerLine} />
              <Text variant="bodySmall" style={styles.dividerText}>OR</Text>
              <View style={styles.dividerLine} />
            </View>

            {/* Google Button */}
            <Button
              title="Continue with Google"
              variant="neutral"
              onPress={handleGoogleSignup}
              icon={<Ionicons name="logo-google" size={wp(5)} color="#1a3c2a" />}
              style={styles.googleButton}
              size="medium"
            />

            {/* Login Link */}
            <View style={styles.loginContainer}>
              <Text variant="bodySmall" style={styles.signupText}>Already have an account? </Text>
              <TouchableOpacity onPress={handleLoginNavigation}>
                <Text variant="bodySmall" weight="medium" style={styles.loginLink}>Sign In</Text>
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
    fontSize: Platform.OS === "android" ? rf(2) : rf(2.2) 
  },
  placeholder: { width: wp(11) },
  content: { paddingHorizontal: wp(6), paddingTop: hp(2.5) },
  title: { 
    color: "#1a3c2a", 
    marginBottom: hp(1),
    fontSize: Platform.OS === "android" ? rf(3) : rf(3.2)
  },
  subtitle: { 
    color: "#6b8a7a", 
    marginBottom: hp(5),
    fontSize: Platform.OS === "android" ? rf(1.8) : rf(2)
  },
  form: { gap: hp(2), marginBottom: hp(4) },
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
  signupButton: { marginBottom: hp(2), elevation: 3 },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: hp(3),
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#e2e8e4',
  },
  dividerText: {
    marginHorizontal: wp(4),
    color: '#6b8a7a',
    fontSize: rf(1.6),
  },
  loginContainer: { 
    flexDirection: "row", 
    justifyContent: "center", 
    alignItems: "center", 
    paddingBottom: hp(5),
    marginTop: hp(2),
  },
  signupText: { 
    color: "#6b8a7a", 
    fontSize: Platform.OS === "android" ? rf(1.8) : rf(2) 
  },
  loginLink: { 
    color: "#2d5a3d", 
    fontSize: Platform.OS === "android" ? rf(1.8) : rf(2) 
  },
  googleButton: { marginBottom: hp(3) },
});
