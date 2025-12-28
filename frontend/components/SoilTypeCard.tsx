import React from 'react';
import { View, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Text from './ui/Text';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { responsiveFontSize as rf } from "react-native-responsive-dimensions";

interface SoilTypeCardProps {
  soil: {
    id: string;
    name: string;
    description: string;
    image: any;
  };
  isSelected: boolean;
  onPress: () => void;
}

const SoilTypeCard: React.FC<SoilTypeCardProps> = ({ soil, isSelected, onPress }) => {
  const Icon = soil.image;

  return (
    <TouchableOpacity
      style={[
        styles.soilCard,
        isSelected && styles.soilCardSelected,
      ]}
      onPress={onPress}
      activeOpacity={0.9}
    >
      <View style={styles.soilImageContainer}>
        {Icon && <Icon width={wp(18)} height={wp(18)} />}
      </View>
      <View style={styles.soilInfo}>
        <Text weight="bold" style={styles.soilName}>{soil.name}</Text>
        <Text variant="caption" style={styles.soilDescription} numberOfLines={2}>
          {soil.description}
        </Text>
      </View>
      <View
        style={[
          styles.radioButton,
          isSelected && styles.radioButtonSelected,
        ]}
      >
        {isSelected ? (
          <Ionicons name="checkmark-circle" size={wp(7.5)} color="#5B9C71" />
        ) : (
          <View style={styles.radioEmpty} />
        )}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  soilCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#ffffff",
    borderRadius: wp(5),
    paddingVertical: hp(2.5), // Increased vertical size
    paddingHorizontal: wp(5),
    marginBottom: hp(2),
    ...Platform.select({
      android: { elevation: 3 },
      ios: { 
        shadowColor: "#000", 
        shadowOpacity: 0.08, 
        shadowRadius: 12, 
        shadowOffset: { width: 0, height: 4 } 
      }
    })
  },
  soilCardSelected: {
    backgroundColor: '#F0F9F1',
    borderColor: 'rgba(91, 156, 113, 0.2)',
    borderWidth: 1,
  },
  soilImageContainer: {
    width: wp(22),
    height: wp(22),
    borderRadius: wp(4),
    backgroundColor: "#EBF3E8",
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: wp(4.5),
  },
  soilInfo: {
    flex: 1,
  },
  soilName: {
    fontSize: rf(2.2),
    color: "#000",
    marginBottom: hp(0.5),
  },
  soilDescription: {
    color: "#666",
    fontSize: rf(1.6),
    lineHeight: rf(2.2),
  },
  radioButton: {
    width: wp(9),
    height: wp(9),
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
});

export default SoilTypeCard;
