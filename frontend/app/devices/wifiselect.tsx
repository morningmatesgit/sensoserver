import {
  View,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Platform,
  StatusBar,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import React, { useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { wifiNetworks } from "../../assets/images";
import Text from "../../components/ui/Text";
import Button from "../../components/ui/Button";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { responsiveFontSize as rf } from "react-native-responsive-dimensions";

interface WiFiNetwork {
  ssid: string;
  signal: number;
  secured: boolean;
  connected: boolean;
}

export default function WiFiSelectScreen() {
  const [selectedNetwork, setSelectedNetwork] = useState<string>("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const insets = useSafeAreaInsets();

  const handleBack = () => {
    router.back();
  };

  const handleNetworkSelect = (ssid: string) => {
    setSelectedNetwork(ssid);
    setPassword("");
  };

  const handleNextStep = async () => {
    console.log("Connecting to:", selectedNetwork);
    router.push("/devices/sensoconnect");
  };

  const getSignalIcon = (signal: number) => {
    if (signal >= 80) return "wifi";
    if (signal >= 60) return "wifi-outline";
    if (signal >= 40) return "cellular";
    return "cellular-outline";
  };

  return (
    <LinearGradient
      colors={["#E6F4ED", "#F4F5EE"]}
      start={{ x: 0, y: 0 }}
      end={{ x: 0, y: 1 }}
      style={[styles.outerContainer, { paddingTop: insets.top, paddingBottom: insets.bottom }]}
    >
      <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent />
      <View style={styles.container}>
        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {/* Main Card Container */}
          <View style={styles.cardContainer}>
            {/* Title */}
            <Text variant="h3" weight="semibold" style={styles.title}>请输入 Wi-Fi 信息</Text>
            <Text variant="bodySmall" style={styles.subtitle}>选择设备工作 Wi-Fi 并输入密码</Text>

            {/* WiFi Network Selection */}
            <View style={styles.wifiSelectionContainer}>
              <Ionicons name="wifi" size={wp(4.5)} color="#1a3c2a" />
              <View style={styles.wifiInfo}>
                <Text weight="medium" style={styles.wifiLabel}>
                  {selectedNetwork || "1+11"}
                </Text>
              </View>
              <TouchableOpacity
                style={styles.selectButton}
                onPress={() => {
                  console.log("Select WiFi");
                }}
              >
                <Text weight="medium" style={styles.selectButtonText}>选择 Wi-Fi</Text>
              </TouchableOpacity>
            </View>

            {/* Password Input */}
            <View style={styles.passwordSection}>
              <View style={styles.passwordRow}>
                <Ionicons name="lock-closed" size={wp(4)} color="#1a3c2a" />
                <TextInput
                  style={styles.passwordInput}
                  value={password}
                  onChangeText={setPassword}
                  placeholder="wangshuaigen"
                  placeholderTextColor="#9ca3af"
                  secureTextEntry={!showPassword}
                  autoCapitalize="none"
                  allowFontScaling={false}
                />
                <TouchableOpacity
                  style={styles.eyeButton}
                  onPress={() => setShowPassword(!showPassword)}
                >
                  <Ionicons
                    name={showPassword ? "eye-off-outline" : "eye-outline"}
                    size={wp(5)}
                    color="#9ca3af"
                  />
                </TouchableOpacity>
              </View>
            </View>

            {/* Available Networks List (Expandable) */}
            <View style={styles.networksListContainer}>
              {wifiNetworks.slice(0, 3).map((network, index) => (
                <TouchableOpacity
                  key={index}
                  style={styles.networkItem}
                  onPress={() => handleNetworkSelect(network.ssid)}
                >
                  <View style={styles.networkLeft}>
                    <Ionicons
                      name={getSignalIcon(network.signal)}
                      size={wp(4.5)}
                      color="#6b7280"
                    />
                    <Text variant="bodySmall" style={styles.networkName}>{network.ssid}</Text>
                  </View>
                  {network.secured && (
                    <Ionicons name="lock-closed" size={wp(3.5)} color="#6b7280" />
                  )}
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Spacer */}
          <View style={styles.spacer} />
        </ScrollView>

        {/* Next Step Button */}
        <View style={styles.buttonContainer}>
          <Button
            title="Next Step"
            onPress={handleNextStep}
            disabled={!selectedNetwork}
            style={styles.nextButton}
            size="medium"
          />
        </View>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  outerContainer: {
    flex: 1,
  },
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: wp(5),
    paddingTop: hp(4),
  },
  cardContainer: {
    backgroundColor: "#ffffff",
    borderRadius: wp(2),
    borderWidth: 1,
    borderColor: "#e5e7eb",
    padding: wp(6),
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  title: {
    color: "#1a3c2a",
    marginBottom: hp(1),
    fontSize: Platform.OS === "android" ? rf(2) : rf(2.2),
  },
  subtitle: {
    color: "#6b7280",
    marginBottom: hp(3),
    fontSize: Platform.OS === "android" ? rf(1.4) : rf(1.6),
  },
  wifiSelectionContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: hp(2),
    paddingHorizontal: wp(3),
    backgroundColor: "#ffffff",
    marginBottom: hp(2),
    borderBottomWidth: 1,
    borderBottomColor: "#e5e7eb",
  },
  wifiInfo: {
    flex: 1,
    marginLeft: wp(3),
  },
  wifiLabel: {
    fontSize: Platform.OS === "android" ? rf(1.8) : rf(2),
    color: "#1a3c2a",
  },
  selectButton: {
    paddingHorizontal: wp(3),
    paddingVertical: hp(0.8),
  },
  selectButtonText: {
    fontSize: rf(1.6),
    color: "#4a90e2",
  },
  passwordSection: {
    marginBottom: hp(2.5),
  },
  passwordRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: hp(2),
    paddingHorizontal: wp(3),
    backgroundColor: "#ffffff",
    borderBottomWidth: 1,
    borderBottomColor: "#e5e7eb",
  },
  passwordInput: {
    flex: 1,
    marginLeft: wp(3),
    fontSize: Platform.OS === "android" ? rf(1.8) : rf(2),
    color: "#1a3c2a",
    fontFamily: Platform.OS === "android" ? "Inter-Regular" : undefined,
  },
  eyeButton: {
    padding: wp(1),
  },
  networksListContainer: {
    borderTopWidth: 1,
    borderTopColor: "#e5e7eb",
    paddingTop: hp(2),
  },
  networkItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: hp(1.5),
    paddingHorizontal: wp(2),
  },
  networkLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  networkName: {
    color: "#1a3c2a",
    marginLeft: wp(3),
    fontSize: rf(1.6),
  },
  spacer: {
    height: hp(12),
  },
  buttonContainer: {
    paddingHorizontal: wp(5),
    paddingBottom: hp(2),
    paddingTop: hp(2),
  },
  nextButton: {
    ...Platform.select({
      android: { elevation: 3 },
    }),
  },
});
