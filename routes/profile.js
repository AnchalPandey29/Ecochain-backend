const express = require('express');
const { getUserProfile, updateUserProfile } = require('../controllers/profileController');
const auth = require('../middleware/auth');
const router = new express.Router();

// Get User Profile (Authenticated)
router.get('/profile', auth, getUserProfile);

// Update User Profile (Authenticated)
router.patch('/profile', auth, updateUserProfile);

module.exports = router;
