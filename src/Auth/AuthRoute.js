const express = require('express');
const router = express.Router();
const authController = require('../Auth/AuthController');

// User registration
router.post('/register', authController.register);

// User login
router.post('/login', authController.login);

module.exports = router;
