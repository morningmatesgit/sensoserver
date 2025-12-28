// SelectDeviceScreen.tsx
import React, { useState } from "react";
import {
  View,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  Dimensions,
  Platform,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { deviceImages } from "../../assets/images";
import Text from "../../components/ui/Text";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { responsiveFontSize as rf } from "react-native-responsive-dimensions";

const { width } = Dimensions.get("window");

const SelectDeviceScreen: React.FC = () => {
  const router = useRouter();
  const [selected, setSelected] = useState<string | null>(null);
  const insets = useSafeAreaInsets();

  const handleClose = () => {
    router.back();
  };

  const handleDeviceSelect = (deviceName: string) => {
    setSelected(deviceName);
    console.log(`Selected device: ${deviceName}`);
    // router.push(`/devices/pairing/${deviceName}`);
  };

  return (
    <LinearGradient colors={["#EAF3EC", "#EEF6EF"]} style={[styles.outerContainer, { paddingTop: insets.top, paddingBottom: insets.bottom }]}>
      <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent />
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.headerWrap}>
          <Text weight="semibold" style={styles.headerTitle}>Select device to pair</Text>

          <TouchableOpacity
            style={styles.closeButton}
            onPress={handleClose}
            activeOpacity={0.8}
            accessibilityLabel="close"
          >
            <Ionicons name="close" size={wp(5)} color="#4B5563" />
          </TouchableOpacity>
        </View>

        {/* Devices row */}
        <View style={styles.row}>
          <TouchableOpacity
            activeOpacity={0.85}
            onPress={() => handleDeviceSelect("Mini Senso")}
            style={[
              styles.deviceCard,
              selected === "Mini Senso" && styles.deviceCardSelected,
            ]}
          >
            <View style={styles.innerWrap}>
              <View style={styles.imgBoxMini}>
                {(() => {
                  const MiniIcon = deviceImages.miniSensoPair as any;
                  return <MiniIcon width={wp(45)} height={hp(18)} />;
                })()}
              </View>
            </View>

            <View style={styles.nameWrap}>
              <Text weight="semibold" style={styles.deviceName}>Mini Senso</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            activeOpacity={0.85}
            onPress={() => handleDeviceSelect("Senso 1")}
            style={[
              styles.deviceCard,
              selected === "Senso 1" && styles.deviceCardSelected,
            ]}
          >
            <View style={styles.innerWrap}>
              <View style={styles.imgBox}>
                {(() => {
                  const SensoIcon = deviceImages.sensoPair as any;
                  return <SensoIcon width={wp(25)} height={wp(25)} />;
                })()}
              </View>
            </View>

            <View style={styles.nameWrap}>
              <Text weight="semibold" style={styles.deviceName}>Senso 1</Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>
    </LinearGradient>
  );
};

const CARD_GAP = wp(4);
const CARD_WIDTH = (wp(100) - wp(10) - CARD_GAP) / 2;

const styles = StyleSheet.create({
  outerContainer: { flex: 1 },
  container: { flex: 1 },

  /* Header */
  headerWrap: {
    paddingHorizontal: wp(5),
    paddingTop: hp(4),
    paddingBottom: hp(4),
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
  },
  headerTitle: {
    textAlign: "center",
    fontSize: Platform.OS === "android" ? rf(2) : rf(2.2),
  },
  closeButton: {
    position: "absolute",
    right: wp(4.5),
    top: hp(1.8),
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
        shadowOpacity: 0.08,
        shadowRadius: 3,
      },
      android: {
        elevation: 3,
      },
    }),
  },

  /* Row for two cards */
  row: {
    flexDirection: "row",
    paddingHorizontal: wp(5),
    gap: CARD_GAP,
    marginTop: hp(1),
  },

  /* Card */
  deviceCard: {
    width: CARD_WIDTH,
    backgroundColor: "#FFFFFF",
    borderRadius: wp(3.5),
    overflow: "hidden",
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.05,
        shadowRadius: 12,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  deviceCardSelected: {
    borderWidth: 2,
    borderColor: "#2d5a3d",
    backgroundColor: "#f0f9f4",
    ...Platform.select({
      android: { elevation: 5 },
    }),
  },

  innerWrap: {
    paddingTop: hp(2.5),
    paddingBottom: hp(0.8),
    paddingHorizontal: wp(3.5),
    alignItems: "center",
    backgroundColor: "transparent",
  },

  imgBox: {
    width: wp(35),
    height: wp(35),
    borderRadius: wp(3),
    alignItems: "center",
    justifyContent: "flex-end",
    backgroundColor: "#f3f4f6",
    overflow: "hidden",
    ...Platform.select({
      android: { elevation: 2 },
    }),
  },

  imgBoxMini: {
    width: wp(35),
    height: wp(35),
    borderRadius: wp(3),
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#f3f4f6",
    overflow: "hidden",
    ...Platform.select({
      android: { elevation: 2 },
    }),
  },

  nameWrap: {
    paddingVertical: hp(1.8),
    alignItems: "center",
    backgroundColor: "transparent",
  },

  deviceName: {
    fontSize: Platform.OS === "android" ? rf(1.4) : rf(1.6),
    color: "#374151",
    textAlign: "center",
  },
});

export default SelectDeviceScreen;
