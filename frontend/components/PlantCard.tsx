import React from 'react';
import { View, StyleSheet, TouchableOpacity, Platform, GestureResponderEvent } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { Image } from 'expo-image';
import Text from './ui/Text';
import Button from './ui/Button';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { responsiveFontSize as rf } from "react-native-responsive-dimensions";

interface PlantCardProps {
  plant: {
    _id?: string;
    id?: number | string;
    name: string;
    scientificName?: string;
    type?: string;
    moisture?: number;
    temperature?: number;
    distance?: string;
    connected: boolean;
    image: any;
    status?: string;
    needsWater?: boolean;
  };
}

export default function PlantCard({ plant }: PlantCardProps) {
  
  const handlePlantPress = () => {
    const id = plant._id || plant.id;
    if (!id) return;
    
    router.push({
      pathname: '/plants/plantinfo',
      params: { plantId: String(id) }
    });
  };

  const handleDevicePress = (e?: GestureResponderEvent) => {
    if (e && e.stopPropagation) {
      e.stopPropagation();
    }
    router.push('/devices/connectdevice');
  };
  
  return (
    <TouchableOpacity style={styles.plantCard} onPress={handlePlantPress} activeOpacity={0.9}>
      <View style={styles.plantCardContent}>
        {/* Left Side: Large Plant Image */}
        <View style={styles.plantImageContainer}>
          <Image 
            source={typeof plant.image === 'string' ? { uri: plant.image } : plant.image} 
            style={styles.plantImage}
            contentFit="cover"
            transition={300}
          />
        </View>

        {/* Right Side: Info and Metrics */}
        <View style={styles.plantInfo}>
          <View style={styles.headerRow}>
            <View style={styles.textContainer}>
              <Text weight="bold" style={styles.plantName} numberOfLines={1}>{plant.name}</Text>
              <Text variant="caption" style={styles.scientificName} numberOfLines={1}>
                {plant.scientificName || plant.type || "Scientific Name"}
              </Text>
            </View>
            
            <View onStartShouldSetResponder={() => true} onResponderGrant={(e) => e.stopPropagation()}>
              <Button 
                title="Device"
                onPress={handleDevicePress}
                variant="outline"
                size="small"
                style={styles.deviceButton}
                textStyle={styles.deviceButtonText}
              />
            </View>
          </View>

          {/* Metrics Row - Icons with Values Below */}
          <View style={styles.metricsRow}>
            <View style={styles.metricItem}>
              <View style={styles.metricIconCircle}>
                <Ionicons name="water" size={wp(4.5)} color="#3b82f6" />
              </View>
              <Text weight="medium" style={styles.metricValue}>
                {plant.connected ? `${plant.moisture || 0}%` : "--"}
              </Text>
            </View>
            
            <View style={styles.metricItem}>
              <View style={styles.metricIconCircle}>
                <Ionicons name="thermometer" size={wp(4.5)} color="#ef4444" />
              </View>
              <Text weight="medium" style={styles.metricValue}>
                {plant.connected ? `${plant.temperature || 0}°C` : "--"}
              </Text>
            </View>
            
            <View style={styles.metricItem}>
              <View style={styles.metricIconCircle}>
                <Ionicons name="sunny" size={wp(4.5)} color="#facc15" />
              </View>
              <Text weight="medium" style={styles.metricValue}>
                {plant.connected ? (plant.distance || "0.2 DLI") : "--"}
              </Text>
            </View>
          </View>
          
          {!plant.connected && (
            <Text variant="caption" style={styles.waitingText}>Waiting for senso to connect</Text>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  plantCard: {
    backgroundColor: "white",
    borderRadius: wp(6),
    padding: wp(4),
    marginBottom: hp(2),
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.08,
        shadowRadius: 10,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  plantCardContent: {
    flexDirection: "row",
    alignItems: 'center',
  },
  plantImageContainer: {
    width: wp(28),
    height: wp(32),
    marginRight: wp(2),
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: wp(6),
    overflow: 'hidden',
  },
  plantImage: {
    width: "100%",
    height: "100%",
    borderRadius: wp(5),
  },
  plantInfo: {
    flex: 1,
    paddingLeft: wp(1),
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: hp(1.5),
  },
  textContainer: {
    flex: 1,
  },
  plantName: {
    fontSize: rf(2.2),
    color: "#000",
    marginBottom: 2,
  },
  scientificName: {
    color: "#8E8E93",
    fontSize: rf(1.5),
  },
  deviceButton: {
    paddingVertical: 0, 
    paddingHorizontal: wp(2.5), 
    height: Platform.OS === 'android' ? hp(3.5) : hp(3), 
    borderRadius: 999,
    minWidth: wp(18), 
    borderColor: '#868686',
    borderWidth: 1.2,
    backgroundColor: 'transparent',
    alignItems: 'center',
    justifyContent: 'center',
  },
  deviceButtonText: {
    fontSize: rf(1.4), 
    color: "#868686",
    fontWeight: '600',
    textAlign: 'center',
    ...Platform.select({
      android: {
        textAlignVertical: 'center',
        includeFontPadding: false,
        paddingTop: 0,
        marginTop: -hp(0.2), 
      },
    }),
  },
  metricsRow: {
    flexDirection: "row",
    justifyContent: 'flex-start',
    gap: wp(4),
    marginTop: hp(0.5),
  },
  metricItem: {
    alignItems: "center",
  },
  metricIconCircle: {
    backgroundColor: "#F1F8F1",
    width: wp(10),
    height: wp(10),
    borderRadius: wp(5),
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: hp(0.5),
  },
  metricValue: {
    fontSize: rf(1.3),
    color: "#3A3A3C",
  },
  waitingText: {
    color: "#8E8E93",
    marginTop: hp(1),
    fontSize: rf(1.2),
    textAlign: 'left',
    width: '100%',
  },
});
