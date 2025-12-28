import AsyncStorage from "@react-native-async-storage/async-storage";

const API_BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL;

const getAuthHeader = async () => {
  const token = await AsyncStorage.getItem("authToken");
  return {
    Authorization: `Bearer ${token}`,
  };
};

/* --------------------------------------------------
   CACHING HELPERS (OFFLINE SUPPORT)
---------------------------------------------------*/
const cacheData = async (key: string, data: any) => {
  try {
    await AsyncStorage.setItem(key, JSON.stringify(data));
  } catch (e) {
    console.error("Error caching data:", e);
  }
};

const getCachedData = async (key: string) => {
  try {
    const data = await AsyncStorage.getItem(key);
    return data ? JSON.parse(data) : null;
  } catch (e) {
    return null;
  }
};

/* --------------------------------------------------
   IDENTIFY PLANT (AI SCAN)
---------------------------------------------------*/
export const identifyPlant = async (imageUri: string) => {
  const headers = await getAuthHeader();

  const formData = new FormData();
  // @ts-ignore
  formData.append("image", {
    uri: imageUri,
    name: "plant.jpg",
    type: "image/jpeg",
  });

  const response = await fetch(`${API_BASE_URL}/api/plant/identify`, {
    method: "POST",
    headers: {
      ...headers,
      "Content-Type": "multipart/form-data",
    },
    body: formData,
  });

  if (!response.ok) {
    throw new Error(`Failed to identify plant: ${response.statusText}`);
  }

  const data = await response.json();
  return data;
};

/* --------------------------------------------------
   GET GLOBAL PLANT COUNT
---------------------------------------------------*/
export const getGlobalPlantCount = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/plant/global-count`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });

    if (response.ok) {
      const data = await response.json();
      await cacheData("global_plant_count", data.count);
      return data.count;
    }
  } catch (e) {}
  
  return await getCachedData("global_plant_count") || 0;
};

/* --------------------------------------------------
   GET MY PLANTS
---------------------------------------------------*/
export const getMyPlants = async () => {
  const headers = await getAuthHeader();

  try {
    const response = await fetch(`${API_BASE_URL}/api/plant/my-plants`, {
      method: "GET",
      headers: {
        ...headers,
        "Content-Type": "application/json",
      },
    });

    if (response.ok) {
      const data = await response.json();
      await cacheData("my_plants", data.data);
      return data.data;
    }
  } catch (e) {
    console.log("Offline: Loading plants from cache");
  }

  const cached = await getCachedData("my_plants");
  if (cached) return cached;
  throw new Error("No internet connection and no cached data available.");
};

/* --------------------------------------------------
   GET PLANT BY ID
---------------------------------------------------*/
export const getPlantById = async (id: string) => {
  const headers = await getAuthHeader();

  try {
    const response = await fetch(`${API_BASE_URL}/api/plant/${id}`, {
      method: "GET",
      headers: {
        ...headers,
        "Content-Type": "application/json",
      },
    });

    if (response.ok) {
      const data = await response.json();
      await cacheData(`plant_${id}`, data.data);
      return data.data;
    }
  } catch (e) {
    console.log("Offline: Loading plant details from cache");
  }

  const cached = await getCachedData(`plant_${id}`);
  if (cached) return cached;
  throw new Error("Plant details not available offline.");
};

/* --------------------------------------------------
   SAVE PLANT
---------------------------------------------------*/
export const savePlant = async (plantData: any) => {
  const headers = await getAuthHeader();
  const formData = new FormData();

  Object.keys(plantData).forEach((key) => {
    if (key === "image" && plantData[key]) {
      // @ts-ignore
      formData.append("image", {
        uri: plantData[key],
        name: "plant_image.jpg",
        type: "image/jpeg",
      });
    } else if (plantData[key] !== undefined && plantData[key] !== null) {
      if (typeof plantData[key] === "object") {
        formData.append(key, JSON.stringify(plantData[key]));
      } else {
        formData.append(key, String(plantData[key]));
      }
    }
  });

  const response = await fetch(`${API_BASE_URL}/api/plant/save`, {
    method: "POST",
    headers: {
      ...headers,
      "Content-Type": "multipart/form-data",
    },
    body: formData,
  });

  if (!response.ok) {
    throw new Error(`Failed to save plant: ${response.statusText}`);
  }

  return await response.json();
};

/* --------------------------------------------------
   UPDATE PLANT
---------------------------------------------------*/
export const updatePlant = async (plantId: string, updateData: any) => {
  const headers = await getAuthHeader();

  const response = await fetch(`${API_BASE_URL}/api/plant/${plantId}/care`, {
    method: "PUT",
    headers: {
      ...headers,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(updateData),
  });

  if (!response.ok) {
    throw new Error(`Failed to update plant: ${response.statusText}`);
  }

  return await response.json();
};

/* --------------------------------------------------
   BIND DEVICE
---------------------------------------------------*/
export const bindDeviceToPlant = async (plantId: string, deviceId: string) => {
  const headers = await getAuthHeader();

  const response = await fetch(`${API_BASE_URL}/api/plant/${plantId}/bind`, {
    method: "POST",
    headers: {
      ...headers,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ deviceId }),
  });

  if (!response.ok) {
    throw new Error(`Failed to bind device: ${response.statusText}`);
  }

  return await response.json();
};

/* --------------------------------------------------
   HEALTH SCAN
---------------------------------------------------*/
export const scanPlantHealth = async (plantId: string, imageUri: string) => {
  const headers = await getAuthHeader();

  const formData = new FormData();
  // @ts-ignore
  formData.append("image", {
    uri: imageUri,
    name: "health_scan.jpg",
    type: "image/jpeg",
  });

  const response = await fetch(
    `${API_BASE_URL}/api/plant/${plantId}/health-scan`,
    {
      method: "POST",
      headers: {
        ...headers,
        "Content-Type": "multipart/form-data",
      },
      body: formData,
    }
  );

  if (!response.ok) {
    throw new Error(`Failed to scan plant health: ${response.statusText}`);
  }

  return await response.json();
};

/* --------------------------------------------------
   DELETE PLANT
---------------------------------------------------*/
export const deletePlant = async (plantId: string) => {
  const headers = await getAuthHeader();

  const response = await fetch(`${API_BASE_URL}/api/plant/${plantId}`, {
    method: "DELETE",
    headers: {
      ...headers,
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to delete plant: ${response.statusText}`);
  }

  return await response.json();
};
