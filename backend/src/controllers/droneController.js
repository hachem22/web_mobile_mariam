const Drone = require('../models/Drone');

// @desc    Register a new drone
// @route   POST /api/drones
// @access  Private (Admin)
const registerDrone = async (req, res) => {
    try {
        const drone = await Drone.create(req.body);
        res.status(201).json(drone);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc    Get all drones
// @route   GET /api/drones
// @access  Private
const getDrones = async (req, res) => {
    try {
        const drones = await Drone.find();
        res.json(drones);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update drone status (webhook)
// @route   PUT /api/drones/:id/status
// @access  Public (API Key protected)
const updateDroneStatus = async (req, res) => {
    try {
        const drone = await Drone.findByIdAndUpdate(
            req.params.id,
            req.body, // { batterie, position_actuelle, statut }
            { new: true }
        );

        if (!drone) {
            return res.status(404).json({ message: 'Drone non trouvé' });
        }

        // TODO: Emit Socket.IO event here

        res.json(drone);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc    Update drone details (Admin/Manager)
// @route   PUT /api/drones/:id
// @access  Private
const updateDrone = async (req, res) => {
    try {
        const drone = await Drone.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );
        if (!drone) {
            return res.status(404).json({ message: 'Drone non trouvé' });
        }
        res.json(drone);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc    Delete drone
// @route   DELETE /api/drones/:id
// @access  Private (Admin)
const deleteDrone = async (req, res) => {
    try {
        const drone = await Drone.findById(req.params.id);
        if (drone) {
            await drone.deleteOne();
            res.json({ message: 'Drone supprimé' });
        } else {
            res.status(404).json({ message: 'Drone non trouvé' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    registerDrone,
    getDrones,
    updateDroneStatus,
    updateDrone,
    deleteDrone
};
