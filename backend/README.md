# Senso Plant Care - Backend

The backend for Senso Plant Care is built with Node.js, Express, and MongoDB. It handles user authentication, plant management, sensor data processing via AWS IoT, and notification services.

## 🚀 Technologies
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose
- **Authentication**: JWT & Google OAuth 2.0 (Passport.js)
- **IoT Integration**: AWS IoT Core (MQTT & Shadow)
- **Email Service**: Nodemailer
- **Push Notifications**: Expo Server SDK

## 🛠️ Setup & Installation

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Environment Variables**
   Create a `.env` file in the `backend/` directory with the following:
   ```env
   PORT=3000
   MONGO_URI=your_mongodb_uri
   JWT_SECRET=your_jwt_secret
   GOOGLE_CLIENT_ID=your_google_client_id
   GOOGLE_CLIENT_SECRET=your_google_client_secret
   EMAIL_USER=your_email@gmail.com
   EMAIL_PASS=your_app_password
   AWS_REGION=your_aws_region
   AWS_IOT_ENDPOINT=your_endpoint
   ```

3. **Run the Server**
   ```bash
   # Development mode
   npm run dev

   # Production mode
   npm start
   ```

## 📂 Project Structure
- `/config`: Database and Passport configurations.
- `/controllers`: Request logic for users, plants, and wifi.
- `/models`: Mongoose schemas (User, Plant, Device).
- `/routes`: API endpoints.
- `/utils`: Helper functions for AWS IoT, Email, and Cloudinary.
- `/middleware`: Authentication and error handling.

## 📡 Key Features
- **User Auth**: Secure registration and login with JWT and Google.
- **Plant Registry**: CRUD operations for user plants.
- **IoT Communication**: Interface with AWS IoT for real-time sensor data.
- **Shadow Management**: Control device states via AWS Shadow.
- **Automated Alerts**: Email notifications for plant health.
