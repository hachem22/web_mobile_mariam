const io = require('socket.io-client');

// Connect to the local backend
const socket = io('http://localhost:5000');

const drones = [
    { id: 1, lat: 43.296482, lng: 5.369780, name: 'Drone Alpha', status: 'Patrouille' },
    { id: 2, lat: 43.285000, lng: 5.350000, name: 'Drone Beta', status: 'Patrouille' }
];

socket.on('connect', () => {
    console.log('✅ Connecté au serveur Socket.IO');
    console.log('🚀 Démarrage de la simulation des drones...');

    setInterval(() => {
        drones.forEach(drone => {
            // Simulate slight movement
            drone.lat += (Math.random() - 0.5) * 0.001;
            drone.lng += (Math.random() - 0.5) * 0.001;
            drone.batterie = Math.max(0, 100 - Math.floor(Math.random() * 10)); // fake battery drain

            // Send update
            socket.emit('drone_position_update', {
                drone_id: drone.id,
                lat: drone.lat,
                lng: drone.lng,
                altitude: 50 + Math.random() * 10,
                batterie: drone.batterie,
                status: drone.status
            });

            console.log(`📡 Update envoyé pour ${drone.name}: [${drone.lat.toFixed(4)}, ${drone.lng.toFixed(4)}]`);
        });
    }, 2000); // Update every 2 seconds
});

socket.on('disconnect', () => {
    console.log('❌ Déconnecté');
});
