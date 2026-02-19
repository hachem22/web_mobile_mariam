const express = require('express');
const router = express.Router();
const { getMissions, createAlerte, getAlertes, createMission } = require('../controllers/missionController');
const { protect } = require('../middleware/authMiddleware');

router.route('/')
    .get(protect, getMissions)
    .post(protect, createMission);

// Alert routes can be separate or nested. Keeping them here for simplicity or creating specific route file.
// Let's separate alerts to a specific path but managed here contextually.

router.get('/alertes', protect, getAlertes);
router.post('/alertes', createAlerte); // TODO: Add API Key protection

module.exports = router;
