const mongoose = require('mongoose');

// Create a Nutrition Schema
const nutritionSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // Reference to the User model for user association
        required: true,
    },
    date: {
        type: Date,
        default: Date.now,
        required: true,
    },
    foodItems: [
        {
            name: {
                type: String,
                required: true,
            },
            calories: {
                type: Number,
                required: true,
            },
            // You can add more properties like protein, carbs, fat, etc.
        },
    ],
    waterConsumed: {
        type: Number,
        default: 0,
    },
    // You can add more fields as needed, such as exercise data, vitamin intake, etc.
});

// Create a Nutrition model from the schema
const Nutrition = mongoose.model('Nutrition', nutritionSchema);

module.exports = Nutrition;
