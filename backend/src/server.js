const express = require('express'); // Server entry point
const dotenv = require('dotenv');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');
const connectDB = require('./config/db');

// Load env vars
dotenv.config();

// Connect to database
const mongoose = require('mongoose');
connectDB();

// Verify collections on startup
mongoose.connection.once('open', async () => {
    const collections = await mongoose.connection.db.listCollections().toArray();
    console.log('\n📋 Collections disponibles:');
    collections.forEach(col => console.log(`   - ${col.name}`));
    console.log('');
});

const app = express();
const server = http.createServer(app);

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/drones', require('./routes/droneRoutes'));
app.use('/api/zones', require('./routes/zoneRoutes'));
app.use('/api/missions', require('./routes/missionRoutes'));

// Socket.IO Setup
const io = new Server(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
});

require('./sockets/socketManager')(io);

// Make io accessible in routes (optional, via req.app.get('io'))
app.set('io', io);

// Basic route
app.get('/', (req, res) => {
    res.send('SeaGuard API is running...');
});

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
    console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});
