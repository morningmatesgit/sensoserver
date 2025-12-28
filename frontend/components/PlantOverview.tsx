import React from "react";
import { View, StyleSheet, TouchableOpacity, Platform } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Text from "./ui/Text";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { responsiveFontSize as rf } from "react-native-responsive-dimensions";

interface PlantOverviewProps {
  totalPlants: number;
  needsWaterCount: number;
  healthyCount: number;
  activeFilter?: string;
  onFilterChange?: (filter: string) => void;
  showFilters?: boolean;
}

const PlantOverview: React.FC<PlantOverviewProps> = ({
  totalPlants,
  needsWaterCount,
  healthyCount,
  activeFilter = "all",
  onFilterChange,
  showFilters = true,
}) => {
  return (
    <View style={styles.container}>
      {/* Stats Section */}
      <View style={styles.plantsOverviewSection}>
        {/* Total Plants */}
        <View style={[styles.overviewItem, styles.alignStart]}>
          <View style={styles.overviewRow}>
            <Text weight="bold" style={styles.overviewNumber}>{totalPlants}</Text>
            <Text weight="bold" style={styles.overviewLabel}>Plants</Text>
          </View>
          <Text weight="medium" style={styles.overviewSubText}>Total in your jungle</Text>
        </View>

        {/* Needs Water */}
        <View style={[styles.overviewItem, styles.alignStart]}>
          <View style={styles.overviewRow}>
            <Text weight="bold" style={styles.overviewNumber}>{needsWaterCount}</Text>
            <Ionicons 
              name="water" 
              size={rf(2.8)} 
              color="#4db8ff" 
              style={styles.overviewIcon} 
            />
          </View>
          <Text weight="medium" style={styles.overviewSubText}>Need Water</Text>
        </View>

        {/* Healthy */}
        <View style={[styles.overviewItem, styles.alignStart]}>
          <View style={styles.overviewRow}>
            <Text weight="bold" style={styles.overviewNumber}>{healthyCount}</Text>
            <Ionicons 
              name="checkmark-circle" 
              size={rf(2.8)} 
              color="#4BAB5F" 
              style={styles.overviewIcon} 
            />
          </View>
          <Text weight="medium" style={styles.overviewSubText}>Healthy</Text>
        </View>
      </View>

      {/* Filter Tabs */}
      {showFilters && onFilterChange && (
        <View style={styles.filterContainer}>
          {[
            { id: "all", label: "All" },
            { id: "senso", label: "Senso" },
            { id: "need-care", label: "Need Care" },
          ].map((filter) => (
            <TouchableOpacity
              key={filter.id}
              style={[
                styles.filterButton,
                activeFilter === filter.id && styles.filterButtonActive,
              ]}
              onPress={() => onFilterChange(filter.id)}
              activeOpacity={0.7}
            >
              <Text
                weight="bold"
                style={[
                  styles.filterText,
                  activeFilter === filter.id && styles.filterTextActive,
                ]}
              >
                {filter.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: hp(1),
    paddingHorizontal: wp(4.5),
  },
  plantsOverviewSection: {
    flexDirection: "row",
    justifyContent: "space-between", 
    alignItems: "flex-start",
    marginBottom: hp(2.5),
  },
  overviewItem: {
    justifyContent: 'flex-start',
  },
  alignStart: {
    alignItems: "flex-start",
  },
  overviewRow: {
    flexDirection: "row",
    alignItems: "center", // Changed to center for better consistency across OS
    height: rf(4.5), // Fixed height to prevent clipping on iOS
  },
  overviewNumber: {
    fontSize: rf(3.8),
    color: "#000000",
    letterSpacing: -0.5,
    lineHeight: rf(4.2), // Added lineHeight for iOS
  },
  overviewLabel: {
    fontSize: rf(3.8),
    color: "#000000",
    marginLeft: wp(1),
    letterSpacing: -0.5,
    lineHeight: rf(4.2), // Added lineHeight for iOS
  },
  overviewSubText: {
    color: "#4A4A4A",
    fontSize: rf(1.6),
    marginTop: Platform.OS === 'ios' ? hp(0.1) : hp(0.2),
    lineHeight: rf(2.2), // Added lineHeight for iOS
  },
  overviewIcon: {
    marginLeft: wp(1.5),
    ...Platform.select({
      ios: {
        marginTop: hp(0.2), // Slight adjustment for iOS icon vertical alignment
      },
    }),
  },
  filterContainer: {
    flexDirection: "row",
    marginBottom: hp(2),
    justifyContent: "flex-start",
    gap: wp(3),
  },
  filterButton: {
    height: hp(4.2), // Slightly increased for iOS touch area and centering
    paddingHorizontal: wp(5),
    borderRadius: 999,
    borderWidth: 1,
    borderColor: "#4a5f4a",
    backgroundColor: "transparent",
    alignItems: "center",
    justifyContent: "center",
  },
  filterButtonActive: {
    backgroundColor: "#2d4a33",
    borderColor: "#2d4a33",
  },
  filterText: {
    fontSize: rf(1.6),
    color: "#4a5f4a",
    includeFontPadding: false, // Ensure no padding issues
    textAlignVertical: 'center',
  },
  filterTextActive: {
    color: "white",
  },
});

export default PlantOverview;
