const express = require('express');
const router = express.Router();
const {
    registerDrone,
    getDrones,
    updateDroneStatus,
    updateDrone,
    deleteDrone
} = require('../controllers/droneController');
const { protect } = require('../middleware/authMiddleware');

router.route('/')
    .post(protect, registerDrone)
    .get(protect, getDrones);

router.route('/:id')
    .put(protect, updateDrone)
    .delete(protect, deleteDrone);

router.put('/:id/status', updateDroneStatus);

module.exports = router;
