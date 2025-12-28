import React from "react";
import { View, StyleSheet, TouchableOpacity, Platform } from "react-native";
import { useRouter } from "expo-router";
import Text from "./ui/Text";
import { infoImages } from "../assets/images";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { responsiveFontSize as rf } from "react-native-responsive-dimensions";

interface TaskCardProps {
  task: {
    id: string | number;
    title: string;
    time: string;
    image: any;
  };
}

export default function TaskCard({ task }: TaskCardProps) {
  const router = useRouter();
  
  // Parse title to extract action and plant name
  const titleParts = task.title.split(" ");
  const action = titleParts[0]; 
  const plantName = titleParts.slice(1).join(" ");

  const handleTaskPress = () => {
    router.push({
      pathname: "/dashboard/addtasks",
      params: { plantId: task.id } // Pass real plantId from task
    });
  };

  // Using the info1 SVG as shown in the design image
  const InfoIcon = infoImages.info1;

  return (
    <TouchableOpacity style={styles.taskCard} onPress={handleTaskPress} activeOpacity={0.8}>
      <View style={styles.taskImageContainer}>
        {InfoIcon && (
          <View style={styles.svgWrapper}>
           <InfoIcon
             width={wp(9)}
             height={wp(9)}
             preserveAspectRatio="xMidYMid meet"
             style={{
                 transform: [{ translateX: wp(0.8) }], // Increased to shift slightly more to right
               }}
           />
          </View>
        )}
      </View>
      <View style={styles.taskContent}>
        <Text weight="bold" style={styles.taskTitle}>{action}</Text>
        <Text weight="bold" style={styles.taskPlantName} numberOfLines={1}>{plantName}</Text>
        <Text weight="medium" style={styles.taskTime}>{task.time}</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  taskCard: {
    backgroundColor: "white",
    borderRadius: wp(5),
    paddingVertical: wp(3),
    paddingHorizontal: wp(2),
    marginRight: wp(4),
    width: wp(48),
    flexDirection: "row",
    alignItems: "center",
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.06,
        shadowRadius: 10,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  taskImageContainer: {
    backgroundColor: "#F0F5F0",
    borderRadius: wp(4),
    marginRight: wp(2.5),
    width: wp(15),
    height: wp(15),
    justifyContent: 'center',
    alignItems: 'center',
  },
  svgWrapper: {
    width: wp(11),
    height: wp(11),
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'visible', // Ensure no clipping when moving right
  },
  taskContent: {
    flex: 1,
    justifyContent: 'center',
  },
  taskTitle: {
    fontSize: rf(1.9),
    color: "#1A1A1A",
    lineHeight: rf(2.4),
  },
  taskPlantName: {
    fontSize: rf(1.9),
    color: "#1A1A1A",
    lineHeight: rf(2.4),
  },
  taskTime: {
    color: "#8E8E93",
    marginTop: hp(0.2),
    fontSize: rf(1.5),
  },
});
