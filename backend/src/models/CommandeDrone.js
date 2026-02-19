const mongoose = require('mongoose');

const CommandeDroneSchema = new mongoose.Schema({
    drone_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Drone',
        required: [true, 'Le drone est requis']
    },
    responsable_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'Le responsable est requis']
    },
    type: {
        type: String,
        enum: {
            values: ['avancer', 'reculer', 'gauche', 'droite', 'monter', 'descendre', 'decoller', 'atterrir', 'stop'],
            message: '{VALUE} n\'est pas un type de commande valide'
        },
        required: [true, 'Le type de commande est requis']
    },
    valeur: {
        type: Number,
        default: 0
    },
    timestamp: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: false // On utilise timestamp personnalisé
});

// Index
CommandeDroneSchema.index({ drone_id: 1 });
CommandeDroneSchema.index({ timestamp: -1 });

module.exports = mongoose.model('CommandeDrone', CommandeDroneSchema);
