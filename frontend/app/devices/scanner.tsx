/**
 * Plant Scanner Screen - Precise identification with UI refinements
 */
import React, { useState, useRef, useEffect, useCallback } from "react";
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Dimensions,
  Animated,
  ActivityIndicator,
  Image,
  Platform,
  StatusBar,
} from "react-native";
import Svg, { Circle } from "react-native-svg";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { CameraView, useCameraPermissions } from "expo-camera";
import * as ImagePicker from "expo-image-picker";
import { useFocusEffect } from "@react-navigation/native";
import { identifyPlant } from "../../services/plantService";
import Text from "../../components/ui/Text";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { responsiveFontSize as rf } from "react-native-responsive-dimensions";

const AnimatedCircle = Animated.createAnimatedComponent(Circle);
const { width, height } = Dimensions.get("window");

const BG_COLOR = "#EAF5EE";
const PRIMARY_GREEN = "#2E9A6A";
const LIGHT_GREEN = "#D4F2E4";
const PROGRESS_GREEN = "#5FCF62";

const CIRCLE_SIZE = wp(80);
const RING_RADIUS = (CIRCLE_SIZE + wp(8)) / 2 - 5;
const RING_CIRCUMFERENCE = 2 * Math.PI * RING_RADIUS;

export default function ScannerScreen() {
  const [permission, requestPermission] = useCameraPermissions();
  const [isScanning, setIsScanning] = useState(false);
  const [flashMode, setFlashMode] = useState(false);
  const [plantsIdentified, setPlantsIdentified] = useState(0);
  const [scanProgress, setScanProgress] = useState(0);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const insets = useSafeAreaInsets();

  const cameraRef = useRef<CameraView>(null);
  const scanLineAnim = useRef(new Animated.Value(0)).current;
  const progressAnim = useRef(new Animated.Value(0)).current;
  const scanTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const isMounted = useRef(true);

  // Reset state when the screen comes into focus
  useFocusEffect(
    useCallback(() => {
      setSelectedImage(null);
      setIsScanning(false);
      setPlantsIdentified(0);
      setScanProgress(0);
      progressAnim.setValue(0);
      scanLineAnim.setValue(0);
      
      return () => {
        if (scanTimeoutRef.current) clearTimeout(scanTimeoutRef.current);
      };
    }, [])
  );

  // Initialize mount status
  useEffect(() => {
    isMounted.current = true;
    return () => { isMounted.current = false; };
  }, []);

  // 1. Running Values Animation
  useEffect(() => {
    let counterInterval: NodeJS.Timeout;

    if (isScanning) {
      // Reset values for start of scan
      progressAnim.stopAnimation();
      scanLineAnim.stopAnimation();
      progressAnim.setValue(0);
      scanLineAnim.setValue(0);
      setScanProgress(0);
      setPlantsIdentified(0);

      // A. Circular progress animation
      Animated.timing(progressAnim, { 
        toValue: 1, 
        duration: 3500, 
        useNativeDriver: false 
      }).start();

      // B. "Similar Plants Identified" count-up
      const targetSimilar = Math.floor(Math.random() * 7) + 12; 
      const animDuration = 3200; 
      const incrementTime = animDuration / targetSimilar;

      counterInterval = setInterval(() => {
        if (!isMounted.current) {
          clearInterval(counterInterval);
          return;
        }
        setPlantsIdentified(prev => {
          if (prev < targetSimilar) return prev + 1;
          clearInterval(counterInterval);
          return prev;
        });
      }, incrementTime);

      // C. Scan line loop
      Animated.loop(
        Animated.sequence([
          Animated.timing(scanLineAnim, { 
            toValue: CIRCLE_SIZE - 4,
            duration: 1600, 
            useNativeDriver: true 
          }),
          Animated.timing(scanLineAnim, { 
            toValue: 4,
            duration: 1600, 
            useNativeDriver: true 
          }),
        ])
      ).start();

    } else {
      // Reset everything when scanning stops
      scanLineAnim.stopAnimation();
      progressAnim.stopAnimation();
      scanLineAnim.setValue(0);
      progressAnim.setValue(0);
    }

    return () => {
      if (counterInterval) clearInterval(counterInterval);
    };
  }, [isScanning]);

  // 2. Progress State Listener
  useEffect(() => {
    const listener = progressAnim.addListener(({ value }) => {
      setScanProgress(Math.min(100, Math.round(value * 100)));
    });
    return () => progressAnim.removeListener(listener);
  }, []);

  const handleClose = () => {
    if (isScanning) return; 
    router.back();
  };

  const processImage = async (uri: string) => {
    setSelectedImage(uri);
    setIsScanning(true);
    setScanProgress(0); // Explicit reset
    
    try {
      const result = await identifyPlant(uri);
      
      // Delay to allow the "running" animations to play out
      scanTimeoutRef.current = setTimeout(() => {
        if (!isMounted.current) return;
        
        setIsScanning(false);
        if (result.success) {
          router.push({
            pathname: "/plants/nameplant",
            params: {
              plantType: result.data.plantName || result.data.scientificName,
              scientificName: result.data.scientificName || "",
              confidence: result.data.confidence ? (result.data.confidence * 100).toFixed(0) : "0",
              scannedImageUri: uri,
            }
          });
        } else {
          handleFailure(uri);
        }
      }, 3500);
    } catch (err: any) {
      console.error("Scan error:", err);
      if (isMounted.current) {
        setIsScanning(false);
        handleFailure(uri);
      }
    }
  };

  const handleFailure = (uri: string) => {
    Alert.alert(
      "Identification Failed", 
      "We couldn't identify this plant. Would you like to enter details manually?",
      [
        { text: "Try Again", onPress: () => {
          setSelectedImage(null);
          setScanProgress(0);
          setPlantsIdentified(0);
          progressAnim.setValue(0);
        }},
        { 
          text: "Manual Entry", 
          onPress: () => router.push({
            pathname: "/plants/nameplant",
            params: { scannedImageUri: uri, plantType: "" }
          }) 
        }
      ]
    );
  };

  const handleTakePicture = async () => {
    if (cameraRef.current && !isScanning) {
      try {
        const photo = await cameraRef.current.takePictureAsync({ 
          quality: 0.7,
          skipProcessing: true 
        });
        if (photo) await processImage(photo.uri);
      } catch (err) {
        Alert.alert("Error", "Failed to capture image");
      }
    }
  };

  const handleUploadFromGallery = async () => {
    if (isScanning) return;
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        quality: 0.7,
      });
      if (!result.canceled && result.assets[0]) {
        await processImage(result.assets[0].uri);
      }
    } catch (err) {
      Alert.alert("Error", "Failed to select image");
    }
  };

  if (!permission) return <View style={styles.permissionContainer}><ActivityIndicator size="large" color={PRIMARY_GREEN} /></View>;
  if (!permission.granted) {
    return (
      <View style={styles.permissionContainer}>
        <Text style={styles.permissionText}>No access to camera</Text>
        <TouchableOpacity onPress={requestPermission} style={styles.permissionButton}>
          <Text weight="semibold" style={styles.permissionButtonText}>Grant Permission</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const strokeDashoffset = progressAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [RING_CIRCUMFERENCE, 0],
  });

  return (
    <View style={[styles.container, { paddingTop: insets.top, paddingBottom: insets.bottom }]}>
      <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent />
      <View style={styles.header}>
        <TouchableOpacity 
          style={[styles.headerIconBtn, isScanning && { opacity: 0.5 }]} 
          onPress={handleClose}
          activeOpacity={0.7}
          disabled={isScanning}
        >
          <Ionicons name="close" size={wp(7)} color={isScanning ? "#94A3B8" : "#1F2933"} />
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.headerIconBtn, styles.hamburgerBtn]}
          onPress={() => Alert.alert("Scanner Settings", "History and camera preferences coming soon!")}
        >
          <View style={styles.hamburgerMenu}>
            <View style={[styles.hamburgerLine, styles.hamburgerLineTop]} />
            <View style={[styles.hamburgerLine, styles.hamburgerLineMiddle]} />
            <View style={[styles.hamburgerLine, styles.hamburgerLineBottom]} />
          </View>
        </TouchableOpacity>
      </View>

      <View style={styles.titleContainer}>
        <View style={styles.titleRow}>
          <Text variant="h2" weight="semibold" style={styles.title}>Plant Scanner</Text>

        </View>
        <View style={styles.chip}>
          <Text weight="semibold" style={styles.chipText}>
            {plantsIdentified} plants identified
          </Text>
        </View>
      </View>

      <View style={styles.scannerWrapper}>
        <View style={styles.outerCircle}>
          <View style={styles.dottedRing} />
          {isScanning && (
            <View style={styles.circularRingContainer}>
              <Svg width={CIRCLE_SIZE + wp(8)} height={CIRCLE_SIZE + wp(8)}>
                <Circle cx={(CIRCLE_SIZE + wp(8)) / 2} cy={(CIRCLE_SIZE + wp(8)) / 2} r={RING_RADIUS} stroke="#D4F2E4" strokeWidth="7" fill="none" />
                <AnimatedCircle
                  cx={(CIRCLE_SIZE + wp(8)) / 2} cy={(CIRCLE_SIZE + wp(8)) / 2} r={RING_RADIUS} stroke={PROGRESS_GREEN} strokeWidth="7" fill="none"
                  strokeDasharray={RING_CIRCUMFERENCE} strokeDashoffset={strokeDashoffset} strokeLinecap="round" rotation="-90" origin={`${(CIRCLE_SIZE + wp(8)) / 2}, ${(CIRCLE_SIZE + wp(8)) / 2}`}
                />
              </Svg>
              <Animated.View style={[styles.circularPercentageContainer, { 
                transform: [
                  { rotate: progressAnim.interpolate({ inputRange: [0, 1], outputRange: ["0deg", "360deg"] }) }
                ] 
              }]}>
                <View style={styles.percentageBox}>
                  <Text weight="bold" style={styles.circularPercentageText}>{scanProgress}%</Text>
                </View>
              </Animated.View>
            </View>
          )}

          <View style={styles.scannerCircle}>
            {selectedImage ? (
              <Image source={{ uri: selectedImage }} style={styles.camera} resizeMode="cover" />
            ) : (
              <CameraView ref={cameraRef} style={styles.camera} facing="back" enableTorch={flashMode}>
                {isScanning && (
                  <Animated.View pointerEvents="none" style={[styles.scanLine, { transform: [{ translateY: scanLineAnim }] }]} />
                )}
              </CameraView>
            )}
            {selectedImage && isScanning && (
              <Animated.View pointerEvents="none" style={[styles.scanLine, { transform: [{ translateY: scanLineAnim }] }]} />
            )}
          </View>
          
          {/* Corner Decorations */}
          <View style={[styles.corner, styles.topLeft]} />
          <View style={[styles.corner, styles.topRight]} />
          <View style={[styles.corner, styles.bottomLeft]} />
          <View style={[styles.corner, styles.bottomRight]} />
        </View>
      </View>

      <Text variant="caption" style={styles.hintText}>{isScanning ? `Matching probability: ${scanProgress}%` : "Position plant within frame"}</Text>

      <View style={[styles.bottomCard, { bottom: Math.max(insets.bottom, hp(5)) }]}>
        <TouchableOpacity style={styles.smallControlBtn} onPress={handleUploadFromGallery} disabled={isScanning}>
          <Ionicons name="image-outline" size={wp(6)} color={PRIMARY_GREEN} />
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.scanButton, isScanning && styles.scanButtonDisabled]} 
          onPress={() => {
            if (selectedImage && !isScanning) {
              setSelectedImage(null);
            } else {
              handleTakePicture();
            }
          }} 
          disabled={isScanning}
        >
          <Text weight="semibold" style={styles.scanButtonText}>{isScanning ? "Scanning..." : selectedImage ? "Reset Camera" : "Tap to Scan"}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.smallControlBtn} onPress={() => setFlashMode(!flashMode)} disabled={isScanning}>
          <Ionicons name={flashMode ? "flash" : "flash-off"} size={wp(6)} color={PRIMARY_GREEN} />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: BG_COLOR, alignItems: "center" },
  header: { width: "100%", flexDirection: "row", justifyContent: "space-between", padding: wp(5) },
  headerIconBtn: { width: wp(10), height: wp(10), borderRadius: 999, justifyContent: "center", alignItems: "center", zIndex: 100 },
  hamburgerBtn: { alignItems: "flex-end" },
  hamburgerMenu: { width: wp(5), height: hp(1.8), justifyContent: "space-between", alignItems: "flex-end" },
  hamburgerLine: { backgroundColor: "#1F2933", borderRadius: 1 },
  hamburgerLineTop: { width: wp(5), height: 3 },
  hamburgerLineMiddle: { width: wp(3.5), height: 2 },
  hamburgerLineBottom: { width: wp(5), height: 3 },
  titleContainer: { marginTop: hp(1), alignItems: "center" },
  titleRow: { flexDirection: "row", alignItems: "center" },
  title: { 
    color: "#111827",
    fontSize: Platform.OS === "android" ? rf(2.8) : rf(3)
  },
  chip: { marginTop: hp(1), paddingHorizontal: wp(4.5), paddingVertical: hp(0.8), borderRadius: 999, backgroundColor: LIGHT_GREEN },
  chipText: { fontSize: rf(1.5), color: PRIMARY_GREEN },
  scannerWrapper: { marginTop: hp(5), alignItems: "center", justifyContent: "center" },
  outerCircle: { width: CIRCLE_SIZE + wp(15), height: CIRCLE_SIZE + wp(15), borderRadius: 999, alignItems: "center", justifyContent: "center", position: "relative" },
  dottedRing: { position: "absolute", width: CIRCLE_SIZE + wp(13), height: CIRCLE_SIZE + wp(13), borderRadius: 999, borderWidth: 1.5, borderColor: "#A7E0C2", borderStyle: "dashed" },
  circularRingContainer: { position: "absolute", width: CIRCLE_SIZE + wp(8), height: CIRCLE_SIZE + wp(8), justifyContent: "center", alignItems: "center" },
  circularPercentageContainer: { position: "absolute", width: CIRCLE_SIZE + wp(8), height: CIRCLE_SIZE + wp(8), justifyContent: "flex-start", alignItems: "center" },
  percentageBox: { 
    backgroundColor: BG_COLOR, 
    paddingHorizontal: wp(2.5), 
    paddingVertical: hp(0.6), 
    borderRadius: wp(2), 
    marginTop: -hp(0.8),
    minWidth: wp(12),
    alignItems: 'center',
    justifyContent: 'center',
  },
  circularPercentageText: { 
    color: PRIMARY_GREEN, 
    fontSize: rf(1.7), 
    textAlign: 'center',
    lineHeight: rf(2.2), // Added to prevent cutting
    ...Platform.select({
      android: {
        includeFontPadding: false,
      }
    })
  },
  scannerCircle: { width: CIRCLE_SIZE, height: CIRCLE_SIZE, borderRadius: 999, overflow: "hidden", backgroundColor: "#F5F5F5" },
  camera: { width: "100%", height: "100%" },
  scanLine: { position: "absolute", left: 0, width: "100%", height: 3, backgroundColor: "#00F79F", shadowColor: "#00F79F", shadowOffset: { width: 0, height: 0 }, shadowOpacity: 0.8, shadowRadius: 10 },
  corner: { position: "absolute", width: wp(11), height: wp(11), borderColor: "#1F5A3A", borderWidth: 4, zIndex: 10 },
  topLeft: { top: wp(3), left: wp(3), borderRightWidth: 0, borderBottomWidth: 0, borderTopLeftRadius: wp(3) },
  topRight: { top: wp(3), right: wp(3), borderLeftWidth: 0, borderBottomWidth: 0, borderTopRightRadius: wp(3) },
  bottomLeft: { bottom: wp(3), left: wp(3), borderRightWidth: 0, borderTopWidth: 0, borderBottomLeftRadius: wp(3) },
  bottomRight: { bottom: wp(3), right: wp(3), borderLeftWidth: 0, borderTopWidth: 0, borderBottomRightRadius: wp(3) },
  hintText: { 
    marginTop: hp(2.5), 
    color: "#94A3B8", 
    textAlign: "center",
    fontSize: rf(1.5)
  },
  bottomCard: { position: "absolute", width: wp(90), backgroundColor: "#FFFFFF", borderRadius: wp(5), padding: wp(4.5), flexDirection: "row", alignItems: "center", justifyContent: "space-between", elevation: 8, shadowColor: "#000", shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.1, shadowRadius: 12 },
  smallControlBtn: { width: wp(12), height: wp(12), borderRadius: 999, backgroundColor: "#D4F2E4", justifyContent: "center", alignItems: "center" },
  scanButton: { flex: 1, marginHorizontal: wp(4), height: hp(6), backgroundColor: PRIMARY_GREEN, borderRadius: 999, justifyContent: "center", alignItems: "center" },
  scanButtonDisabled: { opacity: 0.8 },
  scanButtonText: { color: "#FFFFFF", fontSize: rf(1.8) },
  permissionContainer: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: BG_COLOR },
  permissionText: { fontSize: rf(2.2), fontWeight: "600" },
  permissionButton: { marginTop: hp(2), backgroundColor: PRIMARY_GREEN, padding: wp(3), borderRadius: 999 },
  permissionButtonText: { color: "#FFFFFF", fontSize: rf(1.8) }
});
