import React from "react";
import { 
  Pressable, 
  StyleSheet, 
  PressableProps, 
  ActivityIndicator, 
  ViewStyle, 
  TextStyle,
  View,
  Platform
} from "react-native";
import Text from "./Text";
import color from "../../constants/themes/color";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { responsiveFontSize as rf } from "react-native-responsive-dimensions";

type Props = PressableProps & {
  title: string;
  variant?: "primary" | "outline" | "secondary" | "neutral";
  size?: "small" | "medium" | "large";
  loading?: boolean;
  active?: boolean;
  textStyle?: TextStyle;
  icon?: React.ReactNode;
};

export default function Button({ 
  title, 
  style, 
  variant = "primary", 
  size = "medium",
  loading = false, 
  active = false,
  textStyle,
  disabled,
  icon,
  ...props 
}: Props) {
  
  // A button is "Highlighted" if it is variant primary OR if it's explicitly active
  const isHighlighted = variant === "primary" || active;
  const isOutline = variant === "outline" && !active;

  return (
    <Pressable 
      style={({ pressed }) => [
        styles.button, 
        isHighlighted ? styles.primary : styles[variant],
        size === "small" ? styles.smallButton : size === "large" ? styles.largeButton : styles.mediumButton,
        // Invert outline on press (Hover effect)
        isOutline && pressed && styles.outlinePressed,
        style as ViewStyle,
        (disabled || loading) && styles.disabled,
      ]} 
      disabled={disabled || loading}
      {...props}
    >
      {({ pressed }) => (
        loading ? (
          <ActivityIndicator size="small" color={isOutline && !pressed ? color.green.secondary : "#FFFFFF"} />
        ) : (
          <>
            {icon && <View style={styles.iconContainer}>{icon}</View>}
            <Text 
              weight="semibold" 
              style={[
                styles.baseText,
                isHighlighted ? styles.primaryText : styles[`${variant}Text`],
                isOutline && pressed && styles.outlineTextPressed,
                size === "small" ? styles.smallText : size === "large" ? styles.largeText : styles.mediumText,
                textStyle
              ]}
            >
              {title}
            </Text>
          </>
        )
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    borderRadius: 999,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    borderWidth: 1.5,
    borderColor: "transparent",
  },
  baseText: {
    textAlign: "center",
  },
  // Sizes
  smallButton: {
    height: hp(4),
    paddingHorizontal: wp(4),
  },
  mediumButton: {
    height: hp(5.5),
    paddingHorizontal: wp(6),
  },
  largeButton: {
    height: hp(7),
    paddingHorizontal: wp(8),
  },
  // Variants
  primary: {
    backgroundColor: color.green.primary,
    borderColor: color.green.primary,
  },
  secondary: {
    backgroundColor: color.green.secondary,
    borderColor: color.green.secondary,
  },
  outline: {
    backgroundColor: "transparent",
    borderColor: color.green.secondary,
  },
  neutral: {
    backgroundColor: "#FFFFFF",
    borderColor: "#E5E7EB",
  },
  // Text Colors
  primaryText: {
    color: "#FFFFFF",
  },
  secondaryText: {
    color: "#FFFFFF",
  },
  outlineText: {
    color: color.green.secondary,
  },
  neutralText: {
    color: "#1A1A1A",
  },
  // Pressed/Hover States
  outlinePressed: {
    backgroundColor: color.green.primary,
    borderColor: color.green.primary,
  },
  outlineTextPressed: {
    color: "#FFFFFF",
  },
  // Text Sizes
  smallText: {
    fontSize: rf(1.4),
  },
  mediumText: {
    fontSize: rf(1.7),
  },
  largeText: {
    fontSize: rf(2),
  },
  iconContainer: {
    marginRight: wp(2),
  },
  disabled: {
    opacity: 0.5,
  },
});
