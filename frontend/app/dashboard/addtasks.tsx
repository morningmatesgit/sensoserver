import React, { useState, useEffect } from "react";
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Modal,
  StatusBar,
  ScrollView,
  Image,
  Platform,
  ActivityIndicator,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter, useLocalSearchParams } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { taskTypes } from "../../assets/images";
import Text from "../../components/ui/Text";
import Button from "../../components/ui/Button";
import CloseButton from "../../components/ui/CloseButton";
import { updatePlant, getMyPlants } from "../../services/plantService";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { responsiveFontSize as rf } from "react-native-responsive-dimensions";
import { Ionicons } from "@expo/vector-icons";

const AddTasksScreen = () => {
  const router = useRouter();
  const { plantId } = useLocalSearchParams();
  const insets = useSafeAreaInsets();
  
  const [showModal, setShowModal] = useState(false);
  const [selectedTask, setSelectedTask] = useState<any>(null);
  const [plantData, setPlantData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    const fetchPlant = async () => {
      try {
        const plants = await getMyPlants();
        const plant = plants.find((p: any) => p._id === plantId || p.id === plantId);
        if (plant) {
          setPlantData(plant);
        }
      } catch (error) {
        console.error("Error fetching plant:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchPlant();
  }, [plantId]);

  const handleTaskClick = (task: any) => {
    setSelectedTask(task);
    if (task.name.toLowerCase() === "water") {
      setShowModal(true);
    } else {
      router.push({
        pathname: "/dashboard/instruction",
        params: { plantId, taskType: task.name }
      });
    }
  };

  const handleWatered = async () => {
    if (!plantData) return;
    
    setUpdating(true);
    try {
      await updatePlant(plantData._id || plantData.id, {
        needsWater: false,
        lastWatered: new Date().toISOString(),
      });
      setShowModal(false);
      router.push("/dashboard/dashboard");
    } catch (error) {
      console.error("Error updating water status:", error);
    } finally {
      setUpdating(false);
    }
  };

  const handleClose = () => {
    setShowModal(false);
  };

  const handleBack = () => {
    router.back();
  };

  if (loading) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color="#5a9a7a" />
      </View>
    );
  }

  return (
    <LinearGradient
      colors={["#EBF3E8", "#D1EBD7"]}
      start={{ x: 0, y: 0 }}
      end={{ x: 0, y: 1 }}
      style={[styles.container, { paddingTop: Platform.OS === 'ios' ? insets.top : (StatusBar.currentHeight || 0) + hp(1) }]}
    >
      <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent />
      
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[styles.scrollContent, { paddingBottom: insets.bottom + hp(5) }]}
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.backBtn} onPress={handleBack}>
            <Ionicons name="chevron-back" size={wp(6)} color="#111827" />
          </TouchableOpacity>
          <Text weight="semibold" style={styles.headerTitle}>Add Tasks</Text>
          <View style={styles.headerSpacer} />
        </View>

        {/* Task Card */}
        <View style={styles.card}>
          <Text weight="medium" style={styles.cardTitle}>
            Add task to {plantData?.plantName || plantData?.name || "Plant"}
          </Text>

          {/* Task List */}
          <View style={styles.taskList}>
            {taskTypes.map((task) => (
              <TouchableOpacity
                key={task.id}
                style={styles.taskItem}
                onPress={() => handleTaskClick(task)}
                activeOpacity={0.7}
              >
                <View style={styles.taskContent}>
                  <View style={styles.iconContainer}>
                    {(() => {
                      const IconComp = task.icon as any;
                      return <IconComp width="100%" height="100%" />;
                    })()}
                  </View>
                  <Text style={styles.taskName}>{task.name}</Text>
                </View>
                <TouchableOpacity onPress={() => handleTaskClick(task)}>
                  <Ionicons name="chevron-forward" size={wp(5)} color="#6b7280" />
                </TouchableOpacity>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </ScrollView>

      {/* Modal - Aligned left and smaller buttons */}
      <Modal
        visible={showModal}
        transparent={true}
        animationType="fade"
        onRequestClose={handleClose}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text weight="bold" style={styles.modalTitle}>Mark as watered?</Text>
            <Text style={styles.modalText}>
              This action will mark the {plantData?.plantName || "plant"} as watered.
            </Text>
            
            <View style={styles.modalButtons}>
              <TouchableOpacity 
                style={[styles.modalBtn, styles.wateredBtn]} 
                onPress={handleWatered}
                disabled={updating}
              >
                {updating ? (
                  <ActivityIndicator color="#fff" size="small" />
                ) : (
                  <Text weight="bold" style={styles.wateredBtnText}>Watered</Text>
                )}
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={[styles.modalBtn, styles.closeBtn]} 
                onPress={handleClose}
              >
                <Text weight="bold" style={styles.closeBtnText}>Close</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingTop: hp(1),
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: wp(5),
    marginBottom: hp(2),
  },
  backBtn: {
    width: wp(11),
    height: wp(11),
    borderRadius: wp(5.5),
    backgroundColor: "rgba(255,255,255,0.4)",
    justifyContent: "center",
    alignItems: "center",
  },
  headerTitle: {
    color: "#111827",
    fontSize: rf(2.2),
  },
  headerSpacer: {
    width: wp(11),
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: wp(6),
    marginHorizontal: wp(4),
    paddingHorizontal: wp(6),
    paddingTop: wp(6),
    paddingBottom: wp(2),
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 10,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  cardTitle: {
    color: "#5a9a7a",
    marginBottom: hp(2),
    fontSize: rf(2),
  },
  taskList: {
    backgroundColor: "#fff",
  },
  taskItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: hp(1.8),
    // Removed borderBottomWidth and borderBottomColor
  },
  taskContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  iconContainer: {
    width: wp(15),
    height: wp(15),
    borderRadius: wp(4),
    backgroundColor: "#f0f9f4",
    alignItems: "center",
    justifyContent: "center",
    marginRight: wp(4),
    overflow: "hidden",
    padding: wp(1),
  },
  taskName: {
    fontSize: rf(2),
    color: "#333",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.4)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "#EBF3E8",
    borderRadius: wp(6),
    padding: wp(8),
    width: wp(85),
    alignItems: "flex-start", // Content aligned left
    ...Platform.select({
      android: { elevation: 10 },
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.2,
        shadowRadius: 20,
      }
    }),
  },
  modalTitle: {
    color: "#1a1a1a",
    marginBottom: hp(2),
    fontSize: rf(2.4),
    textAlign: "left", // Text aligned left
  },
  modalText: {
    color: "#4A4A4A",
    marginBottom: hp(4),
    textAlign: "left", // Text aligned left
    fontSize: rf(1.8),
    lineHeight: rf(2.4),
  },
  modalButtons: {
    flexDirection: "row",
    width: "100%",
    justifyContent: "flex-start", // Buttons aligned left
    gap: wp(3),
  },
  modalBtn: {
    height: hp(5.5), 
    borderRadius: wp(10), 
    justifyContent: "center",
    alignItems: "center",
  },
  wateredBtn: {
    backgroundColor: "#63A375",
    flex: 2, // Increased width/flex
  },
  wateredBtnText: {
    color: "#fff",
    fontSize: rf(1.6),
  },
  closeBtn: {
    backgroundColor: "transparent",
    borderWidth: 1.5,
    borderColor: "#63A375",
    flex: 1, // Close button stays smaller
  },
  closeBtnText: {
    color: "#63A375",
    fontSize: rf(1.6),
  },
});

export default AddTasksScreen;
