const express = require('express');
const authenticateToken = require('./authRoutes');
const nutritionRouter = express.Router();
const Nutrition = require('../models/nutritionSchema');

// Route to log a food item
nutritionRouter.post('/log-food', authenticateToken, async (req, res) => {
    try {
        const { foodItemName, calories } = req.body;
        const userId = req.user.userId;

        // Find the user's latest nutrition entry for the current date or create a new one
        let nutritionEntry = await Nutrition.findOne({
            user: userId,
            date: { $gte: new Date().setHours(0, 0, 0, 0) },
        });

        if (!nutritionEntry) {
            nutritionEntry = new Nutrition({
                user: userId,
                foodItems: [],
            });
        }

        // Add the food item to the nutrition entry
        nutritionEntry.foodItems.push({ name: foodItemName, calories });

        // Calculate and update the total calories for the entry
        nutritionEntry.calories = nutritionEntry.foodItems.reduce(
            (totalCalories, foodItem) => totalCalories + foodItem.calories,
            0
        );

        // Save the nutrition entry
        await nutritionEntry.save();

        res.status(201).json({ message: 'Food item logged successfully', data: nutritionEntry });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to log food item', error });
    }
});

// Route to log water consumption
nutritionRouter.post('/log-water', authenticateToken, async (req, res) => {
    try {
        const { waterConsumed } = req.body;
        const userId = req.user.userId;

        // Find the user's latest nutrition entry for the current date or create a new one
        let nutritionEntry = await Nutrition.findOne({
            user: userId,
            date: { $gte: new Date().setHours(0, 0, 0, 0) },
        });

        if (!nutritionEntry) {
            nutritionEntry = new Nutrition({
                user: userId,
                foodItems: [],
            });
        }

        // Update the water consumed in the nutrition entry
        nutritionEntry.waterConsumed = waterConsumed;

        // Save the nutrition entry
        await nutritionEntry.save();

        res.status(201).json({ message: 'Water consumption logged successfully', data: nutritionEntry });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to log water consumption', error });
    }
});



nutritionRouter.get('/calculate-calories', authenticateToken, async (req, res) => {
    try {
        const userId = req.user.userId;

        // Find the user's latest nutrition entry for the current date or a specific date range
        const currentDate = new Date().setHours(0, 0, 0, 0); // Start of the current date
        const nutritionEntries = await Nutrition.find({
            user: userId,
            date: { $gte: currentDate }, // Change this if you want to specify a date range
        });

        // Calculate the total calorie intake
        let totalCalories = 0;

        for (const entry of nutritionEntries) {
            totalCalories += entry.foodItems.reduce((sum, foodItem) => sum + foodItem.calories, 0);
            totalCalories += entry.waterConsumed; // Include water consumption calories if needed
        }

        res.json({ totalCalories });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to calculate total calories', error });
    }
});

module.exports = nutritionRouter;
