const express = require('express');
const { registerUser, loginUser, logoutUser, verifyEmail, verifyOtp } = require('../controllers/authController');
const auth = require('../middleware/auth');
const router = new express.Router();

// Register User
router.post('/register', registerUser);

// Login User
router.post('/login', loginUser);

router.post('/verifyemail',verifyEmail);

router.post('/verifyotp',verifyOtp);

// router.post('/reset-password',resetpassword);

// Logout User
router.post('/logout', auth, logoutUser);

module.exports = router;
