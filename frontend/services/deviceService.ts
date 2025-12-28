import AsyncStorage from "@react-native-async-storage/async-storage";

const API_BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL;

const getAuthHeader = async () => {
  const token = await AsyncStorage.getItem("authToken");
  return {
    Authorization: `Bearer ${token}`,
  };
};

export interface DeviceConnectionStatus {
  success: boolean;
  deviceId?: string;
  status?: 'ONLINE' | 'OFFLINE' | 'DISCONNECTED';
  isOnline?: boolean;
  lastSeen?: string;
  lastData?: {
    sh: number;
    t: number;
    lx: number;
    bp: number;
  };
}

export const getDeviceStatus = async (deviceId: string): Promise<DeviceConnectionStatus> => {
  try {
    const headers = await getAuthHeader();
    const response = await fetch(`${API_BASE_URL}/api/device/${deviceId}/status`, {
      method: 'GET',
      headers: {
        ...headers,
        'Content-Type': 'application/json',
      }
    });
    
    if (!response.ok) {
      throw new Error('Failed to get device status');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error getting device status:', error);
    throw error;
  }
};

export const getDeviceHistory = async (deviceId: string, period: string) => {
  try {
    const headers = await getAuthHeader();
    const response = await fetch(`${API_BASE_URL}/api/device/${deviceId}/history?period=${period}`, {
      method: 'GET',
      headers: {
        ...headers,
        'Content-Type': 'application/json',
      }
    });
    
    if (!response.ok) {
      throw new Error('Failed to get device history');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error getting device history:', error);
    throw error;
  }
};

export const sendSceneCommand = async (deviceId: string, sceneId: string) => {
  try {
    const headers = await getAuthHeader();
    const response = await fetch(`${API_BASE_URL}/api/device/${deviceId}/scene`, {
      method: 'POST',
      headers: {
        ...headers,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ scene_id: sceneId })
    });
    
    return await response.json();
  } catch (error) {
    console.error('Error sending scene command:', error);
    throw error;
  }
};

export const sendThresholdCommand = async (deviceId: string, thresholds: any) => {
  try {
    const headers = await getAuthHeader();
    const response = await fetch(`${API_BASE_URL}/api/device/${deviceId}/thresholds`, {
      method: 'POST',
      headers: {
        ...headers,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ thresholds })
    });
    
    return await response.json();
  } catch (error) {
    console.error('Error sending threshold command:', error);
    throw error;
  }
};
