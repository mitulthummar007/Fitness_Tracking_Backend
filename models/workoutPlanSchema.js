const mongoose = require('mongoose');

const workoutPlanSchema = new mongoose.Schema({
  name: String,
  description: String,
  exercises: [
    {
      name: String,
      repetitions: Number,
      sets: Number,
      duration: Number,
      fitnessLevel:String,
    },
  ],
  scheduledDate: Date,
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
});

module.exports = mongoose.model('WorkoutPlan', workoutPlanSchema);
