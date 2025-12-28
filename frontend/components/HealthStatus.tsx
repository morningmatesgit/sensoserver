import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Svg, { Path, Defs, LinearGradient as SvgLinearGradient, Stop, Circle, Line } from 'react-native-svg';

export type HealthStatusType = 'healthy' | 'warning' | 'attention';

interface HealthStatusProps {
  status: HealthStatusType;
  isOnline: boolean;
  lastWatered?: string;
}

const HealthStatus: React.FC<HealthStatusProps> = ({ status, isOnline, lastWatered = "2 days ago" }) => {
  const phaseRef = React.useRef(0);
  const [, setTick] = React.useState(0);

  React.useEffect(() => {
    const id = setInterval(() => {
      phaseRef.current += 0.15;
      setTick((t: number) => t + 1);
    }, 40);
    return () => clearInterval(id);
  }, []);

  const getStatusConfig = () => {
    switch (status) {
      case 'healthy':
        return {
          color: '#4AA88B',
          icon: 'checkmark' as const,
          text: 'Healthy',
          gradientStart: '#4AA88B',
          gradientEnd: '#2F7A55'
        };
      case 'warning':
        return {
          color: '#F59E0B',
          icon: 'alert' as const,
          text: 'Warning',
          gradientStart: '#F59E0B',
          gradientEnd: '#D97706'
        };
      case 'attention':
        return {
          color: '#EF4444',
          icon: 'close' as const,
          text: 'Attention',
          gradientStart: '#EF4444',
          gradientEnd: '#DC2626'
        };
      default:
        return {
          color: '#9CA3AF',
          icon: 'help' as const,
          text: '--',
          gradientStart: '#9CA3AF',
          gradientEnd: '#6B7280'
        };
    }
  };

  const config = getStatusConfig();
  const graphWidth = 180;
  const graphHeight = 60;

  const getWaveY = (x: number) => {
    const phase = phaseRef.current;
    const progress = x / graphWidth;
    const startY = graphHeight * 0.85;
    const endY = graphHeight * 0.25;
    const baseLine = startY - progress * (startY - endY);
    const amplitude = graphHeight * 0.25;
    const frequency = 4;
    return baseLine + Math.sin(progress * Math.PI * frequency + phase) * amplitude;
  };

  const buildLinePath = () => {
    let d = `M 0 ${getWaveY(0)}`;
    for (let x = 1; x <= graphWidth; x += 3) {
      d += ` L ${x} ${getWaveY(x)}`;
    }
    return d;
  };

  const linePath = buildLinePath();
  const fillPath = linePath + ` L ${graphWidth} ${graphHeight} L 0 ${graphHeight} Z`;
  const indicatorX = graphWidth - 10;
  const indicatorY = getWaveY(indicatorX);

  return (
    <View style={styles.healthCard}>
      <Text style={styles.healthLabel}>Current Status :</Text>
      <View style={styles.healthContentRow}>
        <View style={styles.healthLeftContent}>
          <View style={styles.healthStatusRow}>
            <View style={[styles.healthIndicator, { backgroundColor: isOnline ? config.color : '#9CA3AF' }]}>
              <Ionicons
                name={isOnline ? config.icon : 'help'}
                size={18}
                color="#fff"
              />
            </View>
            <Text style={styles.healthStatusText}>
              {isOnline ? config.text : '--'}
            </Text>
          </View>
          <Text style={styles.healthSubtext}>
            Last watered : {isOnline ? lastWatered : '--'}
          </Text>
        </View>
        <View style={styles.healthRightContent}>
          {isOnline && (
            <View style={styles.healthWaveContainer}>
              <Svg width={graphWidth} height={graphHeight}>
                <Defs>
                  <SvgLinearGradient id={`waveFill-${status}`} x1="0" y1="0" x2="0" y2="1">
                    <Stop offset="0" stopColor={config.color} stopOpacity={0.35} />
                    <Stop offset="1" stopColor={config.color} stopOpacity={0} />
                  </SvgLinearGradient>
                  <SvgLinearGradient id={`waveLine-${status}`} x1="0" y1="0" x2="1" y2="0">
                    <Stop offset="0" stopColor={config.gradientEnd} />
                    <Stop offset="1" stopColor={config.color} />
                  </SvgLinearGradient>
                </Defs>
                <Path d={fillPath} fill={`url(#waveFill-${status})`} />
                <Path
                  d={linePath}
                  stroke={`url(#waveLine-${status})`}
                  strokeWidth={1.6}
                  fill="none"
                  strokeLinecap="round"
                />
                <Line
                  x1={indicatorX}
                  y1={indicatorY}
                  x2={indicatorX}
                  y2={graphHeight}
                  stroke={config.color}
                  strokeWidth="1"
                  strokeOpacity="0.3"
                />
                <Circle cx={indicatorX} cy={indicatorY} r={5.5} fill="#E8F5EF" />
                <Circle cx={indicatorX} cy={indicatorY} r={3} fill={config.color} />
              </Svg>
            </View>
          )}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  healthCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  healthLabel: {
    fontSize: 14,
    color: '#111827',
    fontWeight: '400',
    marginBottom: 8,
  },
  healthStatusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  healthIndicator: {
    width: 18,
    height: 18,
    borderRadius: 18,
    marginRight: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  healthContentRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  healthLeftContent: {
    flex: 1,
  },
  healthRightContent: {
    flex: 1,
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  healthWaveContainer: {
    width: 180,
    height: 40,
    alignItems: 'center',
    justifyContent: 'flex-end',
    paddingBottom: 8,
  },
  healthStatusText: {
    fontSize: 24,
    fontWeight: '700',
    color: '#111827',
    letterSpacing: -0.5,
  },
  healthSubtext: {
    fontSize: 13,
    color: '#6B7280',
    marginTop: 0.2,
    fontWeight: '400',
  },
});

export default HealthStatus;
