/**
 * Select Soil Type Screen - Part of multi-step plant setup
 */
import {
  View,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Platform,
  StatusBar,
} from "react-native";
import React, { useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { soilTypes } from "../../assets/images";
import BackButton from "../../components/ui/BackButton";
import CloseButton from "../../components/ui/CloseButton";
import Text from "../../components/ui/Text";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { responsiveFontSize as rf } from "react-native-responsive-dimensions";

export default function SelectSoilTypeScreen() {
  const params = useLocalSearchParams();
  const insets = useSafeAreaInsets();
  const [selectedSoil, setSelectedSoil] = useState("potting-mix");

  const handleBackPress = () => router.back();
  const handleClosePress = () => router.push("/dashboard/dashboard");

  const handleConfirm = () => {
    const soilName =
      soilTypes.find((s) => s.id === selectedSoil)?.name || selectedSoil;

    router.push({
      pathname: "/plants/potsize",
      params: {
        ...params,
        soilType: soilName,
      },
    });
  };

  return (
    <View style={[styles.outerContainer, { paddingTop: Platform.OS === 'ios' ? insets.top : (StatusBar.currentHeight || 0) + hp(1) }]}>
      <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent />
      
      {/* Static Header */}
      <View style={styles.header}>
        <BackButton onPress={handleBackPress} variant="circular" />
        <Text weight="semibold" style={styles.headerTitle}>Select Soil Type</Text>
        <CloseButton onPress={handleClosePress} variant="circular" />
      </View>

      <View style={styles.container}>
        <ScrollView
          style={styles.scrollView}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={[styles.soilListContent, { paddingBottom: insets.bottom + hp(12) }]}
        >
          {/* Soil Types List */}
          <View style={styles.soilList}>
            {soilTypes.map((soil) => (
              <TouchableOpacity
                key={soil.id}
                style={[
                  styles.soilCard,
                  selectedSoil === soil.id && styles.soilCardSelected,
                ]}
                onPress={() => setSelectedSoil(soil.id)}
                activeOpacity={1}
              >
                <View style={styles.soilImageContainer}>
                  {(() => {
                    const Icon = soil.image as any;
                    return <Icon width={wp(16)} height={wp(16)} />;
                  })()}
                </View>
                <View style={styles.soilInfo}>
                  <Text weight="bold" style={styles.soilName}>{soil.name}</Text>
                  <Text variant="caption" style={styles.soilDescription}>{soil.description}</Text>
                </View>
                <View
                  style={[
                    styles.radioButton,
                    selectedSoil === soil.id && styles.radioButtonSelected,
                  ]}
                >
                  {selectedSoil === soil.id ? (
                    <Ionicons name="checkmark-circle" size={wp(7)} color="#5FB57A" />
                  ) : (
                    <View style={styles.radioEmpty} />
                  )}
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>

        {/* Adjusted Confirm Button Size */}
        <View style={[styles.bottomContainer, { paddingBottom: Math.max(insets.bottom, hp(2)) }]}>
          <TouchableOpacity
            style={styles.confirmButton}
            onPress={handleConfirm}
          >
            <Text weight="semibold" style={styles.confirmButtonText}>Confirm Selection</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const BG_COLOR = "#EDF2E9"; 
const PRIMARY_GREEN = "#5FB57A";

const styles = StyleSheet.create({
  outerContainer: {
    flex: 1,
    backgroundColor: BG_COLOR,
  },
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: wp(5),
    paddingBottom: hp(1),
    zIndex: 10,
  },
  headerTitle: {
    fontSize: rf(2.2),
    color: "#111",
    textAlign: "center",
    flex: 1,
  },
  soilList: {
    paddingHorizontal: wp(5),
    paddingTop: hp(2),
  },
  soilListContent: {
    flexGrow: 1,
  },
  soilCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#ffffff",
    borderRadius: wp(5),
    paddingVertical: hp(2), 
    paddingHorizontal: wp(4),
    marginBottom: hp(2),
    ...Platform.select({
      android: { elevation: 3 },
      ios: { shadowColor: "#000", shadowOpacity: 0.08, shadowRadius: 10, shadowOffset: { width: 0, height: 4 } }
    })
  },
  soilCardSelected: {
  },
  soilImageContainer: {
    width: wp(20), 
    height: wp(20), 
    borderRadius: wp(4),
    backgroundColor: "#EBF3E8",
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: wp(4),
  },
  soilInfo: {
    flex: 1,
  },
  soilName: {
    fontSize: rf(2.1),
    color: "#000",
    marginBottom: hp(0.5),
  },
  soilDescription: {
    color: "#666",
    fontSize: rf(1.6),
    lineHeight: rf(2.2),
  },
  radioButton: {
    width: wp(8),
    height: wp(8),
    justifyContent: "center",
    alignItems: "center",
  },
  radioEmpty: {
    width: wp(6.5),
    height: wp(6.5),
    borderRadius: wp(3.25),
    borderWidth: 1.5,
    borderColor: "#D1D1D6",
  },
  radioButtonSelected: {
    backgroundColor: "transparent",
  },
  bottomContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: wp(6), // Reduced horizontal padding to increase button width
    backgroundColor: 'transparent',
  },
  confirmButton: {
    backgroundColor: "#5B9C71", 
    borderRadius: wp(10),
    height: hp(5.5), // Reduced height
    alignItems: "center",
    justifyContent: 'center',
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  confirmButtonText: {
    fontSize: rf(1.8), 
    color: "#ffffff",
  },
});
