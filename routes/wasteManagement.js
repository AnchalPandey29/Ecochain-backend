const express = require('express');
const { logWaste, getWasteStats } = require('../controllers/wasteManagementController');
const auth = require('../middleware/auth');
const router = new express.Router();

// Log waste data
router.post('/logWaste', auth, logWaste);

// Get waste statistics for manufacturer or consumer
router.get('/wasteStats', auth, getWasteStats);

module.exports = router;
