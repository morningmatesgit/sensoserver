import React, { useState } from "react";
import { View, Text } from "react-native";
import { PanGestureHandler, State } from "react-native-gesture-handler";
import Animated, { useSharedValue, withSpring, runOnJS } from "react-native-reanimated";
import Svg, { Path, Line as SvgLine, Defs, LinearGradient as SvgLinearGradient, Stop, Text as SvgText } from "react-native-svg";

// TODO: Connect to backend API for real sensor data
// Backend endpoint: GET /api/plants/:plantId/moisture-data?period=day|week|month
// Sensor: Capacitive soil moisture sensor readings from Arduino/ESP32
// Data format: { timestamp, moistureLevel, sensorId }

interface MoistureChartProps {
  data: Array<{ time?: string; day?: string; date?: string; value: number }>;
  period: string;
  plantId?: string; // TODO: Use for API calls to get plant-specific data
}

const GRAPH_WIDTH = 320;
const GRAPH_HEIGHT = 240;
const PADDING = { top: 20, right: 40, bottom: 30, left: 20 };

const MoistureChart: React.FC<MoistureChartProps> = ({ data, period, plantId }) => {
  const [dragPosition, setDragPosition] = useState<{ x: number; y: number } | null>(null);
  const [dragData, setDragData] = useState<{ value: number; time: string } | null>(null);
  const [showCard, setShowCard] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  
  const chartWidth = GRAPH_WIDTH - PADDING.left - PADDING.right;
  const chartHeight = GRAPH_HEIGHT - PADDING.top - PADDING.bottom;
  const maxValue = 100;
  const minValue = Math.min(...data.map((d) => d.value));
  const maxDataValue = Math.max(...data.map((d) => d.value));
  
  const getX = (index: number) => PADDING.left + (index / (data.length - 1)) * chartWidth;
  const getY = (value: number) => PADDING.top + chartHeight - (value / maxValue) * chartHeight;
  
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);
  const opacity = useSharedValue(0);
  
  const updateDragData = (x: number) => {
    const constrainedX = Math.max(PADDING.left, Math.min(GRAPH_WIDTH - PADDING.right, x));
    const relativeX = constrainedX - PADDING.left;
    const progress = Math.max(0, Math.min(1, relativeX / chartWidth));
    const dataIndex = Math.round(progress * (data.length - 1));
    const selectedData = data[dataIndex];
    
    if (selectedData) {
      const y = getY(selectedData.value);
      translateX.value = withSpring(constrainedX, { damping: 20, stiffness: 200 });
      translateY.value = withSpring(y - PADDING.top);
      setDragPosition({ x: constrainedX, y });
      setDragData({ value: selectedData.value, time: selectedData.time || selectedData.day || selectedData.date });
      setShowCard(true);
    }
  };
  
  const onGestureEvent = (event: any) => {
    const x = event.nativeEvent.x;
    runOnJS(updateDragData)(x);
  };
  
  const onHandlerStateChange = (event: any) => {
    if (event.nativeEvent.state === State.BEGAN) {
      setIsDragging(true);
      opacity.value = withSpring(1, { damping: 15, stiffness: 150 });
    } else if (event.nativeEvent.state === State.END) {
      setIsDragging(false);
      opacity.value = withSpring(0, { damping: 15, stiffness: 150 });
      setTimeout(() => {
        runOnJS(() => {
          setDragPosition(null);
          setDragData(null);
          setShowCard(false);
        })();
      }, 1500);
    }
  };
  
  // Build smooth curve path
  let pathD = `M ${getX(0)} ${getY(data[0].value)}`;
  for (let i = 1; i < data.length; i++) {
    const prevX = getX(i - 1);
    const prevY = getY(data[i - 1].value);
    const currX = getX(i);
    const currY = getY(data[i].value);
    const cpX1 = prevX + (currX - prevX) / 3;
    const cpY1 = prevY;
    const cpX2 = currX - (currX - prevX) / 3;
    const cpY2 = currY;
    pathD += ` C ${cpX1} ${cpY1}, ${cpX2} ${cpY2}, ${currX} ${currY}`;
  }
  
  const fillPath = `${pathD} L ${getX(data.length - 1)} ${GRAPH_HEIGHT - PADDING.bottom} L ${getX(0)} ${GRAPH_HEIGHT - PADDING.bottom} Z`;
  
  return (
    <View>
      <PanGestureHandler onGestureEvent={onGestureEvent} onHandlerStateChange={onHandlerStateChange}>
        <Animated.View>
          <Svg width={GRAPH_WIDTH} height={GRAPH_HEIGHT}>
            <Defs>
              <SvgLinearGradient id="moistureAreaGradient" x1="0" y1="0" x2="0" y2="1">
                <Stop offset="0%" stopColor="#3b82f6" stopOpacity={0.3} />
                <Stop offset="100%" stopColor="#22c55e" stopOpacity={0.1} />
              </SvgLinearGradient>
              <SvgLinearGradient id="moistureLineGradient" x1="0" y1="0" x2="1" y2="0">
                <Stop offset="0%" stopColor="#3b82f6" />
                <Stop offset="100%" stopColor="#22c55e" />
              </SvgLinearGradient>
            </Defs>
            
            <SvgLine x1={PADDING.left} y1={getY(minValue)} x2={GRAPH_WIDTH - PADDING.right} y2={getY(minValue)} stroke="#F3F4F6" strokeWidth="1" strokeDasharray="4,4" />
            <SvgLine x1={PADDING.left} y1={getY(maxDataValue)} x2={GRAPH_WIDTH - PADDING.right} y2={getY(maxDataValue)} stroke="#F3F4F6" strokeWidth="1" strokeDasharray="4,4" />
            
            <Path d={fillPath} fill="url(#moistureAreaGradient)" />
            <Path d={pathD} stroke="url(#moistureLineGradient)" strokeWidth="3" fill="none" />
            
            {[0, 25, 50, 75, 100].map((tick) => (
              <SvgText key={tick} x={GRAPH_WIDTH - PADDING.right + 10} y={getY(tick) + 4} fontSize="9" fill="#9CA3AF">
                {tick}%
              </SvgText>
            ))}
            
            {isDragging && dragPosition && dragData && (
              <SvgLine x1={dragPosition.x} y1={PADDING.top} x2={dragPosition.x} y2={dragPosition.y - 10} stroke="#3b82f6" strokeWidth="1" strokeLinecap="round" />
            )}
            
            {data.filter((_, i) => i % 2 === 0).map((item, i) => {
              const actualIndex = i * 2;
              return (
                <SvgText key={actualIndex} x={getX(actualIndex)} y={GRAPH_HEIGHT - 10} fontSize="9" fill="#9CA3AF" textAnchor="middle">
                  {item.time || item.day || item.date}
                </SvgText>
              );
            })}
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
          <Text style={{ fontSize: 20, fontWeight: "700", color: "#000000", marginBottom: 2 }}>{dragData.value}%</Text>
          <Text style={{ fontSize: 9, color: "#9CA3AF" }}>09 Dec 2025, {dragData.time}</Text>
        </View>
      )}
    </View>
  );
};

export default MoistureChart;