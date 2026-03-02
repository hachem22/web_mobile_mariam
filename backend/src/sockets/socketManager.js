const socketManager = (io) => {
    io.on('connection', (socket) => {
        console.log(`🔌 Client connecté: ${socket.id}`);

        // Join specific rooms based on roles (optional)
        socket.on('join_room', (room) => {
            socket.join(room);
            console.log(`User ${socket.id} joined room: ${room}`);
        });

        // Join specific room for a user
        socket.on('join_user_room', (userId) => {
            const roomName = `user_${userId}`;
            socket.join(roomName);
            console.log(`👤 User ${userId} joined room: ${roomName}`);
        });

        // Handle Drone Position Updates (from Python/Simulation)
        socket.on('drone_position_update', (data) => {
            // data: { drone_id, lat, lng, altitude, batterie, status }
            console.log(`🚁 Drone ${data.drone_id} update received`);

            // Broadcast to frontend (Manager Dashboard)
            io.emit('drone_update', data);
        });

        // Handle New Alerts (from AI detection)
        socket.on('new_alert', (data) => {
            console.log('🚨 Nouvelle alerte reçue:', data);

            // Broadcast to all clients (or specifically to manager room)
            io.emit('alert_received', data);
        });

        // Handle disconnect
        socket.on('disconnect', () => {
            console.log(`❌ Client déconnecté: ${socket.id}`);
        });
    });
};

module.exports = socketManager;
