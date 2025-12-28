// ============================================================================
// ASSETS INDEX - CENTRALIZED DATA MANAGEMENT
// ============================================================================
// SVGs are imported as React components via react-native-svg-transformer
// ============================================================================

import Plant1 from "./plant_1.svg";
import Plant2 from "./plant_2.svg";
import PlantProfile from "./plant_profile_sample_image.svg";
import InstructionSampleImage from "./instruction_sample_image.svg";
import SmallPot from "./small_pot.svg";
import MediumPot from "./medium_pot.svg";
import LargePot from "./large_pot.svg";
import RecommendPlant from "./recommend_plant.svg";
import BigPlant from "./big_plant.svg";

import MyPlant1 from "./myplant_1.svg";
import MyPlant2 from "./myplant_2.svg";
import MyPlant3 from "./myplant_3.svg";
import MyPlant4 from "./myplant_4.svg";
import MyPlant5 from "./myplant_5.svg";

import Soil1 from "./soil_1.svg";
import Soil2 from "./soil_2.svg";
import Soil3 from "./soil_3.svg";
import Soil4 from "./soil_4.svg";
import Soil5 from "./soil_5.svg";

import ConnectImage1 from "./connect_image_1.svg";

import SensoPair from "./senso_pair.svg";
import MiniSensoPair from "./mini_senso_pair.svg";

import Info1 from "./info_1.svg";
import Info2 from "./info_2.svg";
import Info3 from "./info_3.svg";

import ShareIcon from "./share_icon.svg";

import WaterAlertIcon from "./water_alert_icon.svg";
import SunlightAlertIcon from "./sunlight_alert_icon.svg";
import WaterIcon from "./water_icon.svg";
import FertilizerIcon from "./fertilizer_icon.svg";
import NotifyIcon from "./notify_icon.svg";

// Grouped exports to preserve existing API
export const plantImages = {
  plant1: Plant1,
  plant2: Plant2,
  plantProfile: PlantProfile,
  instructionSampleImage: InstructionSampleImage,
  smallPot: SmallPot,
  mediumPot: MediumPot,
  largePot: LargePot,
  recommendPlant: RecommendPlant,
  bigPlant: BigPlant,
};

export const myPlantImages = {
  myplant1: MyPlant1,
  myplant2: MyPlant2,
  myplant3: MyPlant3,
  myplant4: MyPlant4,
  myplant5: MyPlant5,
};

export const soilImages = {
  soil1: Soil1,
  soil2: Soil2,
  soil3: Soil3,
  soil4: Soil4,
  soil5: Soil5,
};

export const connectImage1 = ConnectImage1;

export const deviceImages = {
  sensoPair: SensoPair,
  miniSensoPair: MiniSensoPair,
};

export const infoImages = {
  info1: Info1,
  info2: Info2,
  info3: Info3,
};

export const uiIcons = {
  shareIcon: ShareIcon,
};

export const notificationImages = {
  waterAlert: WaterAlertIcon,
  sunlightAlert: SunlightAlertIcon,
  waterIcon: WaterIcon,
  fertilizeIcon: FertilizerIcon,
  notifyIcon: NotifyIcon,
};

// Plants data - Used in: app/dashboard/index.tsx
export const plants = [
  {
    id: 1,
    name: "Little Ben",
    type: "Monstera Deliciosa",
    moisture: 80,
    temperature: 18,
    distance: "0.2 DU",
    status: "healthy",
    connected: true,
    image: plantImages.plant1,
  },
  {
    id: 2,
    name: "Little Ben",
    type: "Monstera Deliciosa",
    moisture: 65,
    temperature: 20,
    distance: "0.5 DU",
    status: "waiting",
    connected: false,
    image: plantImages.plant2,
  },
  {
    id: 3,
    name: "Green Buddy",
    type: "Snake Plant",
    moisture: 45,
    temperature: 22,
    distance: "0.8 DU",
    status: "healthy",
    connected: true,
    image: plantImages.plant1,
  },
];

