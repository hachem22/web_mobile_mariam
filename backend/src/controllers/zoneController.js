const Zone = require('../models/Zone');

// @desc    Create a new zone
// @route   POST /api/zones
// @access  Private (Admin)
const createZone = async (req, res) => {
    try {
        const zone = await Zone.create(req.body);
        res.status(201).json(zone);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc    Get all zones
// @route   GET /api/zones
// @access  Private
const getZones = async (req, res) => {
    try {
        const zones = await Zone.find();
        res.json(zones);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Delete a zone
// @route   DELETE /api/zones/:id
// @access  Private (Admin)
const deleteZone = async (req, res) => {
    try {
        const zone = await Zone.findById(req.params.id);

        if (!zone) {
            return res.status(404).json({ message: 'Zone non trouvée' });
        }

        await zone.deleteOne();
        res.json({ message: 'Zone supprimée' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    createZone,
    getZones,
    deleteZone
};
