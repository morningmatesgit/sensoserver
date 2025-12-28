/**
 * My Plants Dashboard - Detailed view of user's plant collection
 * Displays plants grouped by location with backend integration
 */
import {
  View,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  RefreshControl,
  Platform,
  StatusBar,
  TouchableOpacity,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import React, { useState, useEffect, useCallback, useMemo } from "react";
import { router } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useAuth } from "../../context/AppContext";
import BottomNavigation from "../../components/BottomNavigation";
import MyPlantCard from "../../components/MyPlantCard";
import { getMyPlants } from "../../services/plantService";
import Text from "../../components/ui/Text";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { responsiveFontSize as rf } from "react-native-responsive-dimensions";

export default function MyPlantsDashboard() {
  const [activeTab, setActiveTab] = useState("my-plants");
  const { isAuthenticated } = useAuth();
  const [plants, setPlants] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const insets = useSafeAreaInsets();

  const loadData = async () => {
    if (!isAuthenticated) {
      setLoading(false);
      setRefreshing(false);
      return;
    }
    try {
      const data = await getMyPlants();
      setPlants(data || []);
    } catch (err) {
      console.error("Error loading plants:", err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [isAuthenticated]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    loadData();
  }, [isAuthenticated]);

  const groupedPlants = useMemo(() => {
    return plants.reduce((acc: any, plant: any) => {
      const loc = plant.location || "General";
      if (!acc[loc]) acc[loc] = [];
      acc[loc].push(plant);
      return acc;
    }, {});
  }, [plants]);

  const handleNavPress = (tab: string) => {
    setActiveTab(tab);
    if (tab === "home") {
      router.push("/dashboard/dashboard");
    } else if (tab === "add") {
      router.push("/devices/scanner");
    } else if (tab === "profile") {
      if (isAuthenticated) router.push("/auth/profile");
      else router.push("/auth/login");
    }
  };

  const handlePlantPress = (plant: any) => {
    router.push({
      pathname: "/plants/plantinfo",
      params: { plantId: plant._id || plant.id }
    });
  };

  return (
    <LinearGradient
      colors={["#F1F8F1", "#EBF3E8"]} 
      start={{ x: 0, y: 0 }}
      end={{ x: 0, y: 1 }}
      style={styles.container}
    >
      <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent />
      
      {/* Universal Header spacing logic for all screens */}
      <View style={[styles.staticHeader, { 
        paddingTop: Platform.OS === 'ios' ? insets.top : (StatusBar.currentHeight || 0) + hp(1) 
      }]}>
        <View style={styles.header}>
          <Text weight="bold" style={styles.headerTitle}>My Plants</Text>
          <Text style={styles.headerSubtitle}>
            Your plants are thriving today!
          </Text>
        </View>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={[
          styles.scrollViewContent,
          { 
            paddingBottom: hp(15) + insets.bottom 
          }
        ]}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl 
            refreshing={refreshing} 
            onRefresh={onRefresh} 
            colors={["#4BAB5F"]}
            progressViewOffset={Platform.OS === 'ios' ? insets.top : StatusBar.currentHeight}
          />
        }
      >
        <View style={styles.mainContent}>
          {loading && !refreshing ? (
            <ActivityIndicator size="large" color="#4BAB5F" style={{ marginTop: hp(5) }} />
          ) : plants.length > 0 ? (
            Object.entries(groupedPlants).map(([location, locationPlants]: [string, any]) => (
              <View key={location} style={styles.locationSection}>
                <Text weight="bold" style={styles.locationTitle}>
                  {location === "LivingRoom" ? "Living Room" : location}
                </Text>

                <View style={styles.gridContainer}>
                  {locationPlants.map((plant: any) => (
                    <MyPlantCard
                      key={plant._id || plant.id}
                      plant={plant}
                      onPress={() => handlePlantPress(plant)}
                    />
                  ))}
                  {locationPlants.length % 2 !== 0 && <View style={styles.emptyCardSpacer} />}
                </View>
              </View>
            ))
          ) : (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>No plants found. Start by scanning a plant! 🌿</Text>
              {!isAuthenticated && (
                <TouchableOpacity onPress={() => router.push('/auth/login')}>
                  <Text weight="semibold" style={styles.loginLink}>Login to see your collection</Text>
                </TouchableOpacity>
              )}
            </View>
          )}
        </View>
      </ScrollView>
      
      <BottomNavigation activeTab={activeTab} setActiveTab={handleNavPress} />
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  staticHeader: {
    backgroundColor: 'transparent',
    zIndex: 10,
  },
  scrollView: {
    flex: 1,
  },
  scrollViewContent: {
    flexGrow: 1,
  },
  mainContent: {
    flex: 1,
    paddingTop: hp(1),
  },

  // HEADER
  header: {
    paddingHorizontal: wp(5),
    marginBottom: hp(1),
  },
  headerTitle: {
    color: "#000",
    fontSize: rf(4),
    lineHeight: Platform.OS === 'ios' ? rf(4.8) : undefined,
    marginBottom: hp(0.2),
  },
  headerSubtitle: {
    color: "#8E8E93",
    fontSize: rf(1.7),
  },

  // LOCATION SECTION
  locationSection: {
    marginBottom: hp(1.5),
    paddingHorizontal: wp(5),
  },
  locationTitle: {
    color: "#000",
    marginBottom: hp(1.2),
    fontSize: rf(2.1),
  },

  // GRID CONTAINER
  gridContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  
  emptyCardSpacer: {
    width: wp(43),
  },
  
  emptyContainer: {
    alignItems: 'center',
    marginTop: hp(8),
    paddingHorizontal: wp(10),
  },
  emptyText: {
    textAlign: 'center',
    color: '#666',
    fontSize: rf(1.8),
  },
  loginLink: {
    color: '#4BAB5F',
    marginTop: hp(2),
    textDecorationLine: 'underline',
    fontSize: rf(1.8),
  },
});
