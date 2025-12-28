/**
 * Plant Care Instructions Screen
 * Matches the reference design with backend integration and dynamic AI-powered data
 */
import {
  View,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Platform,
  StatusBar,
} from "react-native";
import { Image } from "expo-image";
import React, { useState, useEffect } from "react";
import { Ionicons, MaterialCommunityIcons, MaterialIcons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { getMyPlants } from "../../services/plantService";
import Text from "../../components/ui/Text";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { responsiveFontSize as rf } from "react-native-responsive-dimensions";

// MAIN COLORS
const PRIMARY_GREEN = "#76B198"; 
const LIGHT_GREEN_BG = "#F0F5F2"; 
const PAGE_BG = "#EDF2E9"; 

export default function InstructionScreen() {
  const { plantId } = useLocalSearchParams();
  const [plantData, setPlantData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const insets = useSafeAreaInsets();

  useEffect(() => {
    const fetchPlantDetails = async () => {
      try {
        if (plantId) {
          const plants = await getMyPlants();
          const plant = plants.find((p: any) => p._id === plantId || p.id === plantId);
          if (plant) {
            setPlantData(plant);
          }
        }
      } catch (error) {
        console.error("Error fetching plant details:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPlantDetails();
  }, [plantId]);

  const handleBackPress = () => {
    router.back();
  };

  const instructions = [
    {
      id: 'step1',
      icon: "water-outline",
      iconType: "Ionicons",
      title: "Check Soil Moisture",
      description: "Water only when the top inch of soil feels dry to the touch."
    },
    {
      id: 'step2',
      icon: "watering-can-outline",
      iconType: "MaterialCommunityIcons",
      title: "Water When Dry",
      description: "Thoroughly water until excess water drains out from the bottom."
    },
    {
      id: 'step3',
      icon: "thermometer-outline",
      iconType: "Ionicons",
      title: "Use Room Temperature Water",
      description: "Avoid using cold water to prevent shock to the roots."
    },
    {
      id: 'step4',
      icon: "filter-center-focus",
      iconType: "MaterialIcons",
      title: "Drain Excess Water",
      description: "Ensure no water is left standing in the saucer or pot."
    }
  ];

  if (loading) {
    return (
      <View style={[styles.wrapper, { justifyContent: 'center', alignItems: 'center', backgroundColor: PAGE_BG }]}>
        <ActivityIndicator size="large" color={PRIMARY_GREEN} />
      </View>
    );
  }

  return (
    <View style={styles.wrapper}>
      <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent />
      
      {/* Background layer for overscroll top bounce */}
      <View style={styles.topUnderlayer} />
      
      {/* Fixed Top Container (Static Header and Profile) */}
      <View style={styles.topContainer}>
        {/* Header */}
        <View style={[styles.header, { paddingTop: Platform.OS === 'ios' ? insets.top : (StatusBar.currentHeight || 0) + hp(1) }]}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={handleBackPress}
          >
            <Ionicons name="chevron-back" size={wp(5)} color="#6B7280" />
          </TouchableOpacity>
          <Text weight="semibold" style={styles.headerTitle}>Instructions</Text>
          <View style={styles.placeholder} />
        </View>

        {/* Profile Info */}
        <View style={styles.topSection}>
          <View style={styles.content}>
            <View style={styles.imageContainer}>
              <Image
                source={typeof plantData?.image === 'string' ? { uri: plantData.image } : plantData?.image}
                style={styles.plantImage}
                contentFit="cover"
              />
            </View>

            <Text weight="bold" style={styles.plantName}>Watering {plantData?.plantName || "Little Ben"}</Text>
            <Text variant="bodySmall" style={styles.botanicalName}>{plantData?.scientificName || "Monstera Deliciosa"}</Text>
          </View>
        </View>
      </View>

      {/* Scrollable Bottom Section */}
      <View style={styles.scrollWrapper}>
        <ScrollView
          style={styles.scrollContainer}
          contentContainerStyle={[
            styles.scrollContent, 
            { paddingBottom: insets.bottom + hp(4) }
          ]}
          showsVerticalScrollIndicator={false}
          bounces={true}
        >
          {/* Sub-Header inside the ScrollView */}
          <View style={styles.bottomSectionHeader}>
            <Text weight="bold" style={styles.instructionHeaderText}>
              Watering Instructions
            </Text>
          </View>

          {/* List Section */}
          <View style={styles.bottomSection}>
            <View style={styles.instructionsList}>
              {instructions.map((instruction, index) => (
                <View key={instruction.id} style={[
                  styles.instructionItem,
                  index === instructions.length - 1 && { marginBottom: 0 }
                ]}>
                  <View style={styles.iconContainer}>
                    <View style={styles.iconSquare}>
                      {instruction.iconType === "Ionicons" ? (
                        <Ionicons
                          name={instruction.icon as any}
                          size={wp(7)}
                          color={PRIMARY_GREEN}
                        />
                      ) : instruction.iconType === "MaterialCommunityIcons" ? (
                        <MaterialCommunityIcons
                          name={instruction.icon as any}
                          size={wp(7)}
                          color={PRIMARY_GREEN}
                        />
                      ) : (
                        <MaterialIcons
                          name={instruction.icon as any}
                          size={wp(7)}
                          color={PRIMARY_GREEN}
                        />
                      )}
                    </View>
                    <View style={styles.numberBadge}>
                      <Text weight="bold" style={styles.stepNumber}>{index + 1}</Text>
                    </View>
                  </View>

                  <View style={styles.instructionTextContainer}>
                    <Text weight="bold" style={styles.instructionTitle}>
                      {index + 1}. {instruction.title}
                    </Text>
                    <Text variant="bodySmall" style={styles.instructionDescription}>
                      {instruction.description}
                    </Text>
                  </View>
                </View>
              ))}
            </View>
          </View>
        </ScrollView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: "#FFFFFF", 
  },
  topUnderlayer: {
    position: 'absolute',
    top: -1000, 
    left: 0,
    right: 0,
    height: 1000 + hp(40), 
    backgroundColor: PAGE_BG,
    zIndex: -1,
  },
  topContainer: {
    backgroundColor: PAGE_BG,
    zIndex: 10,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: wp(5),
    paddingBottom: hp(1),
  },
  backButton: {
    width: wp(10),
    height: wp(10),
    borderRadius: wp(5),
    backgroundColor: "#FFFFFF",
    justifyContent: "center",
    alignItems: "center",
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  headerTitle: {
    color: "#111",
    fontSize: Platform.OS === "android" ? rf(2) : rf(2.2),
    textAlign: "center",
    flex: 1,
    marginRight: wp(2),
  },
  placeholder: {
    width: wp(10),
  },
  topSection: {
    paddingBottom: hp(2),
  },
  content: {
    paddingHorizontal: wp(6),
    alignItems: "center",
  },
  imageContainer: {
    width: "100%",
    height: hp(26), 
    marginBottom: hp(1.5),
    borderRadius: wp(5),
    overflow: "hidden",
    backgroundColor: "#fff",
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  plantImage: {
    width: "100%",
    height: "100%",
  },
  plantName: {
    color: "#000",
    textAlign: "center",
    marginBottom: hp(0.2),
    fontSize: rf(2.8),
    lineHeight: Platform.OS === "android" ? rf(3.5) : undefined,
  },
  botanicalName: {
    color: "#8E8E93",
    textAlign: "center",
    marginBottom: hp(1),
    fontSize: rf(1.8),
  },
  scrollWrapper: {
    flex: 1,
    backgroundColor: "#FFFFFF", 
    borderTopLeftRadius: wp(8),
    borderTopRightRadius: wp(8),
    overflow: 'hidden',
  },
  scrollContainer: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  bottomSectionHeader: {
    backgroundColor: "#FFFFFF",
    paddingHorizontal: wp(8),
    paddingTop: hp(3.5),
    paddingBottom: hp(1.5),
  },
  instructionHeaderText: {
    color: "#4A4A4A",
    fontSize: rf(2.2),
    lineHeight: Platform.OS === "android" ? rf(3) : undefined,
  },
  bottomSection: {
    backgroundColor: "#FFFFFF", 
    paddingHorizontal: wp(8),
    flex: 1,
  },
  instructionsList: {
    width: "100%",
  },
  instructionItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: hp(3.5),
  },
  iconContainer: {
    position: "relative",
    marginRight: wp(4.5),
  },
  iconSquare: {
    width: wp(13.5),
    height: wp(13.5),
    borderRadius: wp(3),
    backgroundColor: LIGHT_GREEN_BG,
    justifyContent: "center",
    alignItems: "center",
  },
  numberBadge: {
    position: "absolute",
    top: -wp(1.2),
    left: -wp(1.2),
    width: wp(5.5),
    height: wp(5.5),
    borderRadius: wp(2.75),
    backgroundColor: PRIMARY_GREEN,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#FFFFFF",
    zIndex: 100,
    elevation: 5,
  },
  stepNumber: {
    fontSize: rf(1.4),
    color: "#FFFFFF",
    textAlign: 'center',
    textAlignVertical: 'center',
    includeFontPadding: false,
    ...Platform.select({
      ios: {
        lineHeight: rf(1.4),
      },
      android: {
        lineHeight: rf(1.8),
      }
    }),
  },
  instructionTextContainer: {
    flex: 1,
  },
  instructionTitle: {
    fontSize: rf(1.9),
    color: "#111",
    marginBottom: hp(0.2),
    lineHeight: Platform.OS === "android" ? rf(2.4) : undefined,
  },
  instructionDescription: {
    color: "#4A4A4A",
    lineHeight: rf(2.1),
    fontSize: rf(1.5),
  },
});
