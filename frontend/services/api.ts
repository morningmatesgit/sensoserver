// Backend API Service Layer
// TODO: Replace with actual API endpoints when backend is implemented

export interface SensorData {
  timestamp: string;
  temperature: number;
  humidity: number;
  soilMoisture: number;
  lightLevel: number;
  ph: number;
}

export interface PlantData {
  id: string;
  name: string;
  botanicalName: string;
  imageUrl: string;
  healthStatus: 'healthy' | 'unhealthy' | 'warning';
  lastWatered: string;
  isOnline: boolean;
  deviceId?: string;
}

export interface GraphData {
  plantId: string;
  period: 'day' | 'week' | 'month';
  data: SensorData[];
  waterContent: {
    current: number;
    min: number;
    max: number;
  };
}

// Mock API functions - replace with actual HTTP calls
export const PlantAPI = {
  // Get plant details
  getPlantById: async (plantId: string): Promise<PlantData> => {
    // TODO: Replace with actual API call
    return {
      id: plantId,
      name: "Monstera Deliciosa",
      botanicalName: "Monstera Deliciosa",
      imageUrl: "",
      healthStatus: 'healthy',
      lastWatered: "2024-01-15T10:30:00Z",
      isOnline: true,
      deviceId: "device_123"
    };
  },

  // Get real-time sensor data
  getRealTimeSensorData: async (deviceId: string): Promise<SensorData> => {
    // TODO: Replace with actual WebSocket or API call
    return {
      timestamp: new Date().toISOString(),
      temperature: 22.5,
      humidity: 65,
      soilMoisture: 45,
      lightLevel: 800,
      ph: 6.5
    };
  },

  // Get historical graph data
  getGraphData: async (plantId: string, period: 'day' | 'week' | 'month'): Promise<GraphData> => {
    // TODO: Replace with actual API call
    const mockData: SensorData[] = [];
    const now = new Date();
    
    for (let i = 0; i < 24; i++) {
      mockData.push({
        timestamp: new Date(now.getTime() - i * 60 * 60 * 1000).toISOString(),
        temperature: 20 + Math.random() * 10,
        humidity: 50 + Math.random() * 30,
        soilMoisture: 30 + Math.random() * 40,
        lightLevel: 500 + Math.random() * 500,
        ph: 6 + Math.random() * 2
      });
    }

    return {
      plantId,
      period,
      data: mockData,
      waterContent: {
        current: 45,
        min: 13,
        max: 64
      }
    };
  },

  // Update plant health status
  updateHealthStatus: async (plantId: string, status: 'healthy' | 'unhealthy' | 'warning'): Promise<void> => {
    // TODO: Replace with actual API call
    console.log(`Updating plant ${plantId} health status to ${status}`);
  },

  // Get plant care tasks
  getPlantTasks: async (plantId: string): Promise<any[]> => {
    // TODO: Replace with actual API call
    return [
      { id: '1', type: 'water', dueDate: new Date().toISOString(), completed: false },
      { id: '2', type: 'mist', dueDate: new Date().toISOString(), completed: false }
    ];
  }
};

// WebSocket service for real-time updates
export class RealtimeService {
  private ws: WebSocket | null = null;
  private callbacks: Map<string, (data: any) => void> = new Map();

  connect(deviceId: string) {
    // TODO: Replace with actual WebSocket URL
    // this.ws = new WebSocket(`ws://api.sensoplantcare.com/ws/${deviceId}`);
    
    // Mock real-time updates
    setInterval(() => {
      this.callbacks.forEach(callback => {
        callback({
          timestamp: new Date().toISOString(),
          temperature: 20 + Math.random() * 10,
          humidity: 50 + Math.random() * 30,
          soilMoisture: 30 + Math.random() * 40,
          lightLevel: 500 + Math.random() * 500
        });
      });
    }, 5000);
  }

  subscribe(eventType: string, callback: (data: any) => void) {
    this.callbacks.set(eventType, callback);
  }

  disconnect() {
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
    this.callbacks.clear();
  }
}