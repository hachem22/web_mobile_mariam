const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    nom: {
        type: String,
        required: [true, 'Le nom est requis'],
        trim: true
    },
    prenom: {
        type: String,
        required: [true, 'Le prénom est requis'],
        trim: true
    },
    email: {
        type: String,
        required: [true, 'L\'email est requis'],
        unique: true,
        lowercase: true,
        trim: true,
        match: [/^\S+@\S+\.\S+$/, 'Email invalide']
    },
    password: {
        type: String,
        required: [true, 'Le mot de passe est requis']
    },
    role: {
        type: String,
        enum: {
            values: ['admin', 'responsable_drone', 'nageur'],
            message: '{VALUE} n\'est pas un rôle valide'
        },
        required: [true, 'Le rôle est requis']
    },
    responsable_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        default: null
    },
    statut_dispo: {
        type: String,
        enum: {
            values: ['disponible', 'en_mission', 'hors_ligne'],
            message: '{VALUE} n\'est pas un statut valide'
        },
        default: 'hors_ligne'
    },
    supabase_push_token: {
        type: String,
        default: null
    },
    actif: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true
});

// Index pour améliorer les performances
UserSchema.index({ role: 1 });
UserSchema.index({ responsable_id: 1 });
UserSchema.index({ statut_dispo: 1 });

// Méthode pour masquer le mot de passe dans les réponses JSON
UserSchema.methods.toJSON = function () {
    const user = this.toObject();
    delete user.password;
    return user;
};

module.exports = mongoose.model('User', UserSchema);
