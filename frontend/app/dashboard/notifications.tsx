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
import React, { useState, useEffect } from "react";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import NotificationCard from "../../components/NotificationCard";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Text from "../../components/ui/Text";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { responsiveFontSize as rf } from "react-native-responsive-dimensions";

const API_BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL;

export default function NotificationsScreen() {
  const [notifications, setNotifications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const insets = useSafeAreaInsets();

  const fetchNotifications = async () => {
    try {
      const token = await AsyncStorage.getItem("authToken");
      if (!token) {
        setNotifications([]); 
        setLoading(false);
        return;
      }

      const response = await fetch(`${API_BASE_URL}/api/notification`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      if (data.success && data.data && data.data.length > 0) {
        // Map backend data to UI format
        const mappedData = data.data.map((n: any) => ({
          id: n._id,
          title: n.title,
          message: n.message,
          plantName: n.metadata?.plantName || "Senso Plant",
          time: new Date(n.createdAt).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }),
          priority: n.priority || "info",
          read: n.read,
          // Map backend type/priority to the correct SVG icons from assets
          icon: getIconForNotification(n),
          iconColor: getIconColorForNotification(n),
        }));
        setNotifications(mappedData);
      } else {
        setNotifications([]);
      }
    } catch (error) {
      console.log("Notification fetch error:", (error as Error).message);
      setNotifications([]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // Helper to map backend notifications to local icons
  const getIconForNotification = (n: any) => {
    const type = n.type?.toLowerCase();
    const { notificationImages } = require("../../assets/images/index");
    
    if (type === 'water' || n.title.toLowerCase().includes('water')) return notificationImages.waterAlert;
    if (type === 'light' || n.title.toLowerCase().includes('light')) return notificationImages.sunlightAlert;
    if (type === 'fertilizer' || n.title.toLowerCase().includes('fertilize')) return notificationImages.fertilizeIcon;
    return notificationImages.notifyIcon;
  };

  const getIconColorForNotification = (n: any) => {
    if (n.priority === 'high') return "#ef4444";
    if (n.priority === 'medium') return "#f59e0b";
    return "#4AA88B";
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const handleRead = async (id: string) => {
    try {
      const token = await AsyncStorage.getItem("authToken");
      if (token) {
        await fetch(`${API_BASE_URL}/api/notification/${id}/read`, {
          method: "PUT",
          headers: { Authorization: `Bearer ${token}` },
        });
      }
      setNotifications(
        notifications.map((n) => (n.id === id ? { ...n, read: true } : n))
      );
    } catch (e) {}
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchNotifications();
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent />
      
      <View style={[styles.header, { paddingTop: Platform.OS === 'ios' ? insets.top : (StatusBar.currentHeight || 0) + hp(1) }]}>
        <TouchableOpacity style={styles.headerButton} onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={wp(6)} color="#666" />
        </TouchableOpacity>
        
        <Text weight="semibold" style={styles.headerTitle}>Notification</Text>
        
        <TouchableOpacity style={styles.headerButton}>
          <Ionicons name="notifications-outline" size={wp(6)} color="#666" />
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={[styles.scrollContent, { paddingBottom: insets.bottom + hp(5) }]}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={["#4AA88B"]}
          />
        }
      >
        {loading && !refreshing ? (
          <ActivityIndicator size="large" color="#4AA88B" style={{ marginTop: hp(10) }} />
        ) : notifications.length > 0 ? (
          notifications.map((n) => (
            <NotificationCard
              key={n.id}
              notification={n}
              onPress={() => handleRead(n.id)}
            />
          ))
        ) : (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No notifications yet!</Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: wp(4),
    paddingBottom: hp(2),
    backgroundColor: "#FFFFFF",
    zIndex: 10,
  },
  headerButton: {
    width: wp(10),
    height: wp(10),
    justifyContent: "center",
    alignItems: "center",
  },
  headerTitle: {
    color: "#000",
    fontSize: rf(2.2)
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: wp(5),
    paddingTop: hp(1),
    flexGrow: 1,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: hp(10),
  },
  emptyText: {
    color: '#9ca3af',
    fontSize: rf(1.8),
  }
});
