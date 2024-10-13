const express = require('express');
const { schedulePickup, getPickupSchedule } = require('../controllers/collectionController');
const auth = require('../middleware/auth');
const router = new express.Router();

// Schedule waste pickup (for manufacturers and consumers)
router.post('/schedulePickup', auth, schedulePickup);

// Get the pickup schedule
router.get('/pickupSchedule', auth, getPickupSchedule);

module.exports = router;
