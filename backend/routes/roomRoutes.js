const express = require('express');
const router = express.Router();
const authenticateToken = require('../middlewares/authMiddleware');
const { createRoom } = require('../controllers/roomController');

router.get('/create', authenticateToken, createRoom);

module.exports = router;