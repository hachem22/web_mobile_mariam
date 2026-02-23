const express = require('express');
const router = express.Router();
const {
    registerDrone,
    getDrones,
    getDroneById,
    updateDroneStatus,
    updateDrone,
    deleteDrone
} = require('../controllers/droneController');
const { protect } = require('../middleware/authMiddleware');

router.route('/')
    .post(protect, registerDrone)
    .get(protect, getDrones);

router.route('/:id')
    .get(protect, getDroneById)
    .put(protect, updateDrone)
    .delete(protect, deleteDrone);

router.put('/:id/status', updateDroneStatus);

module.exports = router;
