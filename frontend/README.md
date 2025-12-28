# Senso Plant Care - Frontend

The mobile application for Senso Plant Care, built with React Native and Expo. It provides users with a comprehensive dashboard to monitor their plants' health in real-time.

## 🚀 Technologies
- **Framework**: React Native with Expo
- **Navigation**: Expo Router (File-based routing)
- **State Management**: React Hooks (useState, useEffect)
- **Networking**: Axios
- **UI Components**: 
  - React Native Gifted Charts & Victory Native (Graphs)
  - Expo Image & Image Picker
  - Linear Gradient
  - Vector Icons

## 🛠️ Setup & Installation

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Environment Configuration**
   Ensure your local machine IP is correctly set in your services/api configuration to allow the physical device or emulator to connect to the backend.

3. **Run the App**
   ```bash
   # Start Expo development server
   npm start

   # Run on Android
   npm run android

   # Run on iOS
   npm run ios
   ```

## 📂 Project Structure
- `/app`: Main application screens and routing (Expo Router).
- `/components`: Reusable UI components (HealthStatus, RealTimeGraph, etc.).
- `/services`: API service layers for backend communication.
- `/assets`: Images, fonts, and static resources.
- `/constants`: Style constants and configuration values.

## 📱 Key Features
- **Real-time Dashboard**: Monitor soil moisture, temperature, and light.
- **Plant Library**: Manage multiple plants with detailed care instructions.
- **Health Scanning**: Track and scan plant health status.
- **Interactive Graphs**: Visualize historical sensor data (Day/Week/Month views).
- **Care To-Dos**: Checklist for watering, misting, and general maintenance.
- **Google Authentication**: Seamless login experience.

## 🔗 Connection to Backend
The app connects to the backend API via the base URL defined in the service layer. Ensure both devices are on the same Wi-Fi network for local development.
