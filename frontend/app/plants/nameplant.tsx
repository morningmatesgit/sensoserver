/**
 * Name Your Plant Screen - Final Step in Sequential Plant Setup
 */
import {
  View,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  Alert,
  StatusBar,
} from "react-native";
import React, { useState, useEffect } from "react";
import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import * as Location from "expo-location";
import { plantImages } from "../../assets/images";
import { savePlant } from "../../services/plantService";
import Text from "../../components/ui/Text";
import Button from "../../components/ui/Button";
import BackButton from "../../components/ui/BackButton";
import CloseButton from "../../components/ui/CloseButton";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { responsiveFontSize as rf } from "react-native-responsive-dimensions";

export default function NameYourPlantScreen() {
  const params = useLocalSearchParams();
  const insets = useSafeAreaInsets();
  const { plantType, scientificName, scannedImageUri, potSize, soilType } =
    params;

  const [plantName, setPlantName] = useState(
    (params.plantName as string) || (plantType as string) || "Volvo"
  );
  const [selectedLocation, setSelectedLocation] = useState(
    (params.location as string) || "Living Room"
  );
  const [loading, setLoading] = useState(false);
  const [coords, setCoords] = useState<{ lat: number; lng: number } | null>(
    null
  );

  const predefinedLocations = ["Living Room", "Balcony"];

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status === "granted") {
        let location = await Location.getCurrentPositionAsync({});
        setCoords({
          lat: location.coords.latitude,
          lng: location.coords.longitude,
        });
      }
    })();
  }, []);

  const handleBackPress = () => router.back();
  const handleClosePress = () => router.replace("/dashboard/dashboard");

  const handleAddInfo = () => {
    router.push({
      pathname: "/plants/soiltype",
      params: {
        ...params,
        plantName,
        location: selectedLocation,
        scannedImageUri: scannedImageUri || params.scannedImageUri,
        scientificName: scientificName || params.scientificName,
        plantType: plantType || params.plantType,
      },
    });
  };

  const handleAddPlant = async () => {
    if (!plantName) {
      Alert.alert("Required", "Please give your plant a name");
      return;
    }

    setLoading(true);
    try {
      const plantData = {
        plantName,
        scientificName: scientificName || "",
        type: plantType || "Unknown",
        location: selectedLocation,
        image: scannedImageUri,
        potSize: potSize || "Not specified",
        soilType: soilType || "Not specified",
        status: "healthy",
        latitude: coords?.lat,
        longitude: coords?.lng,
      };

      await savePlant(plantData);

      Alert.alert("Success!", `${plantName} has been added.`, [
        { text: "View Dashboard", onPress: () => router.replace("/dashboard/dashboard") },
      ]);
    } catch (error: any) {
      Alert.alert("Save Failed", error.message || "Could not save plant");
    } finally {
      setLoading(false);
    }
  };

  const ProfileIcon = plantImages.plantProfile;

  return (
    <View style={[styles.outerContainer, { paddingTop: insets.top }]}>
      <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent />
      <KeyboardAvoidingView
        style={styles.keyboardAvoid}
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
            <BackButton onPress={handleBackPress} variant="circular" />
            <CloseButton onPress={handleClosePress} variant="circular" />
          </View>

          {/* Title */}
          <Text variant="h2" weight="semibold" style={styles.title}>Name Your Plant</Text>
          <Text variant="bodySmall" style={styles.subtitle}>{plantType || "Gardenia"}</Text>

          {/* Plant Image */}
          <View style={styles.imageWrapper}>
            <View style={styles.imageCircle}>
              {scannedImageUri ? (
                <Image
                  source={{ uri: scannedImageUri as string }}
                  style={styles.plantImage}
                  contentFit="cover"
                />
              ) : (
                <ProfileIcon width={wp(60)} height={wp(60)} />
              )}
            </View>
          </View>

          {/* Plant Name Input (pill) */}
          <View style={styles.nameInputContainer}>
            <TextInput
              style={styles.nameInput}
              value={plantName}
              onChangeText={setPlantName}
              placeholder="Enter plant name"
              placeholderTextColor="#9CA3AF"
              allowFontScaling={false}
            />
          </View>

          {/* Location Selection */}
          <View style={styles.locationSection}>
            <View style={styles.locationButtons}>
              {predefinedLocations.map((location) => {
                const isActive = selectedLocation === location;
                return (
                  <TouchableOpacity
                    key={location}
                    style={[
                      styles.locationButton,
                      isActive
                        ? styles.locationButtonActive
                        : styles.locationButtonInactive,
                    ]}
                    onPress={() => setSelectedLocation(location)}
                  >
                    <Text
                      weight="medium"
                      style={[
                        styles.locationButtonText,
                        isActive
                          ? styles.locationButtonTextActive
                          : styles.locationButtonTextInactive,
                      ]}
                    >
                      {location}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            {/* Add sites Button */}
            <TouchableOpacity
              style={styles.addLocationButton}
              onPress={handleAddInfo}
            >
              <Ionicons name="add-circle" size={rf(2.5)} color="#5B9C71" />
              <Text weight="semibold" style={styles.addLocationText}>Add sites</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      {/* Bottom Action Buttons */}
      <View style={[styles.actionButtons, { paddingBottom: Math.max(insets.bottom, hp(2.5)) }]}>
        <Button 
          title="Add Info" 
          onPress={handleAddInfo} 
          variant="outline"
          style={styles.bottomButton}
          size="medium"
        />

        <Button 
          title="Add Plant" 
          onPress={handleAddPlant} 
          loading={loading}
          variant="outline"
          style={styles.bottomButton}
          size="medium"
        />
      </View>
    </View>
  );
}

const BG_COLOR = "#E6F1E7";
const PRIMARY_GREEN = "#5B9C71"; 

const styles = StyleSheet.create({
  outerContainer: { 
    flex: 1, 
    backgroundColor: BG_COLOR,
  },
  keyboardAvoid: { flex: 1 },
  container: { flex: 1, backgroundColor: BG_COLOR },
  scrollContent: { paddingBottom: hp(15), flexGrow: 1 },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: wp(4.5),
    paddingTop: hp(1.5),
  },
  title: {
    textAlign: "center",
    marginTop: hp(1.5),
    fontSize: Platform.OS === "android" ? rf(2.8) : rf(3),
  },
  subtitle: {
    color: "#6B7280",
    textAlign: "center",
    marginTop: hp(0.5),
    fontSize: Platform.OS === "android" ? rf(1.6) : rf(1.8),
  },
  imageWrapper: { marginTop: hp(3), alignItems: "center" },
  imageCircle: {
    width: wp(60),
    height: wp(60),
    borderRadius: wp(30),
    backgroundColor: "#E6F1E7",
    overflow: "hidden",
    justifyContent: "center",
    alignItems: "center",
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.1,
        shadowRadius: 5,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  plantImage: { width: "100%", height: "100%" },
  nameInputContainer: { marginTop: hp(3), alignItems: "center" },
  nameInput: {
    minWidth: wp(40),
    paddingHorizontal: wp(6),
    paddingVertical: hp(1.2),
    borderRadius: wp(4.5),
    backgroundColor: "#FFFFFF",
    textAlign: "center",
    fontSize: Platform.OS === "android" ? rf(1.8) : rf(2),
    color: "#111827",
    fontFamily: Platform.OS === "android" ? "Inter-Medium" : undefined,
  },
  locationSection: { marginTop: hp(3.5), paddingHorizontal: wp(7) },
  locationButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: hp(1.2),
  },
  locationButton: {
    flex: 1,
    paddingVertical: hp(1.2),
    borderRadius: wp(4),
    marginHorizontal: wp(1),
    alignItems: "center",
    borderWidth: 1.5,
  },
  locationButtonActive: {
    backgroundColor: "#FFFFFF",
    borderColor: PRIMARY_GREEN,
  },
  locationButtonInactive: {
    backgroundColor: "#F3F4F6",
    borderColor: "#E5E7EB",
  },
  locationButtonText: { 
    fontSize: Platform.OS === "android" ? rf(1.6) : rf(1.8) 
  },
  locationButtonTextActive: { color: PRIMARY_GREEN },
  locationButtonTextInactive: { color: "#6B7280" },
  addLocationButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: hp(1),
  },
  addLocationText: {
    marginLeft: wp(1.5),
    color: "#6B7280",
    fontSize: Platform.OS === "android" ? rf(1.6) : rf(1.8),
  },
  actionButtons: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: "row",
    backgroundColor: "#FFFFFF",
    paddingTop: hp(1.5),
    paddingBottom: hp(2.5),
    paddingHorizontal: wp(6),
    justifyContent: "space-between",
    borderTopLeftRadius: wp(8),
    borderTopRightRadius: wp(8),
    gap: wp(3),
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: -4 },
        shadowOpacity: 0.05,
        shadowRadius: 10,
      },
      android: {
        elevation: 8,
      },
    }),
  },
  bottomButton: {
    flex: 1,
  },
});
