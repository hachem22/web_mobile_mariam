const mongoose = require('mongoose');

const AlerteSchema = new mongoose.Schema({
    drone_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Drone',
        required: [true, 'Le drone est requis']
    },
    position: {
        lat: {
            type: Number,
            required: [true, 'La latitude est requise'],
            min: [-90, 'Latitude invalide'],
            max: [90, 'Latitude invalide']
        },
        lng: {
            type: Number,
            required: [true, 'La longitude est requise'],
            min: [-180, 'Longitude invalide'],
            max: [180, 'Longitude invalide']
        }
    },
    image_url: {
        type: String,
        required: [true, 'L\'image est requise']
    },
    confiance: {
        type: Number,
        min: [0, 'La confiance doit être entre 0 et 1'],
        max: [1, 'La confiance doit être entre 0 et 1'],
        default: 0
    },
    traitee: {
        type: Boolean,
        default: false
    },
    mission_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Mission',
        default: null
    },
    timestamp: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: false // On utilise timestamp personnalisé
});

// Index
AlerteSchema.index({ drone_id: 1 });
AlerteSchema.index({ traitee: 1 });
AlerteSchema.index({ timestamp: -1 });

module.exports = mongoose.model('Alerte', AlerteSchema);
