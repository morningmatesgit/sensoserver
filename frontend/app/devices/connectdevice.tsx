import {
  View,
  StyleSheet,
  TouchableOpacity,
  Platform,
  StatusBar,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import { router } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { connectImage1 } from "../../assets/images";
import Text from "../../components/ui/Text";
import Button from "../../components/ui/Button";
import CloseButton from "../../components/ui/CloseButton";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { responsiveFontSize as rf } from "react-native-responsive-dimensions";

export default function ConnectDeviceScreen() {
  const insets = useSafeAreaInsets();

  const handleClose = () => {
    router.push("/dashboard/myplants");
  };

  const handleReadyToConnect = () => {
    router.push("/devices/wifiselect");
  };

  return (
    <LinearGradient colors={["#E6F4ED", "#F4F5EE"]} style={[styles.outerContainer, { paddingTop: insets.top, paddingBottom: insets.bottom }]}>
      <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent />
      
      {/* Close Button */}
      <View style={styles.header}>
        <View style={styles.headerSpacer} />
        <CloseButton onPress={handleClose} variant="circular" color="#a8b5a8" />
      </View>

      {/* Center Image */}
      <View style={styles.imageContainer}>
        {(() => {
          const Img = connectImage1 as any;
          return <Img width={wp(85)} height={wp(85)} />;
        })()}
      </View>

      {/* Instructions */}
      <View style={styles.instructionsContainer}>
        <Text variant="h2" weight="semibold" style={styles.instructionTitle}>Turn On & Connect</Text>
        <Text variant="body" style={styles.instructionText}>
          To begin, turn on your Senso device. Open the menu and click on the
          Communication Button.
        </Text>
      </View>

      <View style={styles.spacer} />

      {/* Ready to Connect Button */}
      <View style={styles.buttonWrapper}>
        <Button 
          title="Ready to Connect" 
          onPress={handleReadyToConnect} 
          style={styles.connectButton}
          size="medium"
        />
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  outerContainer: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: wp(5),
    paddingTop: hp(1),
    zIndex: 10,
  },
  headerSpacer: {
    flex: 1,
  },
  imageContainer: {
    justifyContent: "center",
    alignItems: "center",
    marginTop: hp(4),
    paddingBottom: hp(2),
  },
  instructionsContainer: {
    paddingHorizontal: wp(10),
    paddingVertical: hp(3),
    alignItems: "flex-start",
  },
  instructionTitle: {
    marginBottom: hp(1.5),
    fontSize: Platform.OS === "android" ? rf(2.6) : rf(2.8),
  },
  instructionText: {
    color: "#4C4C4C",
    fontSize: Platform.OS === "android" ? rf(1.8) : rf(2),
    lineHeight: Platform.OS === "android" ? rf(2.5) : rf(2.8),
  },
  spacer: {
    flex: 1,
  },
  buttonWrapper: {
    paddingHorizontal: wp(8),
    paddingBottom: hp(2),
  },
  connectButton: {
    width: '100%',
  },
});
