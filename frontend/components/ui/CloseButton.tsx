import React from "react";
import { TouchableOpacity, StyleSheet, ViewStyle, Platform } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { widthPercentageToDP as wp } from "react-native-responsive-screen";

interface CloseButtonProps {
  onPress: () => void;
  variant?: "circular" | "transparent";
  color?: string;
  size?: number;
  style?: ViewStyle;
  disabled?: boolean;
}

const CloseButton: React.FC<CloseButtonProps> = ({
  onPress,
  variant = "circular",
  color,
  size,
  style,
  disabled = false,
}) => {
  const isCircular = variant === "circular";
  
  const defaultSize = wp(6);
  const defaultColor = isCircular ? "#6B7280" : "#1a3c2a";

  return (
    <TouchableOpacity
      onPress={onPress}
      style={[
        styles.button,
        isCircular && styles.circular,
        disabled && styles.disabled,
        style,
      ]}
      activeOpacity={0.7}
      disabled={disabled}
    >
      <Ionicons
        name="close"
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
  disabled: {
    opacity: 0.5,
  },
});

export default CloseButton;