export const myPlantsByLocation = {
  LivingRoom: [
    {
      id: 1,
      name: "Monstera",
      type: "Deliciosa",
      location: "Living Room",
      needsWater: true,
      health: "good",
      image: myPlantImages.myplant1,
    },
    {
      id: 2,
      name: "Fiddle",
      type: "Leaf Fig",
      location: "Living Room",
      needsWater: false,
      health: "excellent",
      image: myPlantImages.myplant2,
    },
    {
      id: 3,
      name: "Snake Plant",
      type: "Laurentii",
      location: "Living Room",
      needsWater: true,
      health: "good",
      image: myPlantImages.myplant3,
    },
    {
      id: 4,
      name: "Pelia",
      type: "Peperomia",
      location: "Living Room",
      needsWater: true,
      health: "good",
      image: myPlantImages.myplant4,
    },
    {
      id: 5,
      name: "Fiddle",
      type: "Leaf Fig",
      location: "Living Room",
      needsWater: true,
      health: "good",
      image: myPlantImages.myplant5,
    },
  ],
  Balcony: [
    {
      id: 6,
      name: "Monstera",
      type: "Deliciosa",
      location: "Balcony",
      needsWater: true,
      health: "good",
      image: myPlantImages.myplant1,
    },
    {
      id: 7,
      name: "Fiddle",
      type: "Leaf Fig",
      location: "Balcony",
      needsWater: false,
      health: "excellent",
      image: myPlantImages.myplant2,
    },
    {
      id: 8,
      name: "Snake Plant",
      type: "Laurentii",
      location: "Balcony",
      needsWater: true,
      health: "good",
      image: myPlantImages.myplant3,
    },
    {
      id: 9,
      name: "Pelia",
      type: "Peperomia",
      location: "Balcony",
      needsWater: true,
      health: "good",
      image: myPlantImages.myplant3,
    },
    {
      id: 10,
      name: "Fiddle",
      type: "Leaf Fig",
      location: "Balcony",
      needsWater: true,
      health: "good",
      image: myPlantImages.myplant4,
    },
  ],
};

export const tasks = [
  {
    id: 1,
    title: "Water Monstera",
    time: "Today 4:00 PM",
    image: plantImages.plant1,
  },
  {
    id: 2,
    title: "Water Monstera",
    time: "Today 4:00 PM",
    image: plantImages.plant2,
  },
  {
    id: 3,
    title: "Check Snake Plant",
    time: "Today 6:00 PM",
    image: plantImages.plant1,
  },
];

export const taskTypes = [
  { id: 1, name: "Water", icon: infoImages.info1 },
  { id: 2, name: "Mist", icon: infoImages.info1 },
  { id: 3, name: "Clean", icon: infoImages.info1 },
  { id: 4, name: "Repot", icon: infoImages.info1 },
  { id: 5, name: "Add fertilizer", icon: infoImages.info1 },
];

export const notifications = [
  {
    id: 1,
    title: "Watering Overdue!",
    message: "Your basil plant needs water now",
    time: "30 min ago",
    type: "water",
    priority: "high",
    plantName: "Basil Plant",
    icon: notificationImages.waterAlert,
    iconColor: "#ef4444",
    read: false,
  },
  {
    id: 2,
    title: "Low Light Warning",
    message: "Tomato plant receiving insufficient sunlight",
    time: "1 hour ago",
    type: "light",
    priority: "medium",
    plantName: "Tomato Plant",
    icon: notificationImages.sunlightAlert,
    iconColor: "#fb923c",
    read: false,
  },
  {
    id: 3,
    title: "Watering Reminder",
    message: "Your succulent needs water today",
    time: "2 hours ago",
    type: "water",
    priority: "normal",
    plantName: "Succulent",
    icon: notificationImages.waterIcon,
    iconColor: "#60a5fa",
    read: false,
  },
  {
    id: 4,
    title: "Fertilizer Time",
    message: "Fertilize your fern plant",
    time: "4 hours ago",
    type: "fertilizer",
    priority: "low",
    plantName: "Fern Plant",
    icon: notificationImages.fertilizeIcon,
    iconColor: "#4ade80",
    read: true,
  },
  {
    id: 5,
    title: "Growth Update",
    message: "Your snake plant has new leaves",
    time: "6 hours ago",
    type: "success",
    priority: "info",
    plantName: "Snake Plant",
    icon: notificationImages.notifyIcon,
    iconColor: "#4ade80",
    read: true,
  },
];

