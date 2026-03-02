const Mission = require('../models/Mission');
const Alerte = require('../models/Alerte');

// @desc    Get all missions
// @route   GET /api/missions
// @access  Private
const getMissions = async (req, res) => {
    try {
        const missions = await Mission.find()
            .populate('alerte_id')
            .populate('drone_id')
            .populate('responsable_id', 'nom prenom')
            .populate('nageur_id', 'nom prenom');
        res.json(missions);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Create a new alert (from Drone)
// @route   POST /api/alertes
// @access  Public (API Key protected)
const createAlerte = async (req, res) => {
    try {
        const alerte = await Alerte.create(req.body);

        // TODO: Emit Socket.IO event 'new_alert'

        res.status(201).json(alerte);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc    Get all alerts
// @route   GET /api/alertes
// @access  Private
const getAlertes = async (req, res) => {
    try {
        const alertes = await Alerte.find().sort({ timestamp: -1 });
        res.json(alertes);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Create a mission from an alert
// @route   POST /api/missions
// @access  Private (Manager)
const createMission = async (req, res) => {
    try {
        console.log('Creating mission with body:', req.body);
        console.log('User ID:', req.user?._id || req.user?.id);

        const User = require('../models/User'); // Import User model to check status
        const swimmer = await User.findById(req.body.nageur_id);

        if (!swimmer) {
            return res.status(404).json({ message: 'Nageur non trouvé' });
        }

        if (swimmer.statut_dispo !== 'disponible') {
            return res.status(400).json({
                message: 'Ce nageur n\'est pas disponible actuellement'
            });
        }

        const mission = await Mission.create({
            ...req.body,
            responsable_id: req.user?._id || req.user?.id,
            statut: 'affectee'
        });

        // Update alert status
        await Alerte.findByIdAndUpdate(req.body.alerte_id, { traitee: true });

        // Update swimmer status
        await User.findByIdAndUpdate(req.body.nageur_id, { statut_dispo: 'en_mission' });

        // Emit Socket.IO event to the specific swimmer
        const io = req.app.get('io');
        if (io) {
            console.log(`📡 Émission de l'événement mission_assigned vers user_${req.body.nageur_id}`);
            io.to(`user_${req.body.nageur_id}`).emit('mission_assigned', mission);

            // Also emit globally for managers to update their lists in real time
            io.emit('new_mission', mission);
        }

        res.status(201).json(mission);
    } catch (error) {
        console.error('Mission creation error:', error);
        res.status(400).json({
            message: error.message,
            errors: error.errors
        });
    }
};

// @desc    Update a mission status
// @route   PUT /api/missions/:id
// @access  Private
const updateMission = async (req, res) => {
    try {
        const mission = await Mission.findById(req.params.id);
        if (!mission) {
            return res.status(404).json({ message: 'Mission non trouvée' });
        }

        const allowedFields = ['statut', 'notes', 'date_debut', 'date_fin'];
        const updates = {};
        allowedFields.forEach(field => {
            if (req.body[field] !== undefined) updates[field] = req.body[field];
        });

        // Set date_fin when mission is complete
        if (updates.statut === 'terminee' || updates.statut === 'victime_secourue') {
            updates.date_fin = new Date();
        }

        const updated = await Mission.findByIdAndUpdate(
            req.params.id,
            { $set: updates },
            { new: true, runValidators: true }
        ).populate('nageur_id', 'nom prenom');

        // When mission is completed, mark the swimmer as available
        if (updates.statut === 'terminee' || updates.statut === 'victime_secourue') {
            const User = require('../models/User'); // Import User model if not already imported
            await User.findByIdAndUpdate(updated.nageur_id, { statut_dispo: 'disponible' });
        }

        res.json(updated);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

module.exports = {
    getMissions,
    createAlerte,
    getAlertes,
    createMission,
    updateMission
};

