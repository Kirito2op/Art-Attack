const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/userModel');
const { login, register, getUsername } = require('../controllers/authController');
require('dotenv').config();

router.post('/register', register);

router.post('/login', login);

router.get('/username', getUsername); 

module.exports = router;