export const wifiNetworks = [
  { ssid: "Home_WiFi_5G", signal: 95, secured: true, connected: false },
  { ssid: "Home_WiFi_2.4G", signal: 88, secured: true, connected: true },
  { ssid: "Guest_Network", signal: 72, secured: false, connected: false },
  { ssid: "Neighbor_WiFi", signal: 45, secured: true, connected: false },
  { ssid: "Office_Network", signal: 38, secured: true, connected: false },
];

export const instructionPlantData = {
  name: "Watered Little Ben",
  botanicalName: "Monstera Deliciosa",
};

export const careInstructions = [
  {
    id: 1,
    icon: "water-outline",
    title: "Check Soil Moisture",
    description: "Water only when the top inch of soil feels dry to the touch.",
  },
  {
    id: 2,
    icon: "water",
    title: "Water When Dry",
    description:
      "Thoroughly water until excess water drains out from the bottom.",
  },
  {
    id: 3,
    icon: "thermometer",
    title: "Use Room Temperature Water",
    description: "Avoid using cold water to prevent shock to the roots.",
  },
  {
    id: 4,
    icon: "checkmark-circle",
    title: "Drain Excess Water",
    description: "Ensure no water is left standing in the saucer or pot.",
  },
];

export const potSizes = [
  {
    id: 0,
    name: "Small",
    measurement: "(4-8inches)",
    image: plantImages.smallPot,
  },
  {
    id: 1,
    name: "Medium",
    measurement: "(8-10inches)",
    image: plantImages.mediumPot,
  },
  {
    id: 2,
    name: "Large",
    measurement: "(12-15inches)",
    image: plantImages.largePot,
  },
];

export const soilTypes = [
  {
    id: "potting-mix",
    name: "Potting Mix",
    description: "Ideal for most houseplants, retains moisture",
    image: soilImages.soil1,
  },
  {
    id: "cactus-mix",
    name: "Cactus Mix",
    description: "Excellent drainage, low nutrients",
    image: soilImages.soil2,
  },
  {
    id: "peat-moss",
    name: "Peat Moss",
    description: "Improves aeration, retains water",
    image: soilImages.soil3,
  },
  {
    id: "perlite-mix",
    name: "Perlite Mix",
    description: "Enhances drainage, lightweight",
    image: soilImages.soil4,
  },
  {
    id: "orchid-bark",
    name: "Orchid Bark",
    description: "Aeration, prevents waterlogging",
    image: soilImages.soil5,
  },
];

export const plantInfoData = {
  name: "Monstera Deliciosa",
  botanicalName: "Monstera Deliciosa",
};

export const plantInfoStatusCards = [
  {
    id: "humidity",
    icon: "water",
    iconColor: "#3B82F6",
    value: "80%",
    bgColor: "#F0FDF4",
  },
  {
    id: "temp",
    icon: "thermometer",
    iconColor: "#EF4444",
    value: "18°C",
    bgColor: "#F0FDF4",
  },
  {
    id: "dli",
    icon: "sunny",
    iconColor: "#F59E0B",
    value: "0.2 DLI",
    bgColor: "#F0FDF4",
  },
  {
    id: "watering",
    image: infoImages.info1,
    value: "Every 7 days",
    bgColor: "#F0FDF4",
    label: "Every",
    sublabel: "7 days",
  },
  {
    id: "light",
    image: infoImages.info2,
    value: "Indirect light",
    bgColor: "#F0FDF4",
    label: "Indirect",
    sublabel: "light",
  },
  { id: "range", image: Info3, value: "18-27°C", bgColor: "#F0FDF4" },
];
