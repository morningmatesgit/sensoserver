import React, { useState } from "react";
import { View, Text } from "react-native";
import { PanGestureHandler, State } from "react-native-gesture-handler";
import Animated, { useSharedValue, withSpring, runOnJS } from "react-native-reanimated";
import Svg, { Path, Line as SvgLine, Defs, LinearGradient as SvgLinearGradient, Stop, Text as SvgText, Rect } from "react-native-svg";

// TODO: Connect to backend API for real sensor data
// Backend endpoint: GET /api/plants/:plantId/light-data?period=day|week|month
// Sensor: BH1750 light intensity sensor or photoresistor readings from Arduino/ESP32
// Data format: { timestamp, lightIntensity, luxValue, sensorId }

interface LightChartProps {
  data: Array<{ time?: string; day?: string; date?: string; value: number }>;
  period: string;
  plantId?: string; // TODO: Use for API calls to get plant-specific data
}

const GRAPH_WIDTH = 320;
const GRAPH_HEIGHT = 240;
const PADDING = { top: 20, right: 40, bottom: 30, left: 20 };

const LightChart: React.FC<LightChartProps> = ({ data, period, plantId }) => {
  const [dragPosition, setDragPosition] = useState<{ x: number; y: number } | null>(null);
  const [dragData, setDragData] = useState<{ value: number; time: string } | null>(null);
  const [showCard, setShowCard] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  
  const chartWidth = GRAPH_WIDTH - PADDING.left - PADDING.right;
  const chartHeight = GRAPH_HEIGHT - PADDING.top - PADDING.bottom;
  const maxValue = period === "Week" ? 25 : period === "Month" ? 30 : 60;
  
  // Light intensity thresholds for plant health
  const getThresholdColor = (value: number) => {
    if (value > 50) return "#EF4444"; // Red - Too bright
    if (value >= 40) return "#EAB308"; // Yellow - High
    if (value >= 0.3) return "#22C55E"; // Green - Optimal
    return "#9CA3AF"; // Gray - Too low
  };
  
  const getThresholdGradient = (value: number) => {
    if (period === "Day") return "url(#lightDayGrad)";
    if (value > 50) return "url(#redGrad)";
    if (value >= 40) return "url(#yellowGrad)";
    if (value >= 0.3) return "url(#greenGrad)";
    return "url(#grayGrad)";
  };
  
  const getX = (index: number) => PADDING.left + (index / (data.length - 1)) * chartWidth;
  const getY = (value: number) => PADDING.top + chartHeight - (value / maxValue) * chartHeight;
  
  const translateX = useSharedValue(0);
  const opacity = useSharedValue(0);
  
  const updateDragData = (x: number) => {
    const relativeX = Math.max(0, Math.min(chartWidth, x - PADDING.left));
    const progress = relativeX / chartWidth;
    const dataIndex = Math.round(progress * (data.length - 1));
    const selectedData = data[dataIndex];
    if (selectedData) {
      const newX = (period === "Week" || period === "Month") ? PADDING.left + (dataIndex + 0.5) * (chartWidth / data.length) : getX(dataIndex);
      const newY = getY(selectedData.value);
      translateX.value = withSpring(newX, { damping: 20, stiffness: 300 });
      setDragPosition({ x: newX, y: newY });
      setDragData({ value: selectedData.value, time: selectedData.time || selectedData.day || selectedData.date });
      setShowCard(true);
    }
  };
  
  const onHandlerStateChange = (event: any) => {
    if (event.nativeEvent.state === State.BEGAN) {
      setIsDragging(true);
      opacity.value = withSpring(1, { damping: 20, stiffness: 200 });
    } else if (event.nativeEvent.state === State.END) {
      setIsDragging(false);
      opacity.value = withSpring(0, { damping: 20, stiffness: 200 });
      setTimeout(() => runOnJS(() => { setShowCard(false); setDragPosition(null); })(), 200);
    }
  };

  return (
    <View>
      <PanGestureHandler onGestureEvent={(e) => runOnJS(updateDragData)(e.nativeEvent.x)} onHandlerStateChange={onHandlerStateChange}>
        <Animated.View>
          <Svg width={GRAPH_WIDTH} height={GRAPH_HEIGHT}>
            <Defs>
              <SvgLinearGradient id="lightDayGrad" x1="0" y1="0" x2="1" y2="0">
                <Stop offset="0%" stopColor="#229B3B" />
                <Stop offset="33%" stopColor="#4BAB5F" />
                <Stop offset="66%" stopColor="#BEBA3B" />
                <Stop offset="100%" stopColor="#FD4744" />
              </SvgLinearGradient>
              <SvgLinearGradient id="redGrad" x1="0" y1="0" x2="1" y2="0">
                <Stop offset="0%" stopColor="#EF4444" />
                <Stop offset="25%" stopColor="#F87171" />
                <Stop offset="50%" stopColor="#EF4444" />
                <Stop offset="75%" stopColor="#DC2626" />
                <Stop offset="100%" stopColor="#EF4444" />
              </SvgLinearGradient>
              <SvgLinearGradient id="yellowGrad" x1="0" y1="0" x2="1" y2="0">
                <Stop offset="0%" stopColor="#EAB308" />
                <Stop offset="25%" stopColor="#FCD34D" />
                <Stop offset="50%" stopColor="#EAB308" />
                <Stop offset="75%" stopColor="#D97706" />
                <Stop offset="100%" stopColor="#EAB308" />
              </SvgLinearGradient>
              <SvgLinearGradient id="greenGrad" x1="0" y1="0" x2="1" y2="0">
                <Stop offset="0%" stopColor="#22C55E" />
                <Stop offset="25%" stopColor="#4ADE80" />
                <Stop offset="50%" stopColor="#22C55E" />
                <Stop offset="75%" stopColor="#16A34A" />
                <Stop offset="100%" stopColor="#22C55E" />
              </SvgLinearGradient>
              <SvgLinearGradient id="grayGrad" x1="0" y1="0" x2="1" y2="0">
                <Stop offset="0%" stopColor="#9CA3AF" />
                <Stop offset="25%" stopColor="#D1D5DB" />
                <Stop offset="50%" stopColor="#9CA3AF" />
                <Stop offset="75%" stopColor="#6B7280" />
                <Stop offset="100%" stopColor="#9CA3AF" />
              </SvgLinearGradient>
              <SvgLinearGradient id="barGreenGrad" x1="0" y1="1" x2="0" y2="0">
                <Stop offset="0%" stopColor="#016A17" />
                <Stop offset="100%" stopColor="#4BAB5F" />
              </SvgLinearGradient>
              <SvgLinearGradient id="barYellowGrad" x1="0" y1="1" x2="0" y2="0">
                <Stop offset="0%" stopColor="#D97706" />
                <Stop offset="100%" stopColor="#FCD34D" />
              </SvgLinearGradient>
              <SvgLinearGradient id="barRedGrad" x1="0" y1="1" x2="0" y2="0">
                <Stop offset="0%" stopColor="#DC2626" />
                <Stop offset="100%" stopColor="#F87171" />
              </SvgLinearGradient>
            </Defs>

            {/* Y-axis labels */}
            <SvgText x={GRAPH_WIDTH - PADDING.right + 10} y={getY(maxValue) + 3} fontSize="9" fill="#9CA3AF">{maxValue}</SvgText>
            <SvgText x={GRAPH_WIDTH - PADDING.right + 10} y={getY(50) + 3} fontSize="9" fill="#9CA3AF">50</SvgText>
            <SvgText x={GRAPH_WIDTH - PADDING.right + 10} y={getY(40) + 3} fontSize="9" fill="#9CA3AF">40</SvgText>
            <SvgText x={GRAPH_WIDTH - PADDING.right + 10} y={getY(30) + 3} fontSize="9" fill="#9CA3AF">30</SvgText>
            <SvgText x={GRAPH_WIDTH - PADDING.right + 10} y={getY(20) + 3} fontSize="9" fill="#9CA3AF">20</SvgText>
            <SvgText x={GRAPH_WIDTH - PADDING.right + 10} y={getY(10) + 3} fontSize="9" fill="#9CA3AF">10</SvgText>
            <SvgText x={GRAPH_WIDTH - PADDING.right + 10} y={getY(0) + 3} fontSize="9" fill="#9CA3AF">0</SvgText>

            {period === "Week" || period === "Month" ? (
              data.map((item, index) => {
                const barWidth = chartWidth / data.length * 0.6;
                const barX = PADDING.left + (index + 0.2) * (chartWidth / data.length);
                const barHeight = (item.value / maxValue) * chartHeight;
                const barY = GRAPH_HEIGHT - PADDING.bottom - barHeight;
                return (
                  <Rect
                    key={index}
                    x={barX}
                    y={barY}
                    width={barWidth}
                    height={barHeight}
                    fill={item.value > 50 ? "url(#barRedGrad)" : item.value >= 40 ? "url(#barYellowGrad)" : "url(#barGreenGrad)"}
                    rx={4}
                  />
                );
              })
            ) : (
              <>
                {data.map((item, index) => {
                  if (index === 0) return null;
                  const prevX = getX(index - 1);
                  const currX = getX(index);
                  const prevY = getY(data[index - 1].value);
                  const currY = getY(item.value);
                  const segmentWidth = currX - prevX;
                  const spikePaths = [];
                  
                  for (let j = 1; j <= 10; j++) {
                    const t = j / 10;
                    const x = prevX + t * segmentWidth;
                    const baseY = prevY + t * (currY - prevY);
                    const spikeAmplitude = 3 + (index * 2);
                    const frequency = 30;
                    const spikeKey = index * 10 + j;
                    const spike = (spikeKey % 5 === 0) ? (spikeKey % 4) * spikeAmplitude * 2 : 0;
                    const waveY = baseY + Math.sin(t * Math.PI * frequency) * 1 - spike;
                    
                    if (j === 1) {
                      spikePaths.push(`M ${prevX} ${prevY} L ${x} ${waveY}`);
                    } else {
                      const prevT = (j - 1) / 10;
                      const prevWaveX = prevX + prevT * segmentWidth;
                      const prevBaseY = prevY + prevT * (currY - prevY);
                      const prevSpikeKey = index * 10 + (j - 1);
                      const prevSpike = (prevSpikeKey % 5 === 0) ? (prevSpikeKey % 4) * spikeAmplitude * 2 : 0;
                      const prevWaveY = prevBaseY + Math.sin(prevT * Math.PI * frequency) * 1 - prevSpike;
                      spikePaths.push(`M ${prevWaveX} ${prevWaveY} L ${x} ${waveY}`);
                    }
                  }
                  
                  return spikePaths.map((path, pathIndex) => (
                    <Path
                      key={`${index}-${pathIndex}`}
                      d={path}
                      stroke={getThresholdGradient(item.value)}
                      strokeWidth={1.9}
                      fill="none"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  ));
                })}
              </>
            )}

            {isDragging && dragPosition && dragData && (
              <SvgLine x1={dragPosition.x} y1={PADDING.top} x2={dragPosition.x} y2={dragPosition.y - 10} stroke={getThresholdColor(dragData.value)} strokeWidth="1" strokeLinecap="round" />
            )}

            {data.map((item, index) => (
              <SvgText key={index} x={(period === "Week" || period === "Month") ? PADDING.left + (index + 0.5) * (chartWidth / data.length) : getX(index)} y={GRAPH_HEIGHT - 10} fontSize="7" fill="#9CA3AF" textAnchor="middle">
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
          top: dragPosition.y - 58,
          left: Math.max(8, Math.min(GRAPH_WIDTH - 120, dragPosition.x - 40))
        }}>
          <Text style={{ fontSize: 18, fontWeight: "700", color: "#000000", marginBottom: 2 }}>
            {dragData.value}
            <Text style={{ fontSize: 16 }}> {period === "Day" ? "μmol/m²s" : "mol"}</Text>
          </Text>
          <Text style={{ fontSize: 9, color: "#9CA3AF" }}>09 Dec 2025, {dragData.time}</Text>
        </View>
      )}
    </View>
  );
};

export default LightChart;