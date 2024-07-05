const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/userModel');
const { generateRoomID } = require('../utils');
require('dotenv').config();

const createRoom = async(req, res) => {
    const token = req.header('x-auth-token');
    if (!token) {
        return res.status(401).json({ message: 'No token, auth needed' });
    }
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        const roomId = generateRoomID();
        res.json({ roomId });
    } catch (error) {
        res.status(401).json({ message: 'Token is not valid' });
    }
};

module.exports = { createRoom };