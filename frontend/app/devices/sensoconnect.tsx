import {
  View,
  StyleSheet,
  TouchableOpacity,
  Image,
  Animated,
  Platform,
  StatusBar,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import React, { useEffect, useRef, useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Text from "../../components/ui/Text";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { responsiveFontSize as rf } from "react-native-responsive-dimensions";

/**
 * SensoConnectScreen
 * Implementation of the connection screen with a rotating progress ring around the device image.
 */
export default function SensoConnectScreen() {
  const rotation = useRef(new Animated.Value(0)).current;
  const insets = useSafeAreaInsets();

  // Connection Simulation State
  const [connectionStatus, setConnectionStatus] = useState('connecting'); // 'connecting', 'connected', 'failed', 'timeout'
  const [connectionProgress, setConnectionProgress] = useState(0);

  useEffect(() => {
    // Start rotation animation
    const animation = Animated.loop(
      Animated.timing(rotation, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      })
    );
    animation.start();

    // Simulation of connection progress
    const progressInterval = setInterval(() => {
      setConnectionProgress((prev) => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          return 100;
        }
        return prev + 5;
      });
    }, 150);

    // Navigate to success page after simulation
    const connectionTimer = setTimeout(() => {
      setConnectionStatus('connected');
      setTimeout(() => {
        router.push('/devices/sensodone');
      }, 1000);
    }, 3000);

    return () => {
      animation.stop();
      clearTimeout(connectionTimer);
      clearInterval(progressInterval);
    };
  }, []);

  const rotate = rotation.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "360deg"],
  });

  const handleClose = () => {
    router.back();
  };

  return (
    <LinearGradient colors={["#E6F4ED", "#F4F5EE"]} style={[styles.outerContainer, { paddingTop: insets.top, paddingBottom: insets.bottom }]}>
      <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent />
      <View style={styles.container}>
        {/* Close Button */}
        <TouchableOpacity style={[styles.closeButton, { top: Math.max(insets.top > 0 ? 0 : hp(2), hp(1)) }]} onPress={handleClose}>
          <Ionicons name="close" size={wp(6)} color="#b8b8b8" />
        </TouchableOpacity>

        {/* Center Image with Loading Circle */}
        <View style={styles.imageContainer}>
          {/* Static outer grey ring */}
          <View style={styles.staticOuterRing} />

          {/* Animated gradient circular ring */}
          <Animated.View
            style={[styles.loadingCircle, { transform: [{ rotate }] }]}
          >
            <LinearGradient
              colors={["#D7F7D5", "#A8E6B8", "#5FCF62"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.gradientRing}
            >
              {/* inner fill – same as bg, so only ring visible */}
              <View style={styles.gradientRingInner} />
            </LinearGradient>
          </Animated.View>

          {/* Device Image with Circular Mask */}
          <View style={styles.imageMask}>
            <Image
              source={require("../../assets/images/wifi_pair_image.png")}
              style={styles.connectImage}
              resizeMode="contain"
            />
          </View>
        </View>

        {/* Instructions */}
        <View style={styles.instructionsContainer}>
          <Text variant="h2" weight="semibold" style={styles.instructionTitle}>Connecting to Senso...</Text>
          <Text variant="body" style={styles.instructionText}>
            This may take a few sounds. Keep your phone close to Senso.
          </Text>

          {connectionStatus === 'connecting' && (
            <Text weight="medium" style={styles.statusText}>
              {connectionProgress < 25 && 'Establishing WiFi connection...'}
              {connectionProgress >= 25 && connectionProgress < 50 && 'Authenticating device...'}
              {connectionProgress >= 50 && connectionProgress < 75 && 'Configuring settings...'}
              {connectionProgress >= 75 && 'Finalizing connection...'}
            </Text>
          )}

          {connectionStatus === 'connected' && (
            <Text weight="semibold" style={styles.successText}>Successfully connected to Senso!</Text>
          )}
        </View>

        {/* Spacer */}
        <View style={styles.spacer} />
      </View>
    </LinearGradient>
  );
}

const RING_SIZE = wp(80);
const RING_BORDER = wp(2.5);

const styles = StyleSheet.create({
  outerContainer: {
    flex: 1,
  },
  container: {
    flex: 1,
    paddingHorizontal: wp(6),
  },
  closeButton: {
    position: "absolute",
    right: wp(4),
    width: wp(9),
    height: wp(9),
    borderRadius: wp(4.5),
    backgroundColor: "rgba(255, 255, 255, 0.5)",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 10,
  },
  imageContainer: {
    justifyContent: "center",
    alignItems: "center",
    paddingTop: hp(8),
    paddingBottom: hp(5),
    position: "relative",
  },
  loadingCircle: {
    width: RING_SIZE,
    height: RING_SIZE,
    position: "absolute",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 2,
  },
  staticOuterRing: {
    width: RING_SIZE,
    height: RING_SIZE,
    borderRadius: RING_SIZE / 2,
    borderWidth: RING_BORDER,
    borderColor: "#e8e8e8",
    position: "absolute",
  },
  gradientRing: {
    width: RING_SIZE,
    height: RING_SIZE,
    borderRadius: RING_SIZE / 2,
    justifyContent: "center",
    alignItems: "center",
    padding: RING_BORDER,
  },
  gradientRingInner: {
    width: "100%",
    height: "100%",
    borderRadius: RING_SIZE / 2,
    backgroundColor: "#E6F4ED",
  },
  imageMask: {
    width: RING_SIZE - RING_BORDER * 2,
    height: RING_SIZE - RING_BORDER * 2,
    borderRadius: (RING_SIZE - RING_BORDER * 2) / 2,
    overflow: "hidden",
    zIndex: 2,
    justifyContent: "center",
    alignItems: "center",
    marginTop: -1,
  },
  connectImage: {
    width: RING_SIZE,
    height: hp(32),
  },
  instructionsContainer: {
    paddingHorizontal: wp(2),
    paddingVertical: hp(2),
    alignItems: "flex-start",
  },
  instructionTitle: {
    marginBottom: hp(1.2),
    fontSize: Platform.OS === "android" ? rf(2.6) : rf(3),
  },
  instructionText: {
    color: "#4C4C4C",
    marginBottom: hp(1.5),
    fontSize: Platform.OS === "android" ? rf(1.8) : rf(2),
    lineHeight: Platform.OS === "android" ? rf(2.5) : rf(2.8),
  },
  statusText: {
    color: "#4AA88B",
    fontSize: rf(1.6),
  },
  successText: {
    color: "#4AA88B",
    fontSize: rf(1.6),
  },
  spacer: {
    flex: 1,
  },
});
