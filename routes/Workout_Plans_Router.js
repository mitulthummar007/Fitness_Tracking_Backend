const express = require("express");
const workoutPlanSchema = require("../models/workoutPlanSchema");
const authenticateToken = require("./authRoutes");
const User = require("../models/userSchema");

const workoutplan = express.Router()

// Route to create a workout plan
workoutplan.post('/workout-plans', authenticateToken, async (req, res) => {
    try {
      const { name, description, exercises, scheduledDate } = req.body;
  
      const workoutPlan = new workoutPlanSchema({
        name,
        description,
        exercises,
        scheduledDate,
        user: req.user.userId, // Associate the plan with the logged-in user
      });
  
      await workoutPlan.save();
  
      return res.status(201).json({ message: 'Workout plan created successfully', data: workoutPlan });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Workout plan creation failed', error });
    }
  });
const workoutRecommendationsRouter = express.Router()
workoutRecommendationsRouter.get('/workout-recommendations', authenticateToken, async (req, res) => {
    try {
      const userId = req.user.userId;
  
      // Fetch user's fitness goals and other relevant information from the user model
      const user = await User.findById(userId);
  
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      // Fetch workout plans matching the user's goals and fitness level
      const workoutRecommendations = await findWorkoutRecommendations(user);
  
      return res.json({ recommendations: workoutRecommendations });
    } catch (error) {
      console.error("Error generating workout recommendations", error);
      return res.status(500).json({ message: 'Error generating workout recommendations', error });
    }
  });
  
  // Implement your dynamic workout recommendation logic here
  async function findWorkoutRecommendations(user) {
    const userGoals = user.fitnessGoals;
    const userFitnessLevel = user.fitnessLevel;
  
    // Fetch workout plans that match the user's goals and fitness level
    const workoutRecommendations = await workoutPlanSchema.find({
      'exercises.name': { $in: userGoals },
      'exercises.level': userFitnessLevel,
    });
    console.log(workoutRecommendations);
    if (workoutRecommendations.length === 0) {
      return "No workout recommendations match your criteria.";
    }
    return workoutRecommendations;
  }
  
  module.exports = {workoutplan , workoutRecommendationsRouter}