const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/userModel');

const register = async (req, res) => {
    try {
      const { username, password } = req.body;
      
      let user = await User.findOne({ username });
      if (user) {
        return res.status(400).json({ message: 'User already exists' });
      }
      
      user = new User({ username, password });
      await user.save();
      
      const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '24h' });
      res.status(201).json({ token });
    } catch (error) {
      res.status(500).json({ message: 'Server error' });
    }
  }

const login = async (req, res) => {
    try {
      const { username, password } = req.body;
      
      const user = await User.findOne({ username });
      if (!user) {
        return res.status(400).json({ message: 'Invalid credentials' });
      }
      
      const isMatch = await user.comparePassword(password);
      if (!isMatch) {
        return res.status(400).json({ message: 'Invalid credentials' });
      }
      
      const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '24h' });
      res.json({ token });
    } catch (error) {
      res.status(500).json({ message: 'Server error' });
    }
  }

const getUsername = async (req, res) => {
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
        res.json({ username: user.username });
    } catch (error) {
        res.status(401).json({ message: 'Token is not valid' });
    }
}

module.exports = { login, register, getUsername };