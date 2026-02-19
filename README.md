# SeaGuard 🌊🚁

**SeaGuard** is a comprehensive platform designed to manage and monitor sea rescue drones. It provides real-time tracking, mission management, and statistical analysis for efficient sea rescue operations.

## 🚀 Key Features

- **Real-time Drone Tracking**: Visualize drone positions and status on a live map.
- **Mission Management**: Create and assign patrol zones and rescue missions.
- **Live Video Feed**: Stream video directly from drone cameras.
- **Statistical Analysis**: Monitor battery levels, signal strength, and fleet status with interactive charts.
- **Role-Based Access**: Specialized dashboards for Administrators and Managers (Drone Responsables).
- **Mobile Companion**: Mobile app for field operatives (React Native).

##  Screenshots

### 🖥️ Web Dashboard
![[Screenshot From 2026-02-19 23-25-02 1.png]]

![[Screenshot From 2026-02-19 23-30-08 1.png]]

![[Screenshot From 2026-02-19 23-30-16 1.png]]

![[Screenshot From 2026-02-19 23-30-21 1.png]]

![[Screenshot From 2026-02-19 23-30-28 1.png]]

![[Screenshot From 2026-02-19 23-30-54 1.png]]

![[Screenshot From 2026-02-19 23-31-17 1.png]]

![[Screenshot From 2026-02-19 23-41-06 1.png]]

![[Screenshot From 2026-02-19 23-41-14 1.png]]

## 🛠️ Tech Stack

### Backend
- **Node.js** & **Express**: REST API server.
- **MongoDB** & **Mongoose**: Database for users, drones, and missions.
- **Socket.io**: Real-time bidirectional communication.
- **JWT**: Secure authentication.

### Frontend (Web)
- **React** (Vite): Fast and modern web interface.
- **TailwindCSS**: Utility-first styling.
- **Leaflet** & **React-Leaflet**: Interactive maps.
- **Recharts**: Data visualization and charts.
- **Socket.io Client**: Real-time updates.

### Mobile
- **React Native** (Expo): Cross-platform mobile application.

## 📋 Prerequisites

- **Node.js**: v18+ recommended.
- **npm** or **yarn**: Package manager.
- **MongoDB**: Local instance or Atlas cluster running.

## ⚙️ Installation & Setup

### 1. Clone the Repository
```bash
git clone https://github.com/yourusername/seaguard.git
cd seaguard
```

### 2. Backend Setup
Navigate to the `backend` directory and install dependencies:
```bash
cd backend
npm install
```

Create a `.env` file in the `backend` directory with the following variables:
```env
PORT=5000
MONGODB_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/seaguard
JWT_SECRET=your_jwt_secret_key
NODE_ENV=development
```

Start the backend server:
```bash
npm start
# or for development with auto-reload:
npm run dev
```

### 3. Frontend Setup
Navigate to the `frontend` directory and install dependencies:
```bash
cd ../frontend
npm install
```

Start the frontend development server:
```bash
npm run dev
```
Access the web application at `http://localhost:5173`.

### 4. Mobile Setup
Navigate to the `mobile` directory and install dependencies:
```bash
cd ../mobile
npm install
```

Start the Expo development server:
```bash
npx expo start
```
Scan the QR code with the Expo Go app on your Android or iOS device.

## 🤝 Contributing

Contributions are welcome! Please fork the repository and submit a pull request for any enhancements or bug fixes.

## 📄 License

This project is licensed under the ISC License.
