# Senso Plant Care 🌿

Senso Plant Care is an IoT-enabled MERN stack application designed to help users monitor and care for their plants through real-time sensor data and automated care suggestions.

## 🏗️ Project Structure

The project is divided into two main parts:

- **[Backend](./backend)**: Node.js/Express server handling authentication, database management, and AWS IoT integration.
- **[Frontend](./frontend)**: React Native (Expo) mobile application for users to interact with their plants and view data.

## 🚀 Quick Start

### Prerequisites
- Node.js & npm installed
- MongoDB instance (local or Atlas)
- AWS IoT Core setup (for sensor integration)

### Running the Project

The easiest way to start both servers is using the provided batch script:
```bash
./start-servers.bat
```

Or manually:

**Backend:**
```bash
cd backend
npm install
npm run dev
```

**Frontend:**
```bash
cd frontend
npm install
npm start
```

## 🛠️ Key Features
- **IoT Integration**: Real-time monitoring of soil moisture, temperature, and light.
- **Device Shadowing**: Control and monitor device states via AWS IoT Shadow.
- **Plant Management**: Add, update, and track multiple plants.
- **Health Tracking**: Visualizations and status updates for plant health.
- **Cross-Platform**: Mobile app works on both Android and iOS.

## 📖 Documentation
Detailed documentation for each component can be found in their respective directories:
- [Backend Documentation](./backend/README.md)
- [Frontend Documentation](./frontend/README.md)

---
Developed for plant enthusiasts and tech lovers. 🌱
