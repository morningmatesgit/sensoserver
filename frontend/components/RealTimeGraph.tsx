import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import MoistureChart from "./charts/MoistureChart";
import TemperatureChart from "./charts/TemperatureChart";
import LightChart from "./charts/LightChart";

// TODO: Backend API Integration
// Base URL: http://192.168.1.3:3000/api
// Endpoints:
// - GET /plants/:plantId/sensor-data?type=moisture|temperature|light&period=day|week|month
// - GET /plants/:plantId/info (for plant-specific thresholds and settings)
// - POST /plants/:plantId/watering (to log watering events)

// TODO: Real-time sensor data connection
// WebSocket connection: ws://192.168.1.3:3000/sensor-updates
// MQTT broker integration for IoT sensors
// Data format: { plantId, sensorType, value, timestamp, sensorId }

const { width: SCREEN_WIDTH } = Dimensions.get("window");

// TODO: Replace with real API calls to backend
// Sample data generators - will be replaced with actual sensor data
const generateDayData = (type: string) => {
  // TODO: Replace with API call: fetch(`/api/plants/${plantId}/sensor-data?type=${type}&period=day`)
  const times = ["00:00", "04:00", "08:00", "12:00", "16:00", "20:00"];
  if (type === "moisture") {
    // TODO: Get from capacitive soil moisture sensor readings
    return [
      { time: "00:00", value: 15 },
      { time: "04:00", value: 25 },
      { time: "08:00", value: 65 },
      { time: "12:00", value: 85 },
      { time: "16:00", value: 70 },
      { time: "20:00", value: 45 }
    ];
  } else if (type === "temperature") {
    // TODO: Get from DHT22/DS18B20 temperature sensor readings
    return [
      { time: "00:00", value: 5 },
      { time: "04:00", value: 10 },
      { time: "08:00", value: 3 },
      { time: "12:00", value: 15 },
      { time: "16:00", value: 22 },
      { time: "20:00", value: 18 }
    ];
  } else {
    // TODO: Get from BH1750 light sensor or photoresistor readings
    return times.map((time, i) => {
      let base = 2 + Math.abs(Math.sin(i * 1.5)) * 15;
      if (i === 2 || i === 3) base += 25 + Math.random() * 10;
      if (i === 4) base += 15;
      if (i === 5) base = Math.max(0.5, base - 8);
      return { time, value: Number(base.toFixed(1)) };
    });
  }
};

const generateWeekData = (type: string) => {
  // TODO: Replace with API call: fetch(`/api/plants/${plantId}/sensor-data?type=${type}&period=week`)
  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  if (type === "moisture") {
    return days.map((day, i) => ({ day, value: i === 3 ? 68 : 45 - i * 2 }));
  } else if (type === "temperature") {
    return days.map((day, i) => ({ day, value: 22 + i * 1.2 }));
  } else {
    return days.map((day, i) => ({ day, value: 8 + i * 1.5 }));
  }
};

const generateMonthData = (type: string) => {
  // TODO: Replace with API call: fetch(`/api/plants/${plantId}/sensor-data?type=${type}&period=month`)
  const dates = ["05", "10", "15", "20", "25", "01", "05"];
  if (type === "moisture") {
    return dates.map((date, i) => ({ date, value: 50 - i * 2 }));
  } else if (type === "temperature") {
    return dates.map((date, i) => ({ date, value: 22 + i * 0.8 }));
  } else {
    return dates.map((date, i) => ({ date, value: 0.8 + i * 0.2 }));
  }
};

// Simple Graph Component (for embedding in other screens)
const SimpleGraph = ({ selectedMetric = "moisture", selectedPeriod = "Day", plantId }: { selectedMetric?: string; selectedPeriod?: string; plantId?: string }) => {
  // TODO: Add useEffect to fetch real sensor data based on plantId
  const getData = () => {
    if (selectedPeriod === "Day") return generateDayData(selectedMetric);
    if (selectedPeriod === "Week") return generateWeekData(selectedMetric);
    return generateMonthData(selectedMetric);
  };
  const data = getData();
  
  if (selectedMetric === "moisture") return <MoistureChart data={data} period={selectedPeriod} plantId={plantId} />;
  if (selectedMetric === "temperature") return <TemperatureChart data={data} period={selectedPeriod} plantId={plantId} />;
  return <LightChart data={data} period={selectedPeriod} plantId={plantId} />;
};

