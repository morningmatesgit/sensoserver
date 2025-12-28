import React, { useState } from "react";
import { View, Text } from "react-native";
import { PanGestureHandler, State } from "react-native-gesture-handler";
import Animated, { useSharedValue, withSpring, runOnJS } from "react-native-reanimated";
import Svg, { Line as SvgLine, Defs, LinearGradient as SvgLinearGradient, Stop, Text as SvgText } from "react-native-svg";

// TODO: Connect to backend API for real sensor data
// Backend endpoint: GET /api/plants/:plantId/temperature-data?period=day|week|month
// Sensor: DHT22/DS18B20 temperature sensor readings from Arduino/ESP32
// Data format: { timestamp, temperature, humidity, sensorId }

interface TemperatureChartProps {
  data: Array<{ time?: string; day?: string; date?: string; value: number }>;
  period: string;
  plantId?: string; // TODO: Use for API calls to get plant-specific data
}

const GRAPH_WIDTH = 320;
const GRAPH_HEIGHT = 240;
const PADDING = { top: 20, right: 40, bottom: 30, left: 20 };

const TemperatureChart: React.FC<TemperatureChartProps> = ({ data, period, plantId }) => {
  const [dragPosition, setDragPosition] = useState<{ x: number; y: number } | null>(null);
  const [dragData, setDragData] = useState<{ value: number; time: string } | null>(null);
  const [showCard, setShowCard] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  
  const chartWidth = GRAPH_WIDTH - PADDING.left - PADDING.right;
  const chartHeight = GRAPH_HEIGHT - PADDING.top - PADDING.bottom;
  const maxValue = 50;
  
  // Temperature thresholds for plant health
  const thresholds = {
    tooHigh: 42,
    high: 36,
    optimalHigh: 36,
    optimalLow: 17,
    low: 10,
    tooLow: 10
  };
  
  const getX = (index: number) => PADDING.left + (index / (data.length - 1)) * chartWidth;
  const getY = (value: number) => PADDING.top + chartHeight - (value / maxValue) * chartHeight;
  
  const translateX = useSharedValue(0);
  const opacity = useSharedValue(0);
  
  const getThresholdColor = (value: number) => {
    if (value > thresholds.tooHigh) return "#DC2626"; // Too High - Red
    if (value > thresholds.high) return "#F59E0B"; // High - Orange
    if (value >= thresholds.optimalLow && value <= thresholds.optimalHigh) return "#22C55E"; // Optimal - Green
    if (value < thresholds.tooLow) return "#3B82F6"; // Too Low - Blue
    return "#60A5FA"; // Low - Light Blue
  };
  
  const updateDragData = (x: number) => {
    const relativeX = Math.max(0, Math.min(chartWidth, x - PADDING.left));
    const progress = relativeX / chartWidth;
    const dataIndex = Math.round(progress * (data.length - 1));
    const selectedData = data[dataIndex];
    if (selectedData) {
      const newX = getX(dataIndex);
      const newY = getY(selectedData.value);
      translateX.value = withSpring(newX, { damping: 15, stiffness: 200 });
      setDragPosition({ x: newX, y: newY });
      setDragData({ value: selectedData.value, time: selectedData.time || selectedData.day || selectedData.date });
      setShowCard(true);
    }
  };
  
  const onHandlerStateChange = (event: any) => {
    if (event.nativeEvent.state === State.BEGAN) {
      setIsDragging(true);
      opacity.value = withSpring(1, { damping: 15, stiffness: 150 });
    } else if (event.nativeEvent.state === State.END) {
      setIsDragging(false);
      opacity.value = withSpring(0, { damping: 15, stiffness: 150 });
      setTimeout(() => runOnJS(() => { setShowCard(false); setDragPosition(null); })(), 300);
    }
  };
  
  return (
    <View>
      <PanGestureHandler onGestureEvent={(e) => runOnJS(updateDragData)(e.nativeEvent.x)} onHandlerStateChange={onHandlerStateChange}>
        <Animated.View>
          <Svg width={GRAPH_WIDTH} height={GRAPH_HEIGHT}>
            <Defs>
              <SvgLinearGradient id="tempWaveGrad" x1="0" y1="1" x2="0" y2="0">
                <Stop offset="0%" stopColor="#3B82F6" />
                <Stop offset="33%" stopColor="#22C55E" />
                <Stop offset="66%" stopColor="#EF4444" />
                <Stop offset="100%" stopColor="#EF4444" />
              </SvgLinearGradient>
            </Defs>
            
            {/* Y-axis labels */}
            {[0, 10, 20, 30, 40].map((tick) => (
              <SvgText key={tick} x={GRAPH_WIDTH - PADDING.right + 10} y={getY(tick) + 4} fontSize="9" fill="#9CA3AF">
                {tick}°C
              </SvgText>
            ))}
            
            {/* Vertical bars with wave pattern - only for Week and Month */}
            {(period === "Week" || period === "Month") && data.map((item, index) => {
              const barX = getX(index);
              const barStartY = getY(5); // Start from 5°C
              const barEndY = getY(30); // End at 30°C
              
              return (
                <SvgLine
                  key={index}
                  x1={barX}
                  y1={barStartY}
                  x2={barX}
                  y2={barEndY}
                  stroke="url(#tempWaveGrad)"
                  strokeWidth="4"
                  strokeLinecap="round"
                />
              );
            })}
            
            {isDragging && dragPosition && dragData && (
              <SvgLine x1={dragPosition.x} y1={PADDING.top} x2={dragPosition.x} y2={GRAPH_HEIGHT - PADDING.bottom} stroke="#EF4444" strokeWidth="1" strokeLinecap="round" />
            )}
            
            {data.map((item, index) => (
              <SvgText key={index} x={getX(index)} y={GRAPH_HEIGHT - 10} fontSize="7" fill="#9CA3AF" textAnchor="middle">
                {item.time || item.day || item.date}
              </SvgText>
            ))}
          </Svg>
        </Animated.View>
      </PanGestureHandler>
      
      {showCard && dragPosition && dragData && (
        <View style={{
          position: "absolute",
          backgroundColor: "#F3F4F6",
          borderRadius: 8,
          padding: 8,
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.1,
          shadowRadius: 4,
          elevation: 3,
          alignItems: "flex-start",
          zIndex: 1000,
          minWidth: 80,
          top: dragPosition.y - 50,
          left: dragPosition.x - 40
        }}>
          <Text style={{ fontSize: 20, fontWeight: "700", color: "#000000", marginBottom: 2 }}>{dragData.value.toFixed(1)}°C</Text>
          <Text style={{ fontSize: 9, color: "#9CA3AF" }}>09 Dec 2025, {dragData.time}</Text>
        </View>
      )}
    </View>
  );
};

export default TemperatureChart;