import React from 'react';
import { View, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";

interface BottomNavigationProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export default function BottomNavigation({ activeTab, setActiveTab }: BottomNavigationProps) {
  const insets = useSafeAreaInsets();

  return (
    <View style={[
      styles.bottomNav, 
      { paddingBottom: Math.max(insets.bottom, hp(1.5)) }
    ]}>
      <TouchableOpacity
        style={styles.navItem}
        onPress={() => setActiveTab("home")}
      >
        <Ionicons
          name={activeTab === "home" ? "home" : "home-outline"}
          size={wp(6)}
          color={activeTab === "home" ? "#2d5a3d" : "#9ca3af"}
        />
      </TouchableOpacity>
      
      <TouchableOpacity
        style={styles.navItem}
        onPress={() => setActiveTab("add")}
      >
        <Ionicons
          name="add"
          size={wp(9)}
          color={activeTab === "add" ? "#2d5a3d" : "#9ca3af"}
        />
      </TouchableOpacity>
      
      <TouchableOpacity
        style={styles.navItem}
        onPress={() => setActiveTab("my-plants")}
      >
        <Ionicons
          name={activeTab === "my-plants" ? "leaf" : "leaf-outline"}
          size={wp(6)}
          color={activeTab === "my-plants" ? "#2d5a3d" : "#9ca3af"}
        />
      </TouchableOpacity>
      
      <TouchableOpacity
        style={styles.navItem}
        onPress={() => setActiveTab("profile")}
      >
        <Ionicons
          name={activeTab === "profile" ? "person" : "person-outline"}
          size={wp(6)}
          color={activeTab === "profile" ? "#2d5a3d" : "#9ca3af"}
        />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  bottomNav: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: "row",
    backgroundColor: "white",
    paddingHorizontal: wp(5),
    justifyContent: "space-around",
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: -2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 10,
      },
    }),
    borderTopLeftRadius: wp(8),
    borderTopRightRadius: wp(8),
    borderTopWidth: 1,
    borderTopColor: "#e5e7eb",
  },
  navItem: {
    alignItems: "center",
    justifyContent: "center",
    padding: wp(2.5),
  },
});
