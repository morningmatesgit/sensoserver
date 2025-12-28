import React from "react";
import { TouchableOpacity, StyleSheet, ViewStyle, Platform } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { widthPercentageToDP as wp } from "react-native-responsive-screen";

interface BackButtonProps {
  onPress: () => void;
  variant?: "circular" | "transparent";
  color?: string;
  size?: number;
  style?: ViewStyle;
}

const BackButton: React.FC<BackButtonProps> = ({
  onPress,
  variant = "transparent",
  color,
  size,
  style,
}) => {
  const isCircular = variant === "circular";
  
  const defaultSize = isCircular ? wp(5.5) : wp(7);
  const defaultColor = isCircular ? "#6B7280" : "#1a3c2a";

  return (
    <TouchableOpacity
      onPress={onPress}
      style={[
        styles.button,
        isCircular && styles.circular,
        style,
      ]}
      activeOpacity={0.7}
    >
      <Ionicons
        name="chevron-back"
        size={size || defaultSize}
        color={color || defaultColor}
      />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    justifyContent: "center",
    alignItems: "center",
    padding: wp(2),
  },
  circular: {
    width: wp(10),
    height: wp(10),
    borderRadius: wp(5),
    backgroundColor: "#FFFFFF",
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.2,
        shadowRadius: 1.41,
      },
      android: {
        elevation: 2,
      },
    }),
    padding: 0,
  },
});

export default BackButton;
