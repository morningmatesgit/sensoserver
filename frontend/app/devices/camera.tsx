import React, { useState, useRef, useEffect } from "react";
import {
  View,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
  Image,
  Alert,
  Platform,
  ActivityIndicator,
} from "react-native";
import {
  CameraView,
  useCameraPermissions,
  type CameraType,
} from "expo-camera";
import { Ionicons } from "@expo/vector-icons";
import { useRouter, useLocalSearchParams } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import * as ImagePicker from "expo-image-picker";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { responsiveFontSize as rf } from "react-native-responsive-dimensions";
import { scanPlantHealth } from "../../services/plantService";
import Text from "../../components/ui/Text";
import HealthResultModal from "../../components/HealthResultModal";

/**
 * CameraScreen - Dedicated to Plant Health Assessment
 * Used when a user takes a photo from the Plant Info page.
 */
const CameraScreen = () => {
  const router = useRouter();
  const params = useLocalSearchParams();
  const plantId = Array.isArray(params.plantId) ? params.plantId[0] : params.plantId;
  
  const cameraRef = useRef<CameraView>(null);
  const insets = useSafeAreaInsets();

  const [permission, requestPermission] = useCameraPermissions();
  const [cameraType, setCameraType] = useState<CameraType>("back");
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [healthData, setHealthData] = useState<any>(null);

  useEffect(() => {
    (async () => {
      if (!permission || !permission.granted) {
        await requestPermission();
      }
    })();
  }, [permission, requestPermission]);

  const handleClose = () => {
    router.back();
  };

  const handleGallery = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        quality: 1,
      });

      if (!result.canceled && result.assets[0]) {
        setCapturedImage(result.assets[0].uri);
      }
    } catch (error) {
      Alert.alert("Error", "Failed to open gallery");
    }
  };

  const handleCapture = async () => {
    if (cameraRef.current) {
      try {
        const photo = await cameraRef.current.takePictureAsync({
          quality: 1,
          base64: false,
        });

        setCapturedImage(photo.uri);
      } catch (error) {
        Alert.alert("Error", "Failed to capture photo");
      }
    }
  };

  const handleRetake = () => {
    setCapturedImage(null);
    setHealthData(null);
    setShowResult(false);
  };

  const handleUsePhoto = async () => {
    if (!capturedImage || !plantId) return;
    
    setIsProcessing(true);
    try {
      // Direct Health Scan - Backend validates if it's a plant and returns status
      const response = await scanPlantHealth(plantId, capturedImage);
      
      if (response.success && response.data) {
        setHealthData(response.data);
        setShowResult(true);
      } else {
        Alert.alert(
          "Analysis Failed 🌿",
          response.message || "Please ensure the photo is a clear plant image and try again.",
          [{ text: "Retake", onPress: handleRetake }]
        );
      }
    } catch (error: any) {
      console.error("Health scan error:", error);
      Alert.alert("Error", "Failed to process health assessment. Please check your connection.");
    } finally {
      setIsProcessing(false);
    }
  };

  if (!permission) return <View style={styles.container} />;

  if (!permission.granted) {
    return (
      <View style={[styles.container, styles.permissionContainer, { paddingTop: insets.top, paddingBottom: insets.bottom }]}>
        <StatusBar barStyle="light-content" backgroundColor="#000" translucent />
        <Ionicons name="camera-outline" size={wp(12)} color="#a8b5a8" />
        <TouchableOpacity style={styles.permissionButton} onPress={requestPermission}>
          <Text weight="semibold" style={{ color: '#fff' }}>Enable Camera</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={[styles.container, { paddingTop: insets.top, paddingBottom: insets.bottom }]}>
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />

      {capturedImage ? (
        <>
          <Image source={{ uri: capturedImage }} style={styles.previewImage} />
          
          {isProcessing && (
            <View style={styles.processingOverlay}>
              <ActivityIndicator size="large" color="#4aa88b" />
              <Text weight="semibold" style={styles.processingText}>Assessing Health...</Text>
            </View>
          )}

          {!isProcessing && (
            <>
              <TouchableOpacity style={[styles.closeButton, { top: hp(2) }]} onPress={handleClose}>
                <Ionicons name="close" size={wp(7)} color="#fff" />
              </TouchableOpacity>

              <View style={[styles.previewControls, { bottom: hp(4) }]}>
                <TouchableOpacity style={styles.retakeButton} onPress={handleRetake}>
                  <Ionicons name="refresh" size={wp(7)} color="#fff" />
                </TouchableOpacity>

                <TouchableOpacity style={styles.usePhotoButton} onPress={handleUsePhoto}>
                  <Ionicons name="checkmark" size={wp(8)} color="#fff" />
                </TouchableOpacity>
              </View>
            </>
          )}
        </>
      ) : (
        <CameraView ref={cameraRef} style={styles.camera} facing={cameraType}>
          <TouchableOpacity style={[styles.closeButton, { top: hp(2) }]} onPress={handleClose}>
            <Ionicons name="close" size={wp(7)} color="#fff" />
          </TouchableOpacity>

          <View style={[styles.bottomControls, { bottom: hp(4) }]}>
            <View style={styles.emptySpace} />
            <TouchableOpacity style={styles.captureButton} onPress={handleCapture}>
              <View style={styles.captureButtonInner} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.galleryButton} onPress={handleGallery}>
              <Ionicons name="images" size={wp(6)} color="#5a9a7a" />
            </TouchableOpacity>
          </View>
        </CameraView>
      )}

      <HealthResultModal
        visible={showResult}
        result={healthData}
        onClose={() => setShowResult(false)}
        onDone={() => {
          setShowResult(false);
          router.back();
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#000" },
  permissionContainer: { justifyContent: "center", alignItems: "center", gap: hp(2) },
  permissionButton: { backgroundColor: "#4aa88b", paddingHorizontal: wp(6), paddingVertical: hp(1.5), borderRadius: wp(3) },
  camera: { flex: 1 },
  closeButton: { position: "absolute", right: wp(5), width: wp(10), height: wp(10), borderRadius: wp(5), backgroundColor: "rgba(255, 255, 255, 0.4)", justifyContent: "center", alignItems: "center", zIndex: 1 },
  bottomControls: { position: "absolute", left: 0, right: 0, flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingHorizontal: wp(10) },
  emptySpace: { width: wp(12) },
  galleryButton: { width: wp(12), height: wp(12), borderRadius: wp(6), backgroundColor: "#fff", justifyContent: "center", alignItems: "center" },
  captureButton: { width: wp(20), height: wp(20), borderRadius: wp(10), backgroundColor: "#fff", justifyContent: "center", alignItems: "center" },
  captureButtonInner: { width: wp(15), height: wp(15), borderRadius: wp(7.5), backgroundColor: "#fff", borderWidth: 3, borderColor: "#5a9a7a" },
  previewImage: { flex: 1, resizeMode: "cover" },
  previewControls: { position: "absolute", left: 0, right: 0, flexDirection: "row", justifyContent: "space-around", alignItems: "center", paddingHorizontal: wp(15) },
  retakeButton: { width: wp(18), height: wp(18), borderRadius: wp(9), backgroundColor: "rgba(0, 0, 0, 0.6)", justifyContent: "center", alignItems: "center", borderWidth: 2, borderColor: "#fff" },
  usePhotoButton: { width: wp(18), height: wp(18), borderRadius: wp(9), backgroundColor: "#5a9a7a", justifyContent: "center", alignItems: "center", borderWidth: 2, borderColor: "#fff" },
  processingOverlay: { ...StyleSheet.absoluteFillObject, backgroundColor: "rgba(0, 0, 0, 0.7)", justifyContent: "center", alignItems: "center", gap: hp(2) },
  processingText: { color: "#fff", fontSize: rf(2) },
});

export default CameraScreen;
