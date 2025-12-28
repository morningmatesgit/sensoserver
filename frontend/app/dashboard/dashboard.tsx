/**
 * Dashboard screen for the Senso Plant Care app
 * Displays user's plants and their status with backend integration
 */
import {
  View,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  RefreshControl,
  Platform,
  StatusBar,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import React, { useState, useEffect, useCallback } from "react";
import { Ionicons } from "@expo/vector-icons";
import { router, useFocusEffect } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useAuth } from "../../context/AppContext";
import PlantCard from "../../components/PlantCard";
import BottomNavigation from "../../components/BottomNavigation";
import PlantOverview from "../../components/PlantOverview";
import { getMyPlants } from "../../services/plantService";
import Text from "../../components/ui/Text";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { responsiveFontSize as rf } from "react-native-responsive-dimensions";

export default function DashboardScreen() {
  const [activeTab, setActiveTab] = useState("home");
  const [activeFilter, setActiveFilter] = useState("all");
  const [plants, setPlants] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const { user, isAuthenticated } = useAuth();
  const insets = useSafeAreaInsets();

  // Reset active tab to home whenever the dashboard comes into focus
  useFocusEffect(
    useCallback(() => {
      setActiveTab("home");
    }, [])
  );

  const fetchPlants = async () => {
    try {
      const data = await getMyPlants();
      setPlants(data || []);
    } catch (error) {
      console.error("Error fetching plants:", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchPlants();
    } else {
      setLoading(false);
    }
  }, [isAuthenticated]);

  const onRefresh = useCallback(() => {
    if (isAuthenticated) {
      setRefreshing(true);
      fetchPlants();
    }
  }, [isAuthenticated]);

  const filteredPlants = (plants || []).filter((plant) => {
    if (activeFilter === "all") return true;
    if (activeFilter === "senso") return plant.connected;
    if (activeFilter === "need-care")
      return plant.status === "waiting" || plant.needsWater;
    return true;
  });

  const totalPlants = plants.length;
  const needsWaterCount = plants.filter(
    (p) => p.status === "waiting" || p.needsWater
  ).length;
  const healthyCount = plants.filter(
    (p) => p.status === "healthy" && !p.needsWater
  ).length;

  const getInitials = (name?: string) => {
    if (!name) return "?";
    return name.charAt(0).toUpperCase();
  };

  return (
    <LinearGradient
      colors={["#EBF3E8", "#D1EBD7"]}
      start={{ x: 0, y: 0 }}
      end={{ x: 0, y: 1 }}
      style={styles.container}
    >
      <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent />
      
      {/* Dynamic Header spacing based on platform status bar height */}
      <View style={[styles.mainContent, { paddingTop: Platform.OS === 'ios' ? insets.top : (StatusBar.currentHeight || hp(2)) + hp(1) }]}>
        
        {/* Static Header */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.notificationButton}
            onPress={() => router.push("/dashboard/notifications")}
          >
            <Ionicons name="notifications-outline" size={wp(5.5)} color="#666" />
          </TouchableOpacity>

          <View style={styles.profileCircle}>
            <Text weight="semibold" style={styles.profileInitial}>
              {getInitials(user?.name)}
            </Text>
          </View>
        </View>

        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={[
            styles.scrollContent,
            { paddingBottom: hp(12) + insets.bottom }
          ]}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor="#2d5a3d"
              colors={["#2d5a3d"]}
              progressViewOffset={Platform.OS === 'android' ? 20 : 0}
            />
          }
        >
          {/* Today's Tasks Heading */}
          <View style={styles.section}>
            <Text weight="bold" style={styles.sectionTitle}>Today's tasks</Text>
            <View style={styles.noTasksContainer}>
              <Text style={styles.noTasksText}>No tasks assigned</Text>
            </View>
          </View>

          {/* Plant Overview Component (Stats & Filters) */}
          <PlantOverview 
            totalPlants={totalPlants}
            needsWaterCount={needsWaterCount}
            healthyCount={healthyCount}
            activeFilter={activeFilter}
            onFilterChange={setActiveFilter}
          />

          {/* Plant Cards */}
          <View style={styles.plantsList}>
            {loading ? (
              <ActivityIndicator
                size="large"
                color="#2d5a3d"
                style={{ marginTop: hp(5) }}
              />
            ) : filteredPlants.length > 0 ? (
              filteredPlants.map((plant) => (
                <PlantCard
                  key={plant._id || plant.id}
                  plant={{
                    ...plant,
                    name: plant.plantName || plant.name,
                    scientificName: plant.scientificName || plant.type,
                    image: plant.image
                      ? typeof plant.image === "string"
                        ? { uri: plant.image }
                        : plant.image
                      : null,
                    moisture: plant.moisture,
                    temperature: plant.temperature,
                    distance: plant.distance,
                    connected: plant.connected,
                  }}
                />
              ))
            ) : (
              <View style={styles.emptyContainer}>
                <Text style={styles.emptyText}>No plants found.</Text>
                {!isAuthenticated && (
                  <TouchableOpacity onPress={() => router.push("/auth/login")}>
                    <Text weight="semibold" style={styles.loginLink}>
                      Login to see your plants
                    </Text>
                  </TouchableOpacity>
                )}
              </View>
            )}
          </View>
        </ScrollView>
      </View>

      {/* Bottom Navigation */}
      <BottomNavigation
        activeTab={activeTab}
        setActiveTab={(tab) => {
          setActiveTab(tab);
          if (tab === "home") {
            router.push("/dashboard/dashboard");
          } else if (tab === "add") {
            router.push("/devices/scanner");
          } else if (tab === "my-plants") {
            router.push("/dashboard/myplants");
          } else if (tab === "profile") {
            if (isAuthenticated) {
              router.push("/auth/profile");
            } else {
              router.push("/auth/login");
            }
          }
        }}
      />
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  mainContent: { flex: 1 },
  scrollView: { flex: 1 },
  scrollContent: { },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: wp(4),
    height: hp(7),
    zIndex: 10,
    marginBottom: hp(1),
  },
  notificationButton: {
    width: wp(11),
    height: wp(11),
    borderRadius: wp(5.5),
    backgroundColor: "#ffffff",
    justifyContent: "center",
    alignItems: "center",
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  profileCircle: {
    width: wp(11),
    height: wp(11),
    borderRadius: wp(5.5),
    backgroundColor: "#D1EBD7",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.5)",
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  profileInitial: {
    color: "#1a3c2a",
    fontSize: rf(2.2),
  },
  section: { 
    marginTop: hp(1), 
    marginBottom: hp(1),
    paddingHorizontal: wp(4.5),
  },
  sectionTitle: {
    fontSize: rf(2.4),
    color: "#000000",
    marginBottom: hp(0.5),
  },
  noTasksContainer: {
    paddingVertical: hp(1),
  },
  noTasksText: {
    color: "#6b7280",
    fontSize: rf(1.8),
  },
  plantsList: { 
    paddingHorizontal: wp(4),
    marginTop: hp(1) 
  },
  emptyContainer: { 
    alignItems: "center", 
    marginTop: hp(5),
    paddingBottom: hp(10)
  },
  emptyText: {
    textAlign: "center",
    color: "#666",
    fontSize: rf(1.8)
  },
  loginLink: {
    color: "#2d5a3d",
    marginTop: hp(1.5),
    textDecorationLine: "underline",
    fontSize: rf(1.8)
  },
});
