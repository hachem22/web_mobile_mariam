const mongoose = require('mongoose');

const MissionSchema = new mongoose.Schema({
    alerte_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Alerte',
        required: [true, 'L\'alerte est requise']
    },
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
    nageur_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'Le nageur est requis']
    },
    victime_position: {
        lat: {
            type: Number,
            required: [true, 'La latitude de la victime est requise'],
            min: [-90, 'Latitude invalide'],
            max: [90, 'Latitude invalide']
        },
        lng: {
            type: Number,
            required: [true, 'La longitude de la victime est requise'],
            min: [-180, 'Longitude invalide'],
            max: [180, 'Longitude invalide']
        }
    },
    statut: {
        type: String,
        enum: {
            values: ['affectee', 'en_cours', 'victime_secourue', 'terminee', 'annulee'],
            message: '{VALUE} n\'est pas un statut valide'
        },
        default: 'affectee'
    },
    affectation_auto: {
        type: Boolean,
        default: true
    },
    date_affectation: {
        type: Date,
        default: Date.now
    },
    date_debut: {
        type: Date,
        default: null
    },
    date_fin: {
        type: Date,
        default: null
    },
    notes: {
        type: String,
        default: ''
    }
}, {
    timestamps: true
});

// Index
MissionSchema.index({ nageur_id: 1 });
MissionSchema.index({ responsable_id: 1 });
MissionSchema.index({ statut: 1 });
MissionSchema.index({ createdAt: -1 });

module.exports = mongoose.model('Mission', MissionSchema);
