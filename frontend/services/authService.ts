import * as WebBrowser from "expo-web-browser";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Platform } from "react-native";

WebBrowser.maybeCompleteAuthSession();

const API_BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL;

const handleFetch = async (url: string, options: any) => {
  try {
    const response = await fetch(url, options);
    const contentType = response.headers.get("content-type");
    
    let data;
    if (contentType && contentType.indexOf("application/json") !== -1) {
      data = await response.json();
    } else {
      const text = await response.text();
      console.error("Non-JSON response received:", text);
      throw new Error(`Server error: Received non-JSON response (${response.status})`);
    }

    if (!response.ok) throw new Error(data.message || "Something went wrong");
    return data;
  } catch (error: any) {
    if (error.message === 'Network request failed') {
      throw new Error("Unable to connect to server. Please check your internet connection and ensure the backend is running.");
    }
    throw error;
  }
};

/* --------------------------------------------------
   NORMAL LOGIN
---------------------------------------------------*/
export const loginUser = async (credentials: {
  email: string;
  password: string;
}) => {
  return handleFetch(`${API_BASE_URL}/api/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(credentials),
  });
};

/* --------------------------------------------------
   NORMAL REGISTER
---------------------------------------------------*/
export const registerUser = async (userData: {
  name: string;
  email: string;
  password: string;
}) => {
  return handleFetch(`${API_BASE_URL}/api/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(userData),
  });
};

/* --------------------------------------------------
   FORGOT PASSWORD
---------------------------------------------------*/
export const forgotPassword = async (email: string) => {
  return handleFetch(`${API_BASE_URL}/api/auth/forgot-password`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email }),
  });
};

/* --------------------------------------------------
   GOOGLE LOGIN
---------------------------------------------------*/
export const googleBackendLogin = async (idToken: string) => {
  return handleFetch(`${API_BASE_URL}/api/auth/google/mobile-login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ idToken }),
  });
};

/* --------------------------------------------------
   LOGOUT
---------------------------------------------------*/
export const logoutUser = async (token: string) => {
  return handleFetch(`${API_BASE_URL}/api/auth/logout`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });
};

/* --------------------------------------------------
   UPDATE PROFILE
---------------------------------------------------*/
export const updateProfile = async (userData: {
  name?: string;
  phone?: string;
  location?: string;
  avatar?: string;
}) => {
  const token = await AsyncStorage.getItem("authToken");
  // Fixed URL: The backend route is /api/auth/profile, not /api/auth/update-profile
  return handleFetch(`${API_BASE_URL}/api/auth/profile`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(userData),
  });
};

/* --------------------------------------------------
   UPLOAD AVATAR
---------------------------------------------------*/
export const uploadAvatar = async (imageUri: string) => {
  const token = await AsyncStorage.getItem("authToken");
  
  const formData = new FormData();
  const filename = imageUri.split('/').pop();
  const match = /\.(\w+)$/.exec(filename || '');
  const type = match ? `image/${match[1]}` : `image`;

  // Fix for FormData issue in some RN versions
  const fileToUpload = {
    uri: Platform.OS === 'ios' ? imageUri.replace('file://', '') : imageUri,
    name: filename || 'avatar.jpg',
    type: type || 'image/jpeg',
  };

  formData.append('avatar', fileToUpload as any);

  try {
    const response = await fetch(`${API_BASE_URL}/api/auth/upload-avatar`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Accept': 'application/json',
      },
      body: formData,
    });
    
    const contentType = response.headers.get("content-type");
    let data;
    if (contentType && contentType.indexOf("application/json") !== -1) {
      data = await response.json();
    } else {
      const text = await response.text();
      console.error("Non-JSON response during avatar upload:", text);
      throw new Error(`Upload failed: Server returned non-JSON response (${response.status})`);
    }

    if (!response.ok) throw new Error(data.message || "Upload failed");
    return data;
  } catch (error: any) {
    console.error("Avatar upload error:", error);
    throw error;
  }
};
