const mongoose = require('mongoose');

const ZoneSchema = new mongoose.Schema({
    nom: {
        type: String,
        required: [true, 'Le nom de la zone est requis']
    },
    points: {
        type: [{
            lat: {
                type: Number,
                required: true,
                min: [-90, 'Latitude invalide'],
                max: [90, 'Latitude invalide']
            },
            lng: {
                type: Number,
                required: true,
                min: [-180, 'Longitude invalide'],
                max: [180, 'Longitude invalide']
            }
        }],
        validate: {
            validator: function (arr) {
                return arr.length === 4;
            },
            message: 'Une zone doit contenir exactement 4 points GPS'
        },
        required: [true, 'Les points GPS sont requis']
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
    active: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
});

// Index
ZoneSchema.index({ drone_id: 1 });
ZoneSchema.index({ responsable_id: 1 });
ZoneSchema.index({ active: 1 });

module.exports = mongoose.model('Zone', ZoneSchema);
