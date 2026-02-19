const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

async function checkCollections() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);

        console.log('✅ Connecté à MongoDB Atlas\n');

        const collections = await mongoose.connection.db.listCollections().toArray();

        console.log(`📦 Base de données: ${mongoose.connection.name}`);
        console.log(`📊 Nombre de collections: ${collections.length}\n`);

        console.log('📋 Collections disponibles:');
        for (const col of collections) {
            const count = await mongoose.connection.db.collection(col.name).countDocuments();
            console.log(`   - ${col.name} (${count} documents)`);
        }

        await mongoose.connection.close();
        console.log('\n✅ Vérification terminée');
        process.exit(0);

    } catch (error) {
        console.error('❌ Erreur:', error);
        process.exit(1);
    }
}

checkCollections();
