/**
 * NotificationCard Component
 * Displays individual notification with design-accurate styling
 */
import React from "react";
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Image,
  Platform,
} from "react-native";
import Text from "./ui/Text";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { responsiveFontSize as rf } from "react-native-responsive-dimensions";

interface NotificationCardProps {
  notification: {
    id: number | string;
    title: string;
    message: string;
    plantName: string;
    time: string;
    priority: "high" | "medium" | "normal" | "low" | "info";
    read: boolean;
    icon: any; 
    iconColor: string;
  };
  onPress: (notificationId: string) => void;
}

export default function NotificationCard({
  notification,
  onPress,
}: NotificationCardProps) {
  
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "#EF4444"; // Red
      case "medium":
        return "#F59E0B"; // Yellow
      case "normal":
        return "#3B82F6"; // Blue
      case "low":
      case "info":
        return "#4BAB5F"; // Green
      default:
        return "#6b8a7a";
    }
  };

  const IconComp = notification.icon;
  const priorityColor = getPriorityColor(notification.priority);

  return (
    <View style={styles.cardWrapper}>
      <TouchableOpacity
        style={styles.notificationCard}
        onPress={() => onPress(notification.id.toString())}
        activeOpacity={0.9}
      >
        <View style={styles.notificationContent}>
          {/* Increased Icon Container & Icon Size */}
          <View
            style={[
              styles.iconContainer,
              { backgroundColor: notification.iconColor + "15" || "#F0F5F0" },
            ]}
          >
            {typeof IconComp === 'function' ? (
              <IconComp width={wp(15)} height={wp(15)} />
            ) : (
              <Image
                source={IconComp}
                style={styles.iconImage}
                resizeMode="contain"
              />
            )}
          </View>

          {/* Dynamic Content Area */}
          <View style={styles.notificationInfo}>
            <Text weight="bold" style={styles.notificationTitle}>{notification.title}</Text>
            <Text style={styles.notificationMessage} numberOfLines={2}>
              {notification.message}
            </Text>
            
            <View style={styles.footer}>
              <Text weight="bold" style={styles.plantName}>
                {notification.plantName || "Senso Plant"}
              </Text>
              <Text style={styles.notificationTime}>
                {notification.time}
              </Text>
            </View>
          </View>
        </View>
      </TouchableOpacity>

      {/* Fixed Centering for Priority Badge Symbol */}
      <View style={[styles.priorityBadge, { backgroundColor: priorityColor }]}>
        <View style={styles.priorityIconWrapper}>
          <Text style={styles.priorityIcon}>!</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  cardWrapper: {
    marginBottom: hp(2),
    position: 'relative',
    marginHorizontal: wp(1),
  },
  notificationCard: {
    backgroundColor: "#ffffff",
    borderRadius: wp(6),
    padding: wp(4.5),
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.08,
        shadowRadius: 15,
      },
      android: {
        elevation: 6,
      },
    }),
  },
  notificationContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  iconContainer: {
    width: wp(22), // Increased from 20
    height: wp(22), // Increased from 20
    borderRadius: wp(5.5),
    justifyContent: "center",
    alignItems: "center",
    marginRight: wp(4),
  },
  iconImage: {
    width: "85%", // Increased from 75%
    height: "85%", // Increased from 75%
  },
  notificationInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  notificationTitle: {
    fontSize: rf(2.2),
    color: "#1A1A1A",
    marginBottom: 2,
  },
  notificationMessage: {
    fontSize: rf(1.8),
    color: "#666",
    lineHeight: rf(2.4),
    marginBottom: hp(0.8),
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  plantName: {
    fontSize: rf(1.9),
    color: "#4BAB5F",
  },
  notificationTime: {
    color: "#8E8E93",
    fontSize: rf(1.7),
  },
  priorityBadge: {
    position: 'absolute',
    top: -wp(1.5),
    right: -wp(1.5),
    width: wp(7.5),
    height: wp(7.5),
    borderRadius: wp(3.75),
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#FFFFFF',
    zIndex: 20,
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 3,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  priorityIconWrapper: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    ...Platform.select({
      android: {
        marginTop: -hp(0.3), // Adjust for Android baseline centering
      }
    })
  },
  priorityIcon: {
    color: '#FFFFFF',
    fontSize: rf(2.2),
    fontWeight: '900',
    textAlign: 'center',
    textAlignVertical: 'center',
    includeFontPadding: false,
  }
});
