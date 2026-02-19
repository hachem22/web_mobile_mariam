const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGODB_URI);

        console.log(`✅ MongoDB connecté: ${conn.connection.host}`);
        console.log(`📦 Base de données: ${conn.connection.name}`);
    } catch (error) {
        console.error(`❌ Erreur MongoDB: ${error.message}`);
        console.error(`❌ Erreur MongoDB: ${error.message}`);
        console.log('⚠️  Le serveur continue sans base de données (Mode Hors-Ligne)');
        try { await mongoose.disconnect(); } catch (e) { } // Prevent further connection attempts
    }
};

// Gestion des événements de connexion
mongoose.connection.on('disconnected', () => {
    console.log('⚠️  MongoDB déconnecté');
});

mongoose.connection.on('error', (err) => {
    console.error(`❌ Erreur MongoDB: ${err}`);
});

module.exports = connectDB;
