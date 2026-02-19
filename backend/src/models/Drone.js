const mongoose = require('mongoose');

const DroneSchema = new mongoose.Schema({
    nom: {
        type: String,
        required: [true, 'Le nom du drone est requis']
    },
    modele: {
        type: String,
        required: [true, 'Le modèle est requis']
    },
    numero_serie: {
        type: String,
        required: [true, 'Le numéro de série est requis'],
        unique: true
    },
    adresse_ip_camera: {
        type: String,
        required: [true, 'L\'adresse IP de la caméra est requise'],
        match: [/^rtsp:\/\/.+/, 'L\'adresse doit commencer par rtsp://']
    },
    statut: {
        type: String,
        enum: {
            values: ['disponible', 'en_mission', 'hors_ligne'],
            message: '{VALUE} n\'est pas un statut valide'
        },
        default: 'hors_ligne'
    },
    mode: {
        type: String,
        enum: {
            values: ['autonome', 'manuel', 'inactif'],
            message: '{VALUE} n\'est pas un mode valide'
        },
        default: 'inactif'
    },
    batterie: {
        type: Number,
        min: [0, 'La batterie ne peut pas être négative'],
        max: [100, 'La batterie ne peut pas dépasser 100'],
        default: 100
    },
    position_actuelle: {
        lat: {
            type: Number,
            default: null,
            min: [-90, 'Latitude invalide'],
            max: [90, 'Latitude invalide']
        },
        lng: {
            type: Number,
            default: null,
            min: [-180, 'Longitude invalide'],
            max: [180, 'Longitude invalide']
        },
        altitude: {
            type: Number,
            default: 0
        },
        timestamp: {
            type: Date,
            default: null
        }
    },
    responsable_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        default: null
    },
    zone_active_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Zone',
        default: null
    }
}, {
    timestamps: true
});

// Index
DroneSchema.index({ responsable_id: 1 });
DroneSchema.index({ statut: 1 });
// Index removed (duplicate)

module.exports = mongoose.model('Drone', DroneSchema);
