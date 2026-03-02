const mongoose = require('mongoose');

const DeclarationSchema = new mongoose.Schema({
    nageur_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'Le nageur est requis']
    },
    description: {
        type: String,
        required: [true, 'La description est requise']
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
    photo_url: {
        type: String,
        default: null
    },
    statut: {
        type: String,
        enum: {
            values: ['en_attente', 'traitee'],
            message: '{VALUE} n\'est pas un statut valide'
        },
        default: 'en_attente'
    },
    timestamp: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
});

// Index
DeclarationSchema.index({ nageur_id: 1 });
DeclarationSchema.index({ timestamp: -1 });

module.exports = mongoose.model('Declaration', DeclarationSchema);
