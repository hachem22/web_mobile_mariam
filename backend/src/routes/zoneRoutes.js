const express = require('express');
const router = express.Router();
const { createZone, getZones, deleteZone } = require('../controllers/zoneController');
const { protect } = require('../middleware/authMiddleware');

router.route('/')
    .post(protect, createZone)
    .get(protect, getZones);

router.route('/:id')
    .delete(protect, deleteZone);

module.exports = router;
