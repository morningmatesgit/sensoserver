/**
 * Select Pot Size Screen - Part of sequential setup
 */
import {
  View,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Platform,
  Alert,
  StatusBar,
} from "react-native";
import React, { useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { plantImages, potSizes } from "../../assets/images";
import {
  GestureHandlerRootView,
  Gesture,
  GestureDetector,
} from "react-native-gesture-handler";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  runOnJS,
} from "react-native-reanimated";
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

export default function SelectPotSizeScreen() {
  const params = useLocalSearchParams();
  const insets = useSafeAreaInsets();
  const [selectedSize, setSelectedSize] = useState(1);
  const [loading, setLoading] = useState(false);

  const handleBackPress = () => router.back();
  const handleClosePress = () => router.replace("/dashboard/dashboard");

  const handleConfirm = async () => {
    const sizeName = potSizes[selectedSize].name;

    setLoading(true);
    try {
      const plantData = {
        plantName: (params.plantName as string) || "My Plant",
        scientificName: (params.scientificName as string) || "",
        type: (params.plantType as string) || "Unknown",
        location: (params.location as string) || "Living Room",
        image: params.scannedImageUri as string,
        potSize: sizeName,
        soilType: (params.soilType as string) || "Not specified",
        status: "healthy",
      };

      await savePlant(plantData);
      // Automatically redirect to dashboard without pop-up
      router.replace("/dashboard/dashboard");
    } catch (error: any) {
      Alert.alert("Save Failed", error.message || "Could not save plant");
    } finally {
      setLoading(false);
    }
  };

  const getSizeLabel = () => {
    const size = potSizes[selectedSize];
    const inches =
      size.name === "Small" ? "6" : size.name === "Medium" ? "8" : "12";
    return `${size.name} (${inches}")`;
  };

  const sliderWidth = wp(75);
  const translateX = useSharedValue(0);
  const startX = useSharedValue(0);

  const panGesture = Gesture.Pan()
    .onStart(() => {
      startX.value = translateX.value;
    })
    .onUpdate((event) => {
      const newX = startX.value + event.translationX;
      translateX.value = Math.max(0, Math.min(sliderWidth, newX));
    })
    .onEnd(() => {
      const percentage = translateX.value / sliderWidth;
      let snapIndex = percentage < 0.25 ? 0 : percentage < 0.75 ? 1 : 2;
      translateX.value = withSpring((snapIndex / 2) * sliderWidth);
      runOnJS(setSelectedSize)(snapIndex);
    });

  const animatedThumbStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }));
  const animatedProgressStyle = useAnimatedStyle(() => ({
    width: translateX.value,
  }));

  React.useEffect(() => {
    translateX.value = (selectedSize / 2) * sliderWidth;
  }, []);

  const BigPlantIcon = plantImages.bigPlant;

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <View style={styles.outerContainer}>
        <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent />
        
        {/* Fixed Header */}
        <View style={[styles.header, { paddingTop: Platform.OS === 'ios' ? insets.top : (StatusBar.currentHeight || 0) + hp(1) }]}>
          <BackButton onPress={handleBackPress} variant="circular" />
          <Text weight="semibold" style={styles.headerTitle}>Select Pot Size</Text>
          <CloseButton onPress={handleClosePress} variant="circular" />
        </View>

        <ScrollView
          style={styles.container}
          contentContainerStyle={[styles.scrollContent, { paddingBottom: insets.bottom + hp(12) }]}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.imageWrapper}>
            <BigPlantIcon width={wp(70)} height={hp(30)} />
          </View>

          <View style={styles.scaleContainer}>
            <View style={styles.scaleWrapper}>
              <View style={styles.scaleTrack}>
                <Animated.View
                  style={[styles.scaleProgress, animatedProgressStyle]}
                />
                <GestureDetector gesture={panGesture}>
                  <Animated.View
                    style={[styles.scaleThumb, animatedThumbStyle]}
                  />
                </GestureDetector>
                <View style={styles.scaleHitZones}>
                  {[0, 1, 2].map((index) => (
                    <TouchableOpacity
                      key={index}
                      style={styles.scaleHitZone}
                      onPress={() => {
                        setSelectedSize(index);
                        translateX.value = withSpring(
                          (index / 2) * sliderWidth
                        );
                      }}
                      activeOpacity={1}
                    />
                  ))}
                </View>
              </View>
            </View>
            <Text weight="semibold" style={styles.sizeLabel}>{getSizeLabel()}</Text>
          </View>

          <View style={styles.potSizeContainer}>
            {potSizes.map((pot) => {
              const active = selectedSize === pot.id;
              return (
                <TouchableOpacity
                  key={pot.id}
                  style={[styles.potOption, active && styles.potOptionActive]}
                  onPress={() => {
                    setSelectedSize(pot.id);
                    translateX.value = withSpring((pot.id / 2) * sliderWidth);
                  }}
                >
                  {(() => {
                    const PotIcon = pot.image;
                    return <PotIcon width={wp(13.5)} height={wp(13.5)} />;
                  })()}
                  <Text weight="medium" style={styles.potName}>
                    {pot.name}
                  </Text>
                  <Text
                    variant="caption"
                    style={[
                      styles.potMeasurement,
                      { color: active ? "#6B7280" : "#9CA3AF" },
                    ]}
                  >
                    {pot.measurement}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>

          <View style={styles.recommendationCard}>
            <View style={styles.recommendationImageContainer}>
              {(() => {
                const Recommend = plantImages.recommendPlant;
                return <Recommend width={wp(10)} height={wp(10)} />;
              })()}
            </View>
            <View style={styles.recommendationContent}>
              <Text weight="medium" style={styles.recommendationTitle}>
                Recommended for your plant
              </Text>
              <Text variant="caption" style={styles.recommendationText}>
                Provides adequate space for root growth and stability
              </Text>
            </View>
          </View>
        </ScrollView>

        {/* Updated Button Width while maintaining size style */}
        <View style={[styles.bottomContainer, { paddingBottom: Math.max(insets.bottom, hp(2.5)) }]}>
          <Button
            title="Confirm Size"
            onPress={handleConfirm}
            loading={loading}
            style={styles.continueButton}
            size="medium"
          />
        </View>
      </View>
    </GestureHandlerRootView>
  );
}

const BG_COLOR = "#E6F1E7";
const PRIMARY_GREEN = "#5FB57A";
const LIGHT_GREEN = "#A8D5BA";
const CARD_BG = "#E8F5E9";

const styles = StyleSheet.create({
  outerContainer: {
    flex: 1,
    backgroundColor: BG_COLOR,
  },
  container: { 
    flex: 1, 
  },
  scrollContent: {
    flexGrow: 1,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: wp(4.5),
    paddingBottom: hp(1.5),
    backgroundColor: BG_COLOR,
    zIndex: 10,
  },
  headerTitle: {
    textAlign: "center",
    flex: 1,
    fontSize: rf(2.2),
    color: "#111827",
  },
  imageWrapper: {
    marginTop: hp(2),
    alignItems: "center",
    justifyContent: "center",
    height: hp(30),
  },
  scaleContainer: {
    marginTop: hp(2),
    paddingHorizontal: wp(10),
    alignItems: "center",
  },
  scaleWrapper: { width: "100%", height: hp(5), justifyContent: "center" },
  scaleTrack: {
    width: "100%",
    height: hp(1.2),
    borderRadius: wp(5),
    backgroundColor: LIGHT_GREEN,
    position: "relative",
  },
  scaleProgress: {
    position: "absolute",
    left: 0,
    top: 0,
    bottom: 0,
    borderRadius: wp(5),
    backgroundColor: PRIMARY_GREEN,
  },
  scaleThumb: {
    position: "absolute",
    top: -hp(1),
    left: 0,
    width: wp(6.5),
    height: wp(6.5),
    borderRadius: wp(3.25),
    backgroundColor: PRIMARY_GREEN,
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  scaleHitZones: { ...StyleSheet.absoluteFillObject, flexDirection: "row" },
  scaleHitZone: { flex: 1 },
  sizeLabel: {
    marginTop: hp(2),
    textAlign: "center",
    fontSize: rf(2),
  },
  potSizeContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: wp(5),
    marginTop: hp(2),
  },
  potOption: {
    alignItems: "center",
    paddingVertical: hp(2),
    paddingHorizontal: wp(2.5),
    borderRadius: wp(4),
    borderWidth: 1.5,
    borderColor: "#E5E5E5",
    backgroundColor: "#FFFFFF",
    flex: 1,
    marginHorizontal: wp(1.5),
  },
  potOptionActive: { borderColor: PRIMARY_GREEN, backgroundColor: CARD_BG },
  potName: { marginTop: hp(1), fontSize: rf(1.8) },
  potMeasurement: { marginTop: hp(0.2), fontSize: rf(1.4) },
  recommendationCard: {
    flexDirection: "row",
    backgroundColor: "#FFFFFF",
    borderRadius: wp(4),
    padding: wp(4),
    marginHorizontal: wp(5),
    marginTop: hp(3),
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
  },
  recommendationImageContainer: {
    width: wp(15),
    height: wp(15),
    borderRadius: wp(3),
    backgroundColor: CARD_BG,
    justifyContent: "center",
    alignItems: "center",
    marginRight: wp(3.5),
  },
  recommendationContent: { flex: 1, justifyContent: "center" },
  recommendationTitle: {
    marginBottom: hp(0.5),
    fontSize: rf(1.8),
  },
  recommendationText: {
    lineHeight: rf(2.4),
    fontSize: rf(1.4),
  },
  bottomContainer: {
    paddingVertical: hp(2),
    paddingHorizontal: wp(6), // Reduced from 15 to increase button width
    backgroundColor: 'transparent',
    alignItems: 'center',
  },
  continueButton: {
    width: '100%', 
    elevation: 6,
  },
});
