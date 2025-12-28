/**
 * Plant Information Screen
 * UI matching the reference design exactly with Real-time Graph and Backend Connection
 */
import {
  View,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
  Dimensions,
  ActivityIndicator,
  Platform,
  Alert,
  Share,
  StatusBar,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import HealthStatus, { HealthStatusType } from "../../components/HealthStatus";
import { SimpleGraph } from "../../components/RealTimeGraph";

import React from "react";
import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { infoImages, uiIcons, plantImages } from "../../assets/images";
import {
  getPlantById,
  deletePlant,
} from "../../services/plantService";
import { getDeviceStatus } from "../../services/deviceService";
import Text from "../../components/ui/Text";
import Button from "../../components/ui/Button";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { responsiveFontSize as rf } from "react-native-responsive-dimensions";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

// MAIN COLORS
const PRIMARY_GREEN = "#4AA88B";
const DARK_GREEN = "#2C593A";

export default function PlantInfoScreen() {
  const params = useLocalSearchParams();
  const plantId = params.plantId;
  const insets = useSafeAreaInsets();

  // STATE
  const [plant, setPlant] = React.useState<any>(null);
  const [sensorData, setSensorData] = React.useState<any>(null);
  const [loading, setLoading] = React.useState(true);
  const [activeTab, setActiveTab] = React.useState("todo");
  const [selectedTodos, setSelectedTodos] = React.useState<string[]>([]);
  const [selectedTimePeriod, setSelectedTimePeriod] = React.useState("Day");
  const [healthStatus, setHealthStatus] =
    React.useState<HealthStatusType>("healthy");
  const [selectedMetric, setSelectedMetric] = React.useState("moisture");
  const [dropdownOpen, setDropdownOpen] = React.useState(false);
  const [shareDropdownOpen, setShareDropdownOpen] = React.useState(false);

  // FETCH DATA
  const loadPlantData = React.useCallback(async () => {
    if (!plantId) {
      setLoading(false);
      return;
    }
    try {
      setLoading(true);
      const plantId_str = Array.isArray(plantId) ? plantId[0] : plantId;
      const plantData = await getPlantById(plantId_str);
      setPlant(plantData);

      if (plantData?.healthStatus) {
        setHealthStatus(plantData.healthStatus as HealthStatusType);
      }

      if (plantData?.deviceId) {
        const status = await getDeviceStatus(plantData.deviceId);
        if (status && status.lastData) {
          setSensorData({
            moisture: status.lastData.sh / 10,
            temperature: status.lastData.t / 10,
            light: status.lastData.lx / 10,
            isOnline: status.isOnline,
          });
        }
      }
    } catch (err) {
      console.error("Error loading plant data:", err);
    } finally {
      setLoading(false);
    }
  }, [plantId]);

  React.useEffect(() => {
    loadPlantData();
  }, [loadPlantData]);

  const toggleTodo = (todoId: string) => {
    setSelectedTodos((prev: string[]) =>
      prev.includes(todoId)
        ? prev.filter((id: string) => id !== todoId)
        : [...prev, todoId]
    );
  };

  const handleBackPress = () => {
    router.back();
  };

  const handleSharePress = () => {
    setShareDropdownOpen(!shareDropdownOpen);
  };

  const handleSharePlant = async () => {
    if (!plant) return;
    try {
      const shareText = `Check out my ${plant.plantName || 'Plant'} (${plant.scientificName || ''}) on Senso Plant Care!`;
      await Share.share({
        message: shareText,
      });
    } catch (error: any) {
      Alert.alert(error.message);
    }
  };

  const handleDeletePlant = async () => {
    if (!plantId) return;
    Alert.alert("Delete Plant", "Are you sure you want to delete this plant?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          try {
            const plantId_str = Array.isArray(plantId) ? plantId[0] : plantId;
            await deletePlant(plantId_str);
            router.replace("/dashboard/dashboard");
          } catch (error) {
            console.error("Error deleting plant:", error);
            Alert.alert("Error", "Failed to delete plant. Please try again.");
          }
        },
      },
    ]);
  };

  const handleTakePhoto = () => {
    router.push({
      pathname: "/devices/camera",
      params: {
        plantId: Array.isArray(plantId) ? plantId[0] : plantId,
        mode: 'health-scan'
      }
    });
  };

  const handleTodoPress = () => {
    router.push({
      pathname: "/dashboard/instruction",
      params: { plantId: Array.isArray(plantId) ? plantId[0] : plantId }
    });
  };

  const getMetricIcon = (metric: string) => {
    switch (metric) {
      case "moisture": return "water";
      case "temperature": return "thermometer";
      case "light": return "sunny";
      default: return "water";
    }
  };

  const getMetricColor = (metric: string) => {
    switch (metric) {
      case "moisture": return "#3b82f6";
      case "temperature": return "#ef4444";
      case "light": return "#eab308";
      default: return "#3b82f6";
    }
  };

  // Helper to render image or SVG component safely
  const renderPlantImage = () => {
    const image = plant?.image || plantImages.instructionSampleImage;
    if (!image) return <View style={styles.plantImagePlaceholder} />;

    if (typeof image === "string") {
      return <Image source={{ uri: image }} style={styles.plantImage} resizeMode="cover" />;
    } else if (typeof image === "number") {
      return <Image source={image} style={styles.plantImage} resizeMode="cover" />;
    } else {
      const SVGComponent = image;
      return (
        <View style={{ width: '100%', height: '100%', justifyContent: 'center', alignItems: 'center', padding: wp(2) }}>
          <SVGComponent width="100%" height="100%" preserveAspectRatio="xMidYMid meet" />
        </View>
      );
    }
  };

  const renderIconOrImage = (item: any, size: number = 24) => {
    if (item.image) {
      const SVGComp = item.image;
      return (
        <View style={{ width: size, height: size, justifyContent: 'center', alignItems: 'center' }}>
          <SVGComp width="100%" height="100%" preserveAspectRatio="xMidYMid meet" />
        </View>
      );
    }
    return <Ionicons name={item.icon as any} size={size} color={item.iconColor} />;
  };

  if (loading && !plant) {
    return (
      <View style={[styles.screenContainer, { justifyContent: "center", alignItems: "center" }]}>
        <ActivityIndicator size="large" color={PRIMARY_GREEN} />
      </View>
    );
  }

  const isOnline = sensorData?.isOnline || false;

  const statusCards = [
    { id: "humidity", icon: "water", iconColor: "#3B82F6", value: isOnline ? `${Math.round(sensorData?.moisture || 0)}%` : "--", bgColor: "#F0FDF4" },
    { id: "temp", icon: "thermometer", iconColor: "#EF4444", value: isOnline ? `${Math.round(sensorData?.temperature || 0)}°C` : "--", bgColor: "#F0FDF4" },
    { id: "dli", icon: "sunny", iconColor: "#F59E0B", value: isOnline ? `${Math.round(sensorData?.light || 0)} DLI` : "--", bgColor: "#F0FDF4" },
    { id: "watering", image: infoImages.info1, bgColor: "#F0FDF4", label: "Every", sublabel: plant?.wateringFrequency ? `${plant.wateringFrequency} days` : "7 days" },
    { id: "light", image: infoImages.info2, bgColor: "#F0FDF4", label: plant?.lightRequirement || "Indirect", sublabel: "light" },
    { id: "range", image: infoImages.info3, value: plant?.temperatureRange || "18-27°C", bgColor: "#F0FDF4" },
  ];

  return (
    <LinearGradient
      colors={["#ECF1E7", "#E8ECE5"]}
      start={{ x: 0, y: 0 }}
      end={{ x: 0, y: 1 }}
      style={styles.screenContainer}
    >
      <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent />
      
      {/* Dynamic Header spacing logic for plant info */}
      <View style={[styles.header, { 
        paddingTop: Platform.OS === 'ios' ? insets.top : (StatusBar.currentHeight || 0) + 10 
      }]}>
        <TouchableOpacity style={styles.backButton} onPress={handleBackPress}>
          <Ionicons name="chevron-back" size={20} color="#6B7280" />
        </TouchableOpacity>
        <Text weight="semibold" style={styles.headerTitle}>Plant Info</Text>
        <View style={styles.headerRight}>
          <TouchableOpacity
            style={styles.shareButton}
            onPress={handleSharePress}
          >
            {uiIcons.shareIcon ? (
              <uiIcons.shareIcon width={22} height={22} />
            ) : (
              <Ionicons name="share-social-outline" size={22} color="#6B7280" />
            )}
          </TouchableOpacity>

          {shareDropdownOpen && (
            <View style={[styles.shareDropdownMenu, { top: (Platform.OS === 'ios' ? insets.top : (StatusBar.currentHeight || 0)) + 50 }]}>
              <TouchableOpacity style={styles.shareDropdownItem} onPress={() => setShareDropdownOpen(false)}>
                <Text weight="medium" style={styles.shareDropdownItemText}>Set Reminder</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.shareDropdownItem} onPress={() => { setShareDropdownOpen(false); handleDeletePlant(); }}>
                <Text weight="medium" style={[styles.shareDropdownItemText, { color: "#EF4444" }]}>Delete Plant</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.shareDropdownItem, { borderBottomWidth: 0 }]} onPress={() => { setShareDropdownOpen(false); handleSharePlant(); }}>
                <Text weight="medium" style={styles.shareDropdownItemText}>Share Plant</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </View>

      <ScrollView
        style={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: activeTab === "todo" ? 140 + insets.bottom : 40 + insets.bottom }
        ]}
      >
        {/* Top image */}
        <View style={styles.content}>
          <View style={styles.imageContainer}>
            {renderPlantImage()}
          </View>
        </View>

        {/* Bottom Sheet */}
        <View style={styles.bottomSheet}>
          <Text variant="h2" weight="semibold" style={styles.plantName}>{plant?.plantName || "Plant"}</Text>
          <Text variant="bodySmall" style={styles.botanicalName}>{plant?.scientificName || "Scientific Name"}</Text>

          {/* Status cards */}
          <View style={styles.statusGrid}>
            {statusCards.map((card: any) => (
              <View key={card.id} style={styles.statusCard}>
                <View style={[styles.statusIconCircle, { backgroundColor: card.bgColor }]}>
                  {renderIconOrImage(card, 22)}
                </View>
                <View style={styles.statusTextContainer}>
                  {card.label && card.sublabel ? (
                    <>
                      <Text variant="caption" weight="bold" style={styles.statusValueTop}>{card.label}</Text>
                      <Text variant="caption" weight="bold" style={styles.statusValueBottom}>{card.sublabel}</Text>
                    </>
                  ) : (
                    <Text variant="caption" weight="bold" style={styles.statusValue}>{card.value}</Text>
                  )}
                </View>
              </View>
            ))}
          </View>

          {/* Segmented control */}
          <View style={styles.segmentContainer}>
            <TouchableOpacity
              style={[styles.segmentItem, activeTab === "todo" && styles.segmentItemActive]}
              onPress={() => setActiveTab("todo")}
            >
              <Text weight="semibold" style={[styles.segmentText, activeTab === "todo" && styles.segmentTextActive]}>Todo</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.segmentItem, activeTab === "care" && styles.segmentItemActive]}
              onPress={() => setActiveTab("care")}
            >
              <Text weight="semibold" style={[styles.segmentText, activeTab === "care" && styles.segmentTextActive]}>Care Info</Text>
            </TouchableOpacity>
          </View>

          {/* Todo Content */}
          {activeTab === "todo" && (
            <View style={styles.todoContainer}>
              <View style={styles.sectionHeaderRow}>
                <Text variant="h3" weight="bold" style={styles.mainSectionTitle}>Todo</Text>
              </View>

              <TouchableOpacity style={styles.sectionCard} onPress={handleTodoPress}>
                <Text weight="bold" style={styles.sectionTitle}>Today</Text>
                <View style={styles.todoItem}>
                  <View style={styles.todoIconContainer}>{renderIconOrImage({ image: infoImages.info1 }, 28)}</View>
                  <View style={styles.todoTextContainer}><Text weight="bold" style={styles.todoText}>Water</Text></View>
                  <TouchableOpacity style={[styles.checkboxContainer, selectedTodos.includes("water") && styles.checkboxChecked]} onPress={() => toggleTodo("water")}>
                    {selectedTodos.includes("water") && <Ionicons name="checkmark" size={16} color="#fff" />}
                  </TouchableOpacity>
                </View>
                <View style={styles.todoItem}>
                  <View style={styles.todoIconContainer}>{renderIconOrImage({ image: infoImages.info2 }, 28)}</View>
                  <View style={styles.todoTextContainer}>
                    <Text weight="bold" style={styles.todoText}>Misted</Text>
                    <View style={[styles.statusBadge, { borderRadius: 999 }]}><Text weight="bold" style={styles.statusBadgeText}>1d late</Text></View>
                  </View>
                  <TouchableOpacity style={[styles.checkboxContainer, selectedTodos.includes("misted") && styles.checkboxChecked]} onPress={() => toggleTodo("misted")}>
                    {selectedTodos.includes("misted") && <Ionicons name="checkmark" size={16} color="#fff" />}
                  </TouchableOpacity>
                </View>
              </TouchableOpacity>

              <TouchableOpacity style={styles.sectionCard} onPress={handleTodoPress}>
                <Text weight="bold" style={styles.sectionTitle}>Upcoming</Text>
                <View style={styles.todoItem}>
                  <View style={styles.todoIconContainer}>{renderIconOrImage({ image: infoImages.info1 }, 28)}</View>
                  <View style={styles.upcomingTimeContainer}>
                    <Text weight="bold" style={styles.todoText}>Water</Text>
                    <Text variant="caption" weight="medium" style={styles.upcomingTime}>in 5 days</Text>
                  </View>
                  <TouchableOpacity style={[styles.checkboxContainer, selectedTodos.includes("upcomingWater") && styles.checkboxChecked]} onPress={() => toggleTodo("upcomingWater")}>
                    {selectedTodos.includes("upcomingWater") && <Ionicons name="checkmark" size={16} color="#fff" />}
                  </TouchableOpacity>
                </View>
              </TouchableOpacity>

              <View style={styles.healthStatusSection}>
                <Text weight="bold" style={[styles.sectionTitle, { color: "#000000", marginBottom: 12 }]}>Health Status</Text>
                <HealthStatus
                  status={healthStatus}
                  isOnline={isOnline}
                  lastWatered={plant?.lastWatered ? new Date(plant.lastWatered).toLocaleDateString() : "2 days ago"}
                />
              </View>

              {isOnline && (
                <View style={styles.graphsSection}>
                  <View style={styles.graphsHeader}>
                    <Text weight="bold" style={[styles.sectionTitle, { color: "#000000" }]}>Graphs</Text>
                    <View>
                      <TouchableOpacity style={styles.dropdownButton} onPress={() => setDropdownOpen(!dropdownOpen)}>
                        <View style={styles.dropdownIconContainer}>
                          <Ionicons name={getMetricIcon(selectedMetric) as any} size={12} color={getMetricColor(selectedMetric)} />
                        </View>
                        <Ionicons name="chevron-down" size={10} color="#6B7280" />
                      </TouchableOpacity>
                      {dropdownOpen && (
                        <View style={styles.dropdownMenu}>
                          {[{ id: "moisture", label: "Soil Moisture", icon: "water", color: "#3b82f6" }, { id: "temperature", label: "Temperature", icon: "thermometer", color: "#ef4444" }, { id: "light", label: "Light", icon: "sunny", color: "#eab308" }].map((metric, index) => (
                            <TouchableOpacity key={metric.id} style={[styles.dropdownItem, index === 2 && { borderBottomWidth: 0 }]} onPress={() => { setSelectedMetric(metric.id); setDropdownOpen(false); }}>
                              <View style={styles.dropdownItemIconContainer}><Ionicons name={metric.icon as any} size={16} color={metric.color} /></View>
                              <Text variant="bodySmall" weight="medium" style={styles.dropdownItemText}>{metric.label}</Text>
                            </TouchableOpacity>
                          ))}
                        </View>
                      )}
                    </View>
                  </View>

                  <View style={styles.timePeriodContainer}>
                    {["Day", "Week", "Month"].map((period) => (
                      <TouchableOpacity key={period} style={[styles.timePeriodButton, selectedTimePeriod !== period && styles.timePeriodInactive]} onPress={() => setSelectedTimePeriod(period)}>
                        <Text weight="semibold" style={[styles.timePeriodText, selectedTimePeriod !== period && styles.timePeriodTextInactive]}>{period}</Text>
                      </TouchableOpacity>
                    ))}
                  </View>

                  <View style={styles.waterContentCard}>
                    <View style={styles.waterContentHeader}>
                      <View>
                        <Text variant="caption" style={styles.waterContentLabel}>{selectedMetric === "moisture" ? "Volumetric Water Content :" : selectedMetric === "temperature" ? "Ambient :" : "Amount (DLI) :"}</Text>
                        <Text weight="bold" style={styles.waterContentValue}>
                          {selectedMetric === "moisture" ? "45%" : selectedMetric === "temperature" ? "22°C" : "12.5 mol"}
                        </Text>
                        <Text variant="caption" style={styles.waterContentRange}>Range</Text>
                      </View>
                      <View style={styles.dateBadge}><Text variant="caption" weight="medium" style={styles.dateBadgeText}>{new Date().toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })}</Text></View>
                    </View>
                    <SimpleGraph selectedMetric={selectedMetric} selectedPeriod={selectedTimePeriod} plantId={Array.isArray(plantId) ? plantId[0] : plantId} />
                  </View>
                </View>
              )}

              {!isOnline && (
                <View style={styles.graphsSection}>
                  <View style={styles.graphsHeader}>
                    <Text weight="bold" style={[styles.sectionTitle, { color: "#000000" }]}>Graphs</Text>
                    <TouchableOpacity style={styles.addSensorButton} onPress={() => router.push("/devices/connectdevice")}>
                      <Text weight="medium" style={styles.addSensorButtonText}>Add Sensor</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              )}
            </View>
          )}

          {/* Care Content */}
          {activeTab === "care" && (
            <View style={styles.innerContainer}>
              <View style={styles.careInfoBox}>
                <View style={styles.infoCard}>
                  <View style={styles.infoHeaderRow}><Text weight="bold" style={styles.infoTitle}>Plant Introduction</Text></View>
                  <Text variant="bodySmall" weight="medium" style={styles.infoDescription}>{plant?.description || "The Fiddle Leaf Fig is a stunning tree with large, glossy leaves. Native to West Africa, it's popular for indoor spaces."}</Text>
                </View>
                <View style={styles.infoCard}>
                  <View style={styles.infoHeaderRow}><Text weight="bold" style={styles.infoTitle}>Recommended Soil</Text></View>
                  <Text variant="bodySmall" weight="medium" style={styles.infoDescription}>{plant?.soilType || "Use a well-draining mix of potting soil, perlite, and orchid bark. Ensure proper drainage to prevent root rot."}</Text>
                </View>
                <View style={styles.careGrid}>
                  {[
                    { icon: "sunny-outline", text: "Bright Indirect" },
                    { icon: "water-outline", text: "Moderate Water" },
                    { icon: "thermometer-outline", text: "40-60% Humidity" },
                    { icon: "thermometer-outline", text: "18-27°C Range" }
                  ].map((item, index) => (
                    <View key={index} style={styles.careGridItem}>
                      <Ionicons name={item.icon as any} size={18} color="#2d5a3d" />
                      <Text weight="bold" style={styles.careGridText}>{item.text}</Text>
                    </View>
                  ))}
                </View>
              </View>
            </View>
          )}
        </View>
      </ScrollView>

      {/* Sticky Bottom Actions with Safe Area Insets */}
      {activeTab === "todo" && (
        <View style={[styles.bottomNavContainer, { paddingBottom: Math.max(insets.bottom, 15) }]}>
          <View style={styles.bottomButtonsRow}>
            <Button title="Set Reminder" variant="outline" style={styles.bottomBtn} />
            <Button title="Take Photo" variant="outline" onPress={handleTakePhoto} style={styles.bottomBtn} />
          </View>
        </View>
      )}
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  screenContainer: { flex: 1 },
  scrollContainer: { flex: 1 },
  scrollContent: { },
  header: { 
    flexDirection: "row", 
    justifyContent: "space-between", 
    alignItems: "center", 
    paddingHorizontal: 16, 
    paddingBottom: 12, 
    zIndex: 100, 
    backgroundColor: 'transparent' 
  },
  backButton: { width: 40, height: 40, borderRadius: 20, backgroundColor: "#FFFFFF", justifyContent: "center", alignItems: "center", elevation: 2 },
  headerTitle: { fontSize: 16, color: "#111827" },
  headerRight: { flexDirection: "row", alignItems: "center", gap: 8 },
  shareButton: { width: 40, height: 40, borderRadius: 20, backgroundColor: "#FFFFFF", justifyContent: "center", alignItems: "center", elevation: 2 },
  shareDropdownMenu: { position: "absolute", right: 16, backgroundColor: "#fff", borderRadius: 12, padding: 8, minWidth: 160, elevation: 10, zIndex: 2000, shadowColor: "#000", shadowOpacity: 0.1, shadowRadius: 10 },
  shareDropdownItem: { paddingVertical: 12, paddingHorizontal: 12, borderBottomWidth: 1, borderBottomColor: "#F3F4F6" },
  shareDropdownItemText: { fontSize: 14, color: "#374151" },
  content: { paddingHorizontal: 18, paddingTop: 4, alignItems: "center" },
  imageContainer: { 
    width: SCREEN_WIDTH - 36, 
    height: SCREEN_WIDTH * 0.55, 
    borderRadius: 20, 
    overflow: "hidden", 
    backgroundColor: "#E5E7EB", 
    zIndex: 10, 
    elevation: 5,
    justifyContent: "center",
    alignItems: "center",
  },
  plantImage: { width: "100%", height: "100%" },
  plantImagePlaceholder: { width: "100%", height: "100%", backgroundColor: "#CBD5E1" },
  bottomSheet: { backgroundColor: "#F8FAFC", borderTopLeftRadius: 24, borderTopRightRadius: 24, paddingHorizontal: 16, paddingTop: 40, marginTop: -20, paddingBottom: 24, elevation: 8, shadowColor: "#000", shadowOpacity: 0.05, shadowRadius: 10 },
  plantName: { textAlign: "center", marginBottom: 2, fontSize: 22 },
  botanicalName: { color: "#9CA3AF", textAlign: "center", marginBottom: 20 },
  statusGrid: { flexDirection: "row", flexWrap: "wrap", justifyContent: "space-between", marginBottom: 20 },
  statusCard: { width: "31%", backgroundColor: "#FFFFFF", borderRadius: 12, paddingVertical: 12, paddingHorizontal: 8, marginBottom: 10, flexDirection: "row", alignItems: "center", elevation: 1 },
  statusIconCircle: { width: 34, height: 34, borderRadius: 8, justifyContent: "center", alignItems: "center", marginRight: 8 },
  statusTextContainer: { flex: 1 },
  statusValue: { color: "#000000", fontSize: 13 },
  statusValueTop: { color: "#000000", lineHeight: 14, fontSize: 11 },
  statusValueBottom: { color: "#000000", lineHeight: 14, fontSize: 11 },
  segmentContainer: { flexDirection: "row", marginBottom: 16, alignSelf: "flex-start", gap: 10 },
  segmentItem: { 
    height: hp(4.2),
    paddingHorizontal: wp(5),
    borderRadius: 999,
    borderWidth: 1,
    borderColor: "#4a5f4a",
    backgroundColor: "transparent",
    alignItems: "center",
    justifyContent: "center",
  },
  segmentItemActive: { 
    backgroundColor: "#3d5943", 
    borderColor: "#3d5943" 
  },
  segmentText: { 
    fontSize: rf(1.6), 
    color: "#4a5f4a",
    includeFontPadding: false,
    textAlignVertical: 'center',
  },
  segmentTextActive: { 
    color: "white" 
  },
  todoContainer: { marginTop: 4 },
  sectionHeaderRow: { marginBottom: 14 },
  mainSectionTitle: { color: "#000000", fontSize: 18 },
  sectionCard: { backgroundColor: "#fff", borderRadius: 12, padding: 14, marginBottom: 16, elevation: 1 },
  sectionTitle: { fontSize: 15, color: "#5B9C71", marginBottom: 12 },
  todoItem: { flexDirection: "row", alignItems: "center", paddingVertical: 8, marginBottom: 4 },
  todoIconContainer: { width: 52, height: 52, borderRadius: 12, backgroundColor: "#EFF3EA", justifyContent: "center", alignItems: "center", marginRight: 14 },
  todoTextContainer: { flex: 1, flexDirection: "row", alignItems: "center", gap: 6 },
  upcomingTimeContainer: { flex: 1, justifyContent: "center" },
  todoText: { fontSize: 15, color: "#2d5a3d" },
  statusBadge: { backgroundColor: "#FF9A9C", paddingHorizontal: 8, paddingVertical: 2, borderRadius: 10 },
  statusBadgeText: { fontSize: 10, color: "#AC0000" },
  upcomingTime: { color: "#9CA3AF", fontSize: 12, marginTop: 2 },
  checkboxContainer: { width: 22, height: 22, borderRadius: 11, borderWidth: 1.5, borderColor: "#D1D5DB", alignItems: "center", justifyContent: "center", backgroundColor: "#fff" },
  checkboxChecked: { backgroundColor: "#4AA88B", borderColor: "#4AA88B" },
  healthStatusSection: { marginBottom: 24 },
  graphsSection: { marginBottom: 20 },
  graphsHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 12 },
  dropdownButton: { flexDirection: "row", alignItems: "center", gap: 4, paddingHorizontal: 8, paddingVertical: 4, borderRadius: 16, borderWidth: 1, borderColor: "#D1D5DB", backgroundColor: "#F3F4F6" },
  dropdownIconContainer: { width: 18, height: 18, borderRadius: 9, alignItems: "center", justifyContent: "center" },
  dropdownMenu: { position: "absolute", top: 35, right: 0, backgroundColor: "#fff", borderRadius: 12, padding: 6, minWidth: 160, elevation: 10, zIndex: 1000 },
  dropdownItem: { flexDirection: "row", alignItems: "center", gap: 8, padding: 8, borderBottomWidth: 1, borderBottomColor: "#F3F4F6" },
  dropdownItemIconContainer: { width: 22, height: 22, alignItems: "center", justifyContent: "center" },
  dropdownItemText: { fontSize: 13, color: "#374151" },
  timePeriodContainer: { flexDirection: "row", marginBottom: 16, backgroundColor: "#E8F5EF", borderRadius: 25, padding: 3 },
  timePeriodButton: { flex: 1, paddingVertical: 8, borderRadius: 20, backgroundColor: "#4AA88B", alignItems: "center" },
  timePeriodInactive: { backgroundColor: "transparent" },
  timePeriodText: { fontSize: 13, color: "#fff" },
  timePeriodTextInactive: { color: "#9CA3AF" },
  waterContentCard: { backgroundColor: "#fff", borderRadius: 12, padding: 14, elevation: 1 },
  waterContentHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start", width: "100%", marginBottom: 12 },
  dateBadge: { backgroundColor: "#F3F4F6", paddingHorizontal: 10, paddingVertical: 4, borderRadius: 10 },
  dateBadgeText: { fontSize: 11, color: "#3E5842" },
  waterContentLabel: { fontSize: 12, color: "#6B7280" },
  waterContentValue: { fontSize: 22, marginVertical: 2 },
  waterContentRange: { fontSize: 11, color: "#9CA3AF" },
  addSensorButton: { paddingHorizontal: 10, paddingVertical: 5, borderRadius: 14, backgroundColor: "#D2D2D2" },
  addSensorButtonText: { fontSize: 11, color: "#6B7280" },
  innerContainer: { paddingBottom: 10 },
  careInfoBox: { backgroundColor: "#E8F5EF", borderRadius: 16, padding: 16, marginTop: 4 },
  infoCard: { backgroundColor: "#fff", borderRadius: 12, padding: 14, marginBottom: 12, elevation: 1 },
  infoHeaderRow: { flexDirection: "row", alignItems: "center", marginBottom: 6 },
  infoTitle: { fontSize: 16, color: "#2d5a3d" },
  infoDescription: { fontSize: 13, color: "#6B7280", lineHeight: 18 },
  careGrid: { flexDirection: "row", flexWrap: "wrap", justifyContent: "space-between" },
  careGridItem: { width: "48%", backgroundColor: "#B8E6D5", borderRadius: 20, padding: 10, marginBottom: 8, flexDirection: "row", alignItems: "center" },
  careGridText: { fontSize: 11, color: "#2d5a3d", marginLeft: 8, flex: 1 },
  bottomNavContainer: { position: "absolute", bottom: 0, left: 0, right: 0, backgroundColor: "#FFFFFF", paddingTop: 12, paddingHorizontal: 16, borderTopLeftRadius: 20, borderTopRightRadius: 20, elevation: 15, shadowColor: "#000", shadowOffset: { width: 0, height: -3 }, shadowOpacity: 0.1, shadowRadius: 5 },
  bottomButtonsRow: { flexDirection: "row", justifyContent: "space-between", gap: 12 },
  bottomBtn: { flex: 1 },
  hoverEffect: { shadowColor: "#4AA88B", shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8 },
});
