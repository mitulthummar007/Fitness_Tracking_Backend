const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true,},
  password: { type: String, required: true },
  name: { type: String, required: true },
  age: { type: Number, required: true },
  weight: { type: Number, required: true },
  fitnessGoals: [{ type: String }], // An array to store fitness goals
  progress: {
    weightLoss: { type: Number, default: 0 }, // Example: tracking weight loss
    muscleGain: { type: Number, default: 0 }, // Example: tracking muscle gain
    marathonRunning: { type: Boolean, default: false }, // Example: tracking marathon goal
  },
  heartRate: { type: Number },
  sleepPattern: { type: String },
  calorieConsumption: { type: Number }, 
  fitnessLevel: { type: String },
  resetPasswordOTP: {
    code: { type: String }, 
    expires: { type: Date }, 
  },
  token: { type: String }
}, { timestamps: true });


const User = mongoose.model('User', userSchema);

module.exports = User; 