// Main Graphs Section Component
const RealTimeGraph = ({ plantId }: { plantId?: string }) => {
  const [selectedMetric, setSelectedMetric] = useState("moisture");
  const [selectedPeriod, setSelectedPeriod] = useState("Day");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [plantInfo, setPlantInfo] = useState(null); // TODO: Store plant-specific info from backend

  // TODO: Fetch plant info and sensor data on component mount
  useEffect(() => {
    // fetchPlantInfo();
    // setupWebSocketConnection();
  }, [plantId]);

  // TODO: Implement real API calls
  // const fetchPlantInfo = async () => {
  //   try {
  //     const response = await fetch(`http://192.168.1.3:3000/api/plants/${plantId}/info`);
  //     const info = await response.json();
  //     setPlantInfo(info);
  //   } catch (error) {
  //     console.error('Failed to fetch plant info:', error);
  //   }
  // };

  // TODO: Setup WebSocket for real-time sensor updates
  // const setupWebSocketConnection = () => {
  //   const ws = new WebSocket('ws://192.168.1.3:3000/sensor-updates');
  //   ws.onmessage = (event) => {
  //     const sensorData = JSON.parse(event.data);
  //     if (sensorData.plantId === plantId) {
  //       // Update real-time data
  //     }
  //   };
  // };

  const hasValue = (point: any): point is { value: number } =>
    typeof point?.value === "number";

  const metrics = [
    { id: "moisture", label: "Soil Moisture", icon: "water", iconType: "ionicon", color: "#3b82f6" },
    { id: "temperature", label: "Temperature", icon: "thermometer", iconType: "ionicon", color: "#ef4444" },
    { id: "light", label: "Light", icon: "sunny", iconType: "ionicon", color: "#eab308" },
  ];

  const currentMetric = metrics.find((m) => m.id === selectedMetric);

  const getData = () => {
    // TODO: Replace with real API calls based on plantId
    if (selectedPeriod === "Day") return generateDayData(selectedMetric);
    if (selectedPeriod === "Week") return generateWeekData(selectedMetric);
    return generateMonthData(selectedMetric);
  };

  const data = getData();
  const currentDate = "09 Dec 2025";

  const getMetricStats = () => {
    // TODO: Get real stats from sensor data and plant-specific thresholds
    if (selectedMetric === "moisture") {
      const latestValue = [...data].reverse().find(hasValue)?.value ?? 18;
      return {
        title: "Volumetric Water Content",
        range: "13-64%", // TODO: Get from plant-specific optimal ranges
        current: latestValue, // TODO: Get from latest sensor reading
        unit: "%",
        lastWatering: "09.12.25", // TODO: Get from watering log API
        nextWatering: "15.12.25", // TODO: Calculate based on plant needs and sensor data
      };
    } else if (selectedMetric === "temperature") {
      return {
        title: "Ambient",
        range: "17-34°C", // TODO: Get from plant-specific temperature ranges
        current: 20, // TODO: Get from latest temperature sensor reading
        unit: "°C",
        tempDiff: "17.4", // TODO: Calculate from daily temperature variation
        median: "20.4", // TODO: Calculate from historical data
      };
    } else {
      return {
        title: "Amount (DLI)",
        range: "1.9 mol", // TODO: Get from plant-specific light requirements
        current: selectedPeriod === "Day" ? 18 : 0.2, // TODO: Get from light sensor readings
        unit: selectedPeriod === "Day" ? "μmol/m²s" : "mol",
        trend: "2.2", // TODO: Calculate trend from historical light data
        avgHours: "8.4", // TODO: Calculate average daily light hours
      };
    }
  };

  const stats = getMetricStats();

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Graphs</Text>
        <View>
          <TouchableOpacity style={styles.dropdownButton} onPress={() => setDropdownOpen(!dropdownOpen)}>
            <View style={styles.dropdownIconContainer}>
              <Ionicons name={currentMetric?.icon as any} size={16} color={currentMetric?.color} />
            </View>
            <Ionicons name="chevron-down" size={12} color="#6B7280" />
          </TouchableOpacity>
          {dropdownOpen && (
            <View style={styles.dropdownMenu}>
              {metrics.map((metric) => (
                <TouchableOpacity key={metric.id} style={styles.dropdownItem} onPress={() => { setSelectedMetric(metric.id); setDropdownOpen(false); }}>
                  <View style={styles.dropdownItemIconContainer}>
                    <Ionicons name={metric.icon as any} size={16} color={metric.color} />
                  </View>
                  <Text style={styles.dropdownItemText}>{metric.label}</Text>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>
      </View>

      <View style={styles.periodContainer}>
        {["Day", "Week", "Month"].map((period) => (
          <TouchableOpacity key={period} style={[styles.periodButton, selectedPeriod === period && styles.periodButtonActive]} onPress={() => setSelectedPeriod(period)}>
            <Text style={[styles.periodText, selectedPeriod === period && styles.periodTextActive]}>{period}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.graphCard}>
        <View style={styles.statsHeader}>
          <View style={styles.statsLeft}>
            <View style={styles.titleRow}>
              <Text style={styles.statsTitle}>{stats.title} {selectedMetric === "light" && selectedPeriod === "Day" ? ":" : ""}</Text>
              {selectedMetric === "moisture" && (
                <View style={styles.dateBadge}>
                  <Text style={styles.dateBadgeText}>{currentDate}</Text>
                </View>
              )}
            </View>
            <Text style={styles.statsRange}>{stats.range}</Text>
            <Text style={styles.statsLabel}>{selectedMetric === "light" && selectedPeriod === "Day" ? "Received Today" : "Range"}</Text>
          </View>
          <View style={styles.statsRight}>
            <View style={styles.currentValueBox}>
              <Text style={styles.currentValue}>
                {stats.current.toFixed(selectedPeriod === "Week" && selectedMetric === "light" ? 1 : 0)}
                <Text style={styles.currentUnit}> {stats.unit}</Text>
              </Text>
            </View>
            <View style={styles.dateBox}>
              <Text style={styles.dateText}>{currentDate}</Text>
            </View>
            <Text style={styles.dateSubtext}>{currentDate}, {selectedPeriod === "Day" ? "00:00" : "22:00"}</Text>
          </View>
        </View>

        <View style={styles.graphContainer}>
          {selectedMetric === "moisture" ? (
            <MoistureChart data={data} period={selectedPeriod} plantId={plantId} />
          ) : selectedMetric === "temperature" ? (
            <TemperatureChart data={data} period={selectedPeriod} plantId={plantId} />
          ) : (
            <LightChart data={data} period={selectedPeriod} plantId={plantId} />
          )}
        </View>
      </View>

      <View style={styles.bottomStats}>
        {selectedMetric === "moisture" ? (
          <>
            <View style={styles.statCard}>
              <Text style={styles.statLabel}>Last watering :</Text>
              <Text style={styles.statValue}>{stats.lastWatering}</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statLabel}>Next watering :</Text>
              <Text style={styles.statValue}>{stats.nextWatering}</Text>
            </View>
          </>
        ) : selectedMetric === "temperature" ? (
          <>
            <View style={styles.statCard}>
              <Text style={styles.statLabel}>Temp Difference :</Text>
              <Text style={styles.statValue}>{stats.tempDiff} °C</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statLabel}>Median :</Text>
              <Text style={styles.statValue}>{stats.median} °C</Text>
            </View>
          </>
        ) : (
          <>
            <View style={styles.statCard}>
              <Text style={styles.statLabel}>Trend :</Text>
              <Text style={styles.statValue}>{stats.trend} <Text style={styles.trendDown}>% down</Text></Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statLabel}>Avg. hours of light :</Text>
              <Text style={styles.statValue}>{stats.avgHours} <Text style={styles.statUnit}>mins</Text></Text>
            </View>
          </>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { marginBottom: 20 },
  header: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 12 },
  headerTitle: { fontSize: 16, fontWeight: "600", color: "#000" },
  dropdownButton: { flexDirection: "row", alignItems: "center", gap: 6, paddingHorizontal: 8, paddingVertical: 4, borderRadius: 16, borderWidth: 1, borderColor: "#D1D5DB", backgroundColor: "#F3F4F6" },
  dropdownIconContainer: { width: 20, height: 20, borderRadius: 10, alignItems: "center", justifyContent: "center" },
  dropdownMenu: { position: "absolute", top: 40, right: 0, backgroundColor: "#fff", borderRadius: 12, padding: 8, minWidth: 180, shadowColor: "#000", shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.1, shadowRadius: 12, elevation: 5, zIndex: 1000 },
  dropdownItem: { flexDirection: "row", alignItems: "center", gap: 10, padding: 10, borderRadius: 8, borderBottomWidth: 1, borderBottomColor: "#F3F4F6" },
  dropdownItemIconContainer: { width: 24, height: 24, borderRadius: 12, alignItems: "center", justifyContent: "center" },
  dropdownItemText: { fontSize: 13, color: "#374151" },
  periodContainer: { flexDirection: "row", marginBottom: 16, backgroundColor: "#E8F5EF", borderRadius: 25, padding: 4 },
  periodButton: { flex: 1, paddingVertical: 10, paddingHorizontal: 16, borderRadius: 20, alignItems: "center" },
  periodButtonActive: { backgroundColor: "#4AA88B" },
  periodText: { fontSize: 14, color: "#9CA3AF" },
  periodTextActive: { color: "#fff" },
  graphCard: { backgroundColor: "#fff", borderRadius: 12, padding: 16, marginBottom: 20, shadowColor: "#000", shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 2, elevation: 1 },
  statsHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16 },
  statsLeft: {},
  statsTitle: { fontSize: 13, color: "#6B7280", marginBottom: 4 },
  statsRange: { fontSize: 13, color: "#000", marginBottom: 2 },
  statsLabel: { fontSize: 12, color: "#9CA3AF" },
  statsRight: { alignItems: "flex-end" },
  currentValueBox: { backgroundColor: "#E0F2FE", borderRadius: 8, paddingHorizontal: 12, paddingVertical: 8, marginBottom: 4 },
  currentValue: { fontSize: 24, fontWeight: "700", color: "#2C593A" },
  currentUnit: { fontSize: 16 },
  dateBox: { backgroundColor: "#DBEAFE", borderRadius: 12, paddingHorizontal: 12, paddingVertical: 4, borderWidth: 1, borderColor: "#93C5FD" },
  dateText: { fontSize: 11, color: "#1E40AF" },
  dateSubtext: { fontSize: 10, color: "#9CA3AF", marginTop: 2 },
  graphContainer: { marginTop: 16, alignItems: "center" },
  bottomStats: { flexDirection: "row", gap: 12 },
  statCard: { flex: 1, backgroundColor: "#fff", borderRadius: 12, padding: 12, shadowColor: "#000", shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 2, elevation: 1 },
  statLabel: { fontSize: 12, color: "#6B7280", marginBottom: 4 },
  statValue: { fontSize: 18, fontWeight: "600", color: "#111827" },
  statUnit: { fontSize: 14 },
  trendDown: { fontSize: 12, color: "#EF4444" },
  titleRow: { flexDirection: "row", alignItems: "center", gap: 8 },
  dateBadge: { backgroundColor: "#F3F4F6", borderRadius: 999, paddingHorizontal: 8, paddingVertical: 2 },
  dateBadgeText: { fontSize: 10, color: "#3E5842", fontWeight: "500" },
});

export default RealTimeGraph;
export { SimpleGraph };