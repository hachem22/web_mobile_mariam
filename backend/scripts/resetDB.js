const mongoose = require('mongoose');
require('dotenv').config({ path: '../.env' });

async function resetDatabase() {
    try {
        console.log('⚠️  ATTENTION: Ce script va SUPPRIMER toutes les données!\n');

        await mongoose.connect(process.env.MONGODB_URI);

        console.log('✅ Connecté à MongoDB Atlas');

        // Supprimer toutes les collections
        const collections = await mongoose.connection.db.listCollections().toArray();

        for (const col of collections) {
            await mongoose.connection.db.dropCollection(col.name);
            console.log(`❌ Collection "${col.name}" supprimée`);
        }

        console.log('\n🗑️  Base de données réinitialisée');
        console.log('💡 Exécutez initDB.js pour recréer les collections\n');

        await mongoose.connection.close();
        process.exit(0);

    } catch (error) {
        console.error('❌ Erreur:', error);
        process.exit(1);
    }
}

// Protection: demander confirmation
console.log('⚠️⚠️⚠️  ATTENTION ⚠️⚠️⚠️');
console.log('Ce script va SUPPRIMER TOUTES les données de la base de données!');
console.log('Tapez "CONFIRMER" pour continuer ou Ctrl+C pour annuler\n');

process.stdin.once('data', (data) => {
    if (data.toString().trim() === 'CONFIRMER') {
        resetDatabase();
    } else {
        console.log('❌ Annulé');
        process.exit(0);
    }
});
