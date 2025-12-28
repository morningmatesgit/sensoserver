import React from "react";
import { View, StyleSheet, TouchableOpacity, Platform } from "react-native";
import { Image } from "expo-image";
import { Ionicons } from "@expo/vector-icons";
import Text from "./ui/Text";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { responsiveFontSize as rf } from "react-native-responsive-dimensions";

interface MyPlantCardProps {
  plant: {
    _id?: string;
    id?: string | number;
    plantName: string;
    image: any;
    location?: string;
    needsWater?: boolean;
    status?: string;
    moisture?: number;
  };
  onPress: () => void;
}

const MyPlantCard: React.FC<MyPlantCardProps> = ({ plant, onPress }) => {
  const getPlantStatus = (plant: any) => {
    const needsWater =
      plant.needsWater ||
      plant.status === "waiting" ||
      (plant.moisture !== undefined && plant.moisture < 30);

    if (needsWater) {
      return { label: "Needs Water", color: "#EF4444", icon: "alert-circle" };
    }

    return { label: "Watered", color: "#B0B0B0", icon: "checkmark-circle" };
  };

  const status = getPlantStatus(plant);

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <View style={styles.imageContainer}>
        <Image
          source={
            typeof plant.image === "string" ? { uri: plant.image } : plant.image
          }
          style={styles.image}
          contentFit="cover"
          transition={300}
        />
      </View>

      <View style={styles.content}>
        <Text weight="semibold" style={styles.plantName} numberOfLines={2}>
          {plant.plantName}
        </Text>

        <View style={styles.statusRow}>
          <Ionicons
            name={status.icon as any}
            size={rf(1.4)}
            color={status.label === "Watered" ? "#4BAB5F" : status.color}
          />
          <Text
            variant="caption"
            style={[styles.statusText, { color: status.color }]}
          >
            {status.label}
          </Text>
        </View>

        <View style={styles.locationBadge}>
          <Text
            variant="caption"
            weight="medium"
            style={styles.locationText}
            numberOfLines={1}
          >
            {plant.location || "General"}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    width: wp(43),
    backgroundColor: "#FFFFFF",
    borderRadius: wp(5),
    padding: wp(2),
    flexDirection: "row",
    alignItems: "center",
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.08,
        shadowRadius: 10,
      },
      android: {
        elevation: 3,
      },
    }),
    marginBottom: hp(1.5),
    minHeight: hp(11), 
  },
  imageContainer: {
    width: wp(16),
    height: wp(18),
    borderRadius: wp(4),
    backgroundColor: "transparent", // Removed background color
    overflow: "hidden", 
    justifyContent: "center",
    alignItems: "center",
  },
  image: {
    width: "100%",
    height: "100%",
    borderRadius: wp(4), // Ensure image itself follows rounding
  },
  content: {
    flex: 1,
    paddingLeft: wp(2.5),
    justifyContent: "center",
  },
  plantName: {
    fontSize: rf(1.9), // Increased size
    color: "#333",
    lineHeight: rf(2.3),
    marginBottom: hp(0.3),
  },
  statusRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: wp(0.8),
    marginBottom: hp(0.6),
  },
  statusText: {
    fontSize: rf(1.3),
    lineHeight: rf(1.7),
  },
  locationBadge: {
    backgroundColor: "#E4F3E6",
    paddingHorizontal: wp(2),
    paddingVertical: hp(0.2),
    borderRadius: wp(1.5),
    alignSelf: "flex-start",
  },
  locationText: {
    fontSize: rf(1.2),
    color: "#4A634A", // Matches device button text color from PlantCard
  },
});

export default MyPlantCard;