import {
  View,
  StyleSheet,
  Image,
  Platform,
  StatusBar,
} from "react-native";
import React from "react";
import { router } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { connectImage1 } from "../../assets/images";
import Text from "../../components/ui/Text";
import Button from "../../components/ui/Button";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { responsiveFontSize as rf } from "react-native-responsive-dimensions";

export default function WelcomeScreen() {
  const insets = useSafeAreaInsets();

  const handleGetStarted = () => {
    router.push('/auth/signup');
  };

  const handleHaveAccount = () => {
    router.push('/auth/login');
  };

  return (
    <View style={[
      styles.container, 
      { 
        paddingTop: insets.top,
        paddingBottom: insets.bottom || hp(2)
      }
    ]}>
      <StatusBar barStyle="dark-content" backgroundColor="#f0f4f0" translucent />
      <View style={styles.innerContainer}>
        <View style={styles.imageContainer}>
          <Image source={connectImage1} style={styles.welcomeImage} resizeMode="contain" />
        </View>

        <View style={styles.contentContainer}>
          <Text variant="h2" weight="semibold" style={styles.welcomeTitle}>Welcome to Senso</Text>
          <Text variant="body" style={styles.welcomeSubtitle}>
            Monitor and care for your plants with smart sensor technology
          </Text>
        </View>

        <View style={styles.spacer} />

        <View style={styles.buttonContainer}>
          <Button 
            title="Get Started" 
            onPress={handleGetStarted} 
            variant="primary"
          />

          <Button
            title="I Have an Account"
            onPress={handleHaveAccount}
            variant="outline"
          />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f0f4f0",
  },
  innerContainer: {
    flex: 1,
    paddingHorizontal: wp(6),
  },
  imageContainer: {
    justifyContent: "center",
    alignItems: "center",
    paddingTop: hp(8),
    paddingBottom: hp(4),
  },
  welcomeImage: {
    width: wp(65),
    height: wp(65),
  },
  contentContainer: {
    alignItems: "center",
    paddingHorizontal: wp(4),
    paddingVertical: hp(2),
  },
  welcomeTitle: {
    marginBottom: hp(2),
    textAlign: "center",
    fontSize: rf(3),
  },
  welcomeSubtitle: {
    textAlign: "center",
    color: "#6b8a7a",
    fontSize: rf(2),
    lineHeight: rf(2.8),
  },
  spacer: {
    flex: 1,
  },
  buttonContainer: {
    paddingBottom: hp(3),
    gap: hp(2),
  },
});
