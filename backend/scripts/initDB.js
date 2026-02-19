const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

// Importer tous les modèles
const User = require('../src/models/User');
const Drone = require('../src/models/Drone');
const Zone = require('../src/models/Zone');
const Alerte = require('../src/models/Alerte');
const Mission = require('../src/models/Mission');
const CommandeDrone = require('../src/models/CommandeDrone');

async function initDatabase() {
    try {
        console.log('🚀 Démarrage de l\'initialisation de la base de données...\n');

        // Connexion à MongoDB
        await mongoose.connect(process.env.MONGODB_URI);

        console.log('✅ Connecté à MongoDB Atlas');
        console.log(`📦 Base de données: ${mongoose.connection.name}\n`);

        // Créer les index pour toutes les collections
        const collections = mongoose.connection.collections;

        for (const key in collections) {
            await collections[key].createIndexes();
            console.log(`✅ Collection "${key}" créée avec ses index`);
        }

        console.log('\n📝 Création d\'un utilisateur administrateur par défaut...\n');

        // Vérifier si un admin existe déjà
        const adminExists = await User.findOne({ role: 'admin' });

        if (!adminExists) {
            // Hasher le mot de passe
            const hashedPassword = await bcrypt.hash('admin123', 12);

            // Créer un admin par défaut
            const admin = await User.create({
                nom: 'Admin',
                prenom: 'SeaGuard',
                email: 'admin@seaguard.com',
                password: hashedPassword,
                role: 'admin',
                actif: true
            });

            console.log('✅ Administrateur créé avec succès');
            console.log('   Email: admin@seaguard.com');
            console.log('   Mot de passe: admin123');
            console.log('   ⚠️  IMPORTANT: Changez ce mot de passe en production!\n');
        } else {
            console.log('ℹ️  Un administrateur existe déjà\n');
        }

        console.log('🎉 Initialisation de la base de données terminée avec succès!\n');

        console.log('📋 Collections créées:');
        const collectionList = await mongoose.connection.db.listCollections().toArray();
        collectionList.forEach(col => console.log(`   - ${col.name}`));

        await mongoose.connection.close();
        console.log('\n✅ Connexion fermée');
        process.exit(0);

    } catch (error) {
        console.error('❌ Erreur lors de l\'initialisation :', error);
        await mongoose.connection.close();
        process.exit(1);
    }
}

// Exécuter le script
initDatabase();
