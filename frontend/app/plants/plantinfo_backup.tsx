/**
 * Plant Information Screen
 * UI matching the reference design exactly with Real-time Graph
 */
import {
  View,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Dimensions,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import RealTimeGraph from "../../components/RealTimeGraph";
import Text from "../../components/ui/Text";
import Button from "../../components/ui/Button";

import React from "react";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import {
  plantInfoData,
  plantInfoStatusCards,
  infoImages,
  uiIcons,
  plantImages,
} from "../../assets/images";

// MAIN COLORS
const PRIMARY_GREEN = "#4AA88B";
const LIGHT_GREEN_BG = "#E5F6EF";
const PAGE_BG = "#ECF1E7";

export default function PlantInfoScreen() {
  const [activeTab, setActiveTab] = React.useState("todo");
  const [selectedTodos, setSelectedTodos] = React.useState<string[]>([]);
  const [selectedButton, setSelectedButton] = React.useState<string | null>(
    null
  );
  const [selectedTimePeriod, setSelectedTimePeriod] = React.useState("Day");
  const [isOnline, setIsOnline] = React.useState(false); // Toggle for online/offline mode
  const [healthStatus, setHealthStatus] = React.useState("healthy"); // "healthy" or "unhealthy"

  const toggleTodo = (todoId: string) => {
    setSelectedTodos((prev: string[]) =>
      prev.includes(todoId)
        ? prev.filter((id: string) => id !== todoId)
        : [...prev, todoId]
    );
  };

  // Use data from assets/index.ts
  const plantData = plantInfoData;
  const statusCards = plantInfoStatusCards;

  const handleBackPress = () => {
    router.back();
  };

  const handleSharePress = () => {
    console.log("Share plant info");
  };

  return (
    <LinearGradient
      colors={["#ECF1E7", "#E8ECE5"]}
      start={{ x: 0, y: 0 }}
      end={{ x: 0, y: 1 }}
      style={styles.safeArea}
    >
      <ScrollView
        style={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={handleBackPress}>
            <Ionicons name="chevron-back" size={20} color="#6B7280" />
          </TouchableOpacity>
          <Text weight="semibold" style={styles.headerTitle}>Plant Info</Text>
          <View style={styles.headerRight}>
            <TouchableOpacity
              style={[
                styles.modeToggle,
                { backgroundColor: isOnline ? "#4AA88B" : "#EF4444" },
              ]}
              onPress={() => setIsOnline(!isOnline)}
            >
              <Text weight="semibold" style={styles.modeToggleText}>
                {isOnline ? "Online" : "Offline"}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.shareButton}
              onPress={handleSharePress}
            >
              {(() => {
                const Share = uiIcons.shareIcon;
                return <Share width={24} height={24} />;
              })()}
            </TouchableOpacity>
          </View>
        </View>

        {/* Top image */}
        <View style={styles.content}>
          <View style={styles.imageContainer}>
            {(() => {
              const Img = plantImages.instructionSampleImage;
              return <Img width={220} height={220} />;
            })()}
          </View>
        </View>

        {/* Bottom Sheet */}
        <View style={styles.bottomSheet}>
          {/* Name & subtitle */}
          <Text variant="h2" weight="semibold" style={styles.plantName}>{plantData.name}</Text>
          <Text variant="bodySmall" style={styles.botanicalName}>{plantData.botanicalName}</Text>

          {/* Status cards */}
          <View style={styles.statusGrid}>
            {statusCards.map((card: any) => {
              return (
                <View key={card.id} style={styles.statusCard}>
                  <View
                    style={[
                      styles.statusIconCircle,
                      { backgroundColor: card.bgColor },
                    ]}
                  >
                    {card.image ? (
                      (() => {
                        const Icon = card.image;
                        return <Icon width={20} height={20} />;
                      })()
                    ) : (
                      <Ionicons
                        name={card.icon as any}
                        size={18}
                        color={card.iconColor}
                      />
                    )}
                  </View>
                  <View style={styles.statusTextContainer}>
                    {card.label && card.sublabel ? (
                      <>
                        <Text variant="caption" style={styles.statusValueTop}>{card.label}</Text>
                        <Text variant="caption" style={styles.statusValueBottom}>
                          {card.sublabel}
                        </Text>
                      </>
                    ) : (
                      <Text variant="caption" style={styles.statusValue}>
                        {isOnline ? card.value : "--"}
                      </Text>
                    )}
                  </View>
                </View>
              );
            })}
          </View>

          {/* Segmented control */}
          <View style={styles.segmentContainer}>
            <TouchableOpacity
              style={[
                styles.segmentItem,
                activeTab === "todo" && styles.segmentItemActive,
              ]}
              onPress={() => setActiveTab("todo")}
            >
              <Text
                weight="semibold"
                style={[
                  styles.segmentText,
                  activeTab === "todo" && styles.segmentTextActive,
                ]}
              >
                Todo
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.segmentItem,
                activeTab === "care" && styles.segmentItemActive,
              ]}
              onPress={() => setActiveTab("care")}
            >
              <Text
                weight="semibold"
                style={[
                  styles.segmentText,
                  activeTab === "care" && styles.segmentTextActive,
                ]}
              >
                Care Info
              </Text>
            </TouchableOpacity>
          </View>

          {/* Todo Content */}
          {activeTab === "todo" && (
            <View style={styles.todoContainer}>
              <Text weight="semibold" style={styles.mainSectionTitle}>Todo</Text>

              {/* Today Card */}
              <View style={styles.sectionCard}>
                <Text weight="semibold" style={styles.sectionTitle}>Today</Text>

                <View style={styles.todoItem}>
                  <View style={styles.todoIconContainer}>
                    {(() => {
                      const Icon = infoImages.info1;
                      return <Icon width={24} height={24} />;
                    })()}
                  </View>
                  <View style={styles.todoTextContainer}>
                    <Text variant="bodySmall" style={styles.todoText}>Water</Text>
                  </View>
                  <TouchableOpacity
                    style={[
                      styles.checkboxContainer,
                      selectedTodos.includes("water") && styles.checkboxChecked,
                    ]}
                    onPress={() => toggleTodo("water")}
                  >
                    {selectedTodos.includes("water") && (
                      <Ionicons name="checkmark" size={16} color="#fff" />
                    )}
                  </TouchableOpacity>
                </View>

                <View style={styles.todoItem}>
                  <View style={styles.todoIconContainer}>
                    {(() => {
                      const Icon = infoImages.info2;
                      return <Icon width={24} height={24} />;
                    })()}
                  </View>
                  <View style={styles.todoTextContainer}>
                    <Text variant="bodySmall" style={styles.todoText}>Misted</Text>
                    <View style={styles.statusBadge}>
                      <Text weight="semibold" style={styles.statusBadgeText}>1d late</Text>
                    </View>
                  </View>
                  <TouchableOpacity
                    style={[
                      styles.checkboxContainer,
                      selectedTodos.includes("misted") &&
                        styles.checkboxChecked,
                    ]}
                    onPress={() => toggleTodo("misted")}
                  >
                    {selectedTodos.includes("misted") && (
                      <Ionicons name="checkmark" size={16} color="#fff" />
                    )}
                  </TouchableOpacity>
                </View>
              </View>

              {/* Upcoming Card */}
              <View style={styles.sectionCard}>
                <Text weight="semibold" style={styles.sectionTitle}>Upcoming</Text>

                <View style={styles.todoItem}>
                  <View style={styles.todoIconContainer}>
                    {(() => {
                      const Icon = infoImages.info1;
                      return <Icon width={24} height={24} />;
                    })()}
                  </View>
                  <View style={styles.upcomingTextContainer}>
                    <Text variant="bodySmall" style={styles.todoText}>Water</Text>
                    <Text variant="caption" style={styles.upcomingTime}>in 5 days</Text>
                  </View>
                  <TouchableOpacity
                    style={[
                      styles.checkboxContainer,
                      selectedTodos.includes("upcomingWater") &&
                        styles.checkboxChecked,
                    ]}
                    onPress={() => toggleTodo("upcomingWater")}
                  >
                    {selectedTodos.includes("upcomingWater") && (
                      <Ionicons name="checkmark" size={16} color="#fff" />
                    )}
                  </TouchableOpacity>
                </View>

                <View style={styles.todoItem}>
                  <View style={styles.todoIconContainer}>
                    {(() => {
                      const Icon = infoImages.info2;
                      return <Icon width={24} height={24} />;
                    })()}
                  </View>
                  <View style={styles.upcomingTextContainer}>
                    <Text variant="bodySmall" style={styles.todoText}>Misted</Text>
                    <Text variant="caption" style={styles.upcomingTime}>in 3 days</Text>
                  </View>
                  <TouchableOpacity
                    style={[
                      styles.checkboxContainer,
                      selectedTodos.includes("upcomingMisted") &&
                        styles.checkboxChecked,
                    ]}
                    onPress={() => toggleTodo("upcomingMisted")}
                  >
                    {selectedTodos.includes("upcomingMisted") && (
                      <Ionicons name="checkmark" size={16} color="#fff" />
                    )}
                  </TouchableOpacity>
                </View>
              </View>

              {/* Health Status Section */}
              <View style={styles.healthStatusSection}>
                <Text weight="semibold" style={[styles.sectionTitle, { color: "#000000" }]}>
                  Health Status
                </Text>

                <View style={styles.healthCard}>
                  <Text variant="caption" style={styles.healthLabel}>Current Status :</Text>
                  <View style={styles.healthContentRow}>
                    <View style={styles.healthLeftContent}>
                      <View style={styles.healthStatusRow}>
                        <View
                          style={[
                            styles.healthIndicator,
                            {
                              backgroundColor: isOnline
                                ? healthStatus === "healthy"
                                  ? "#4AA88B"
                                  : "#EF4444"
                                : "#9CA3AF",
                            },
                          ]}
                        >
                          <Ionicons
                            name={
                              isOnline
                                ? healthStatus === "healthy"
                                  ? "checkmark"
                                  : "close"
                                : "help"
                            }
                            size={14}
                            color="#fff"
                          />
                        </View>
                        <Text weight="semibold" style={styles.healthStatusText}>
                          {isOnline
                            ? healthStatus === "healthy"
                              ? "Healthy"
                              : "Unhealthy"
                            : "--"}
                        </Text>
                      </View>
                      <Text variant="caption" style={styles.healthSubtext}>
                        Last watered : {isOnline ? "2 days ago" : "--"}
                      </Text>
                    </View>
                    <View style={styles.healthRightContent}>
                      {isOnline && <RealTimeGraph />}
                    </View>
                  </View>
                </View>
              </View>

              {/* Graphs Section */}
              {isOnline && (
                <View style={styles.graphsSection}>
                  <View style={styles.graphsHeader}>
                    <Text weight="semibold" style={[styles.sectionTitle, { color: "#000000" }]}>
                      Graphs
                    </Text>
                    <TouchableOpacity
                      style={[
                        styles.connectedButton,
                        { backgroundColor: "#E4EDE1", borderWidth: 0 },
                      ]}
                    >
                      <Text
                        variant="caption"
                        style={[
                          styles.connectedButtonText,
                        ]}
                      >
                        Connected
                      </Text>
                    </TouchableOpacity>
                  </View>

                  {/* Time Period Selector */}
                  <View style={styles.timePeriodContainer}>
                    {["Day", "Week", "Month"].map((period) => (
                      <TouchableOpacity
                        key={period}
                        style={[
                          styles.timePeriodButton,
                          selectedTimePeriod !== period &&
                            styles.timePeriodInactive,
                        ]}
                        onPress={() => setSelectedTimePeriod(period)}
                      >
                        <Text
                          variant="caption"
                          style={[
                            styles.timePeriodText,
                            selectedTimePeriod !== period &&
                              styles.timePeriodTextInactive,
                          ]}
                        >
                          {period}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>

                  {/* Water Content Card */}
                  <View style={styles.waterContentCard}>
                    <Text variant="caption" style={styles.waterContentLabel}>
                      Volumetric Water Content :
                    </Text>
                    <Text weight="semibold" style={styles.waterContentValue}>
                      13-64%
                    </Text>
                    <Text variant="caption" style={styles.waterContentRange}>Range</Text>
                    <RealTimeGraph />
                  </View>
                </View>
              )}

              {/* Add Sensor Section for Offline Mode */}
              {!isOnline && (
                <View style={styles.graphsSection}>
                  <View style={styles.graphsHeader}>
                    <Text weight="semibold" style={[styles.sectionTitle, { color: "#000000" }]}>
                      Graphs
                    </Text>
                    <TouchableOpacity
                      style={[
                        styles.connectedButton,
                        { backgroundColor: "#D2D2D2", borderWidth: 0 },
                      ]}
                    >
                      <Text weight="medium" style={styles.connectedButtonText}>Add Sensor</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              )}

              {/* Care Guide Section */}
              <View style={styles.careGuideSection}>
                <Text weight="semibold" style={[styles.sectionTitle, { color: "#000000" }]}>
                  Care Guide
                </Text>
                <ScrollView
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  style={styles.careGuideScrollView}
                >
                  <View style={styles.careGuideCard}>
                    <View style={styles.careGuideIconContainer}>
                      <Text style={styles.careGuideEmoji}>💧</Text>
                    </View>
                    <Text variant="caption" style={styles.careGuideCardText}>
                      Water when top 2 inches of soil are dry. Mist
                      occasionally.
                    </Text>
                  </View>
                  <View style={styles.careGuideCard}>
                    <View style={styles.careGuideIconContainer}>
                      <Text style={styles.careGuideEmoji}>💧</Text>
                    </View>
                    <Text variant="caption" style={styles.careGuideCardText}>
                      Place in bright, indirect light. Avoid direct sun.
                    </Text>
                  </View>
                </ScrollView>
              </View>
            </View>
          )}

          {/* Care Content */}
          {activeTab === "care" && (
            <ScrollView
              style={styles.innerContainer}
              showsVerticalScrollIndicator={false}
            >
              <View
                style={{
                  backgroundColor: "#E8F5EF",
                  borderRadius: 4,
                  padding: 12,
                  marginTop: 16,
                  marginBottom: 12,
                }}
              >
                {/* Plant Introduction Card */}
                <View style={styles.infoCard}>
                  <View style={styles.infoHeaderRow}>
                    <Text style={styles.infoIconEmoji}>🌿</Text>
                    <Text weight="semibold" style={styles.infoTitle}>Plant Introduction</Text>
                  </View>
                  <Text variant="bodySmall" style={styles.infoDescription}>
                    The Fiddle Leaf Fig is a stunning tree with large, glossy
                    leaves that create a tropical atmosphere. Native to West
                    Africa, it's popular for indoor spaces and adds a dramatic
                    touch.
                  </Text>
                </View>

                {/* Recommended Soil Card */}
                <View style={styles.infoCard}>
                  <View style={styles.infoHeaderRow}>
                    <Text style={styles.infoIconEmoji}>🪴</Text>
                    <Text weight="semibold" style={styles.infoTitle}>Recommended Soil</Text>
                  </View>
                  <Text variant="bodySmall" style={styles.infoDescription}>
                    Use a well-draining mix of potting soil, perlite, and orchid
                    bark. Avoid heavy clay soils. Ensure proper drainage to
                    prevent root rot.
                  </Text>
                </View>

                {/* Care Summary Grid */}
                <View style={styles.careGrid}>
                  <View style={styles.careGridItem}>
                    <Ionicons name="sunny-outline" size={20} color="#2d5a3d" />
                    <Text weight="medium" style={styles.careGridText}>
                      Light: Bright Indirect
                    </Text>
                  </View>
                  <View style={styles.careGridItem}>
                    <Ionicons name="water-outline" size={20} color="#2d5a3d" />
                    <Text weight="medium" style={styles.careGridText}>Water: Moderate</Text>
                  </View>
                </View>

                {/* Advanced Card */}
                <View style={styles.advancedCard}>
                  <View style={styles.advancedHeader}>
                    <Ionicons name="paw" size={16} color="#B91C1C" />
                    <View style={styles.advancedPill}>
                      <Text weight="semibold" style={styles.advancedTitle}>Advanced</Text>
                    </View>
                  </View>
                  <Text variant="caption" style={styles.advancedText}>
                    Prefers stable temperatures. Sensitive to cold drafts.
                  </Text>
                </View>
              </View>
            </ScrollView>
          )}
        </View>
      </ScrollView>

      {/* Fixed Bottom Navigation */}
      {activeTab === "todo" && (
        <View style={styles.bottomNavContainer}>
          <View style={styles.bottomButtonsRow}>
            <Button
              title="Set Reminder"
              variant={selectedButton === "reminder" ? "primary" : "outline"}
              onPress={() => setSelectedButton(selectedButton === "reminder" ? null : "reminder")}
              style={styles.bottomBtn}
            />
            <Button
              title="Take Photo"
              variant={selectedButton === "photo" ? "primary" : "outline"}
              onPress={() => setSelectedButton(selectedButton === "photo" ? null : "photo")}
              style={styles.bottomBtn}
            />
          </View>
        </View>
      )}
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, paddingTop: 50 },
  scrollContainer: { flex: 1 },
  scrollContent: { paddingBottom: 100 },
  header: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingHorizontal: 16, paddingTop: 8, paddingBottom: 12, backgroundColor: PAGE_BG },
  backButton: { width: 40, height: 40, borderRadius: 20, backgroundColor: "#FFFFFF", justifyContent: "center", alignItems: "center", elevation: 2 },
  headerTitle: { fontSize: 18, color: "#111827" },
  shareButton: { width: 40, height: 40, borderRadius: 20, backgroundColor: "#FFFFFF", justifyContent: "center", alignItems: "center", elevation: 2 },
  headerRight: { flexDirection: "row", alignItems: "center", gap: 8 },
  modeToggle: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 16 },
  modeToggleText: { fontSize: 12, color: "#FFFFFF" },
  content: { paddingHorizontal: 18, paddingTop: 4, paddingBottom: 0, alignItems: "center" },
  imageContainer: { width: "100%", height: 200, marginBottom: -24, borderRadius: 16, overflow: "hidden", backgroundColor: "#E5E7EB", zIndex: 10, elevation: 5 },
  bottomSheet: { backgroundColor: "#F8FAFC", borderTopLeftRadius: 24, borderTopRightRadius: 24, paddingHorizontal: 20, paddingTop: 50, paddingBottom: 24, elevation: 8 },
  plantName: { textAlign: "center", marginBottom: 2 },
  botanicalName: { color: "#9CA3AF", textAlign: "center", marginBottom: 18 },
  statusGrid: { flexDirection: "row", flexWrap: "wrap", justifyContent: "space-between", marginBottom: 20 },
  statusCard: { width: "31%", backgroundColor: "#FFFFFF", borderRadius: 12, paddingVertical: 10, paddingHorizontal: 8, marginBottom: 10, flexDirection: "row", alignItems: "center", elevation: 2 },
  statusIconCircle: { width: 36, height: 36, borderRadius: 6, justifyContent: "center", alignItems: "center", marginRight: 8 },
  statusTextContainer: { flex: 1, justifyContent: "center" },
  statusValue: { color: "#000000" },
  statusValueTop: { color: "#000000", lineHeight: 16 },
  statusValueBottom: { color: "#000000", lineHeight: 16 },
  segmentContainer: { flexDirection: "row", marginBottom: 20, alignSelf: "flex-start", gap: 12 },
  segmentItem: { paddingVertical: 10, paddingHorizontal: 20, borderRadius: 25, borderColor: "#E5E7EB", borderWidth: 1 },
  segmentItemActive: { backgroundColor: "#2C593A" },
  segmentText: { fontSize: 16, color: "#4C4C4C" },
  segmentTextActive: { color: "white" },
  todoContainer: { marginTop: 16, backgroundColor: "#F8FAFC", minHeight: "100%" },
  mainSectionTitle: { color: "#000000", marginBottom: 6 },
  sectionCard: { backgroundColor: "#fff", borderRadius: 12, padding: 12, marginBottom: 12, elevation: 1 },
  sectionTitle: { color: "#5B9C71", marginBottom: 12 },
  todoItem: { flexDirection: "row", alignItems: "center", paddingVertical: 8, paddingHorizontal: 8, borderRadius: 12, marginBottom: 6 },
  todoIconContainer: { width: 40, height: 40, borderRadius: 10, backgroundColor: "#EFF3EA", justifyContent: "center", alignItems: "center", marginRight: 10 },
  todoTextContainer: { flex: 1, flexDirection: "row", alignItems: "center", gap: 8 },
  upcomingTextContainer: { flex: 1, flexDirection: "column", justifyContent: "center" },
  todoText: { color: "#2d5a3d" },
  statusBadge: { backgroundColor: "#FF9A9C", paddingHorizontal: 10, paddingVertical: 3, borderRadius: 12 },
  statusBadgeText: { fontSize: 11, color: "#AC0000" },
  upcomingTime: { color: "#9CA3AF" },
  checkboxContainer: { width: 24, height: 24, borderRadius: 12, borderWidth: 2, borderColor: "#D1D5DB", alignItems: "center", justifyContent: "center", backgroundColor: "#fff" },
  checkboxChecked: { backgroundColor: "#4AA88B", borderColor: "#4AA88B" },
  healthStatusSection: { marginBottom: 20 },
  healthCard: { backgroundColor: "#fff", borderRadius: 12, paddingVertical: 20, paddingHorizontal: 16, elevation: 1 },
  healthLabel: { color: "#111827", marginBottom: 8 },
  healthStatusRow: { flexDirection: "row", alignItems: "center", marginBottom: 8 },
  healthIndicator: { width: 24, height: 24, borderRadius: 16, backgroundColor: "#4AA88B", marginRight: 12, alignItems: "center", justifyContent: "center" },
  healthContentRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  healthLeftContent: { flex: 1 },
  healthRightContent: { flex: 1, alignItems: "flex-end", justifyContent: "center" },
  healthStatusText: { fontSize: 16, color: "#111827", letterSpacing: -0.5 },
  healthSubtext: { color: "#6B7280", marginTop: 0.2 },
  graphsSection: { marginBottom: 20 },
  graphsHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 12 },
  connectedButton: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 16, borderWidth: 1, borderColor: "#3E4E2F" },
  connectedButtonText: { fontSize: 12, color: "#3E5842" },
  timePeriodContainer: { flexDirection: "row", marginBottom: 16, backgroundColor: "#E8F5EF", borderRadius: 25, padding: 4 },
  timePeriodButton: { flex: 1, paddingVertical: 10, paddingHorizontal: 16, borderRadius: 20, backgroundColor: "#4AA88B", alignItems: "center" },
  timePeriodInactive: { backgroundColor: "transparent" },
  timePeriodText: { color: "#fff" },
  timePeriodTextInactive: { color: "#9CA3AF" },
  waterContentCard: { backgroundColor: "#fff", borderRadius: 12, paddingVertical: 20, paddingHorizontal: 16, elevation: 1 },
  waterContentLabel: { color: "#6B7280", marginBottom: 4 },
  waterContentValue: { fontSize: 24, color: "#000000", marginBottom: 2 },
  waterContentRange: { color: "#9CA3AF", marginBottom: 16 },
  innerContainer: { marginTop: 0, backgroundColor: "#F8FAFC", padding: 2, minHeight: "100%" },
  infoCard: { backgroundColor: "#fff", borderRadius: 12, padding: 16, marginBottom: 12, elevation: 1 },
  infoHeaderRow: { flexDirection: "row", alignItems: "center", marginBottom: 8 },
  infoIconEmoji: { fontSize: 20, marginRight: 8 },
  infoTitle: { fontSize: 18, color: "#2d5a3d" },
  infoDescription: { color: "#6B7280", lineHeight: 20 },
  careGrid: { flexDirection: "row", flexWrap: "wrap", justifyContent: "space-between", marginBottom: 12 },
  careGridItem: { width: "48%", backgroundColor: "#B8E6D5", borderRadius: 28, padding: 12, marginBottom: 8, flexDirection: "row", alignItems: "center", elevation: 1 },
  careGridText: { fontSize: 11, color: "#2d5a3d", marginLeft: 8, flex: 1 },
  advancedCard: { backgroundColor: "#FEF2F2", borderRadius: 12, padding: 16, marginBottom: 12, borderWidth: 1, borderColor: "#FECACA" },
  advancedHeader: { flexDirection: "row", alignItems: "center", marginBottom: 8 },
  advancedPill: { backgroundColor: "#FEE2E2", paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20, marginLeft: 8 },
  advancedTitle: { fontSize: 12, color: "#6B7280" },
  advancedText: { color: "#6B7280", lineHeight: 20 },
  bottomNavContainer: { position: "absolute", bottom: 0, left: 0, right: 0, backgroundColor: "#FFFFFF", paddingTop: 16, paddingBottom: 20, paddingHorizontal: 20, borderTopLeftRadius: 20, borderTopRightRadius: 20, elevation: 10 },
  bottomButtonsRow: { flexDirection: "row", justifyContent: "space-between", gap: 16 },
  bottomBtn: { flex: 1 },
  careGuideSection: { marginTop: 20 },
  careGuideScrollView: { flexDirection: "row" },
  careGuideCard: { backgroundColor: "#fff", borderRadius: 12, padding: 10, marginRight: 12, width: Dimensions.get("window").width * 0.35, elevation: 1 },
  careGuideIconContainer: { width: 28, height: 28, backgroundColor: "#EFF3EA", borderRadius: 6, justifyContent: "center", alignItems: "center", marginBottom: 6 },
  careGuideEmoji: { fontSize: 14 },
  careGuideCardText: { color: "#6B7280", lineHeight: 16 },
});
