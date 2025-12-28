import React from "react";
import { Text as RNText, TextProps, StyleSheet, Platform } from "react-native";

export type TextVariant = "h1" | "h2" | "h3" | "body" | "bodySmall" | "caption";
export type TextWeight = "regular" | "medium" | "semibold" | "bold";

type Props = TextProps & {
  variant?: TextVariant;
  weight?: TextWeight;
};

export default function Text({
  children,
  style,
  variant = "body",
  weight = "regular",
  ...props
}: Props) {
  const getFontFamily = () => {
    switch (weight) {
      case "medium":
        return "Inter-Medium";
      case "semibold":
        return "Inter-SemiBold";
      case "bold":
        return "Inter-SemiBold"; // Using SemiBold as fallback for Bold
      default:
        return "Inter-Regular";
    }
  };

  return (
    <RNText
      {...props}
      allowFontScaling={false} // Prevents the app from using the user's default system font size
      style={[
        styles.base,
        styles[variant],
        { 
          fontFamily: getFontFamily(),
          // On Android, explicitly setting fontWeight to undefined when using custom fonts 
          // prevents the OS from applying its own bolding on top of the custom font file.
          fontWeight: undefined,
        },
        style,
      ]}
    >
      {children}
    </RNText>
  );
}

const styles = StyleSheet.create({
  base: {
    color: "#1A1A1A",
    ...Platform.select({
      android: {
        // Disabling font padding on Android ensures text alignment and line height 
        // match iOS much more closely.
        includeFontPadding: false,
        textAlignVertical: 'center',
      },
    }),
  },
  h1: {
    fontSize: 32,
    lineHeight: 40,
  },
  h2: {
    fontSize: 24,
    lineHeight: 32,
  },
  h3: {
    fontSize: 20,
    lineHeight: 28,
  },
  body: {
    fontSize: 16,
    lineHeight: 24,
  },
  bodySmall: {
    fontSize: 14,
    lineHeight: 20,
  },
  caption: {
    fontSize: 12,
    lineHeight: 16,
  },
});
