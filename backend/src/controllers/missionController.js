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
        const mission = await Mission.create({
            ...req.body,
            responsable_id: req.user.id,
            statut: 'affectee'
        });

        // Update alert status
        await Alerte.findByIdAndUpdate(req.body.alerte_id, { traitee: true });

        res.status(201).json(mission);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

module.exports = {
    getMissions,
    createAlerte,
    getAlertes,
    createMission
};
