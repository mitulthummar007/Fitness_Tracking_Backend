
const express = require('express');
const User = require('../models/userSchema');
const authenticateToken = require('./authRoutes');

const add_health_metrics = express()

     
// Add health metrics for a user
add_health_metrics.post('/add-health-metrics', authenticateToken, async (req, res) => {
    try {
      const { heartRate, sleepPattern, calorieConsumption } = req.body;
  
      // Update the user's health metrics
      const userId = req.user.userId;
      const user = await User.findById(userId);
      user.heartRate = heartRate;
      user.sleepPattern = sleepPattern;
      user.calorieConsumption = calorieConsumption;
      await user.save();
  
      return res.status(201).json({ message: 'Health metrics recorded successfully', data: user });
    } catch (error) {
      return res.status(500).json({ message: 'Recording health metrics failed', error });
    }
  });
  
  // Retrieve health metrics for a user
  add_health_metrics.get('/user-health-metrics', authenticateToken, async (req, res) => {
    try {
      const userId = req.user.userId;
      const user = await User.findById(userId);
  
      return res.json({
        heartRate: user.heartRate,
        sleepPattern: user.sleepPattern,
        calorieConsumption: user.calorieConsumption,
      });
    } catch (error) {
      return res.status(500).json({ message: 'Error fetching user health metrics', error });
    }
  })
  
  module.exports = add_health_metrics