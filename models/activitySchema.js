const mongoose = require('mongoose');

const activitySchema = new mongoose.Schema({
  type: { type: String, required: true },
  distance: { type: Number, required: true },
  duration: { type: Number, required: true },
  date: { type: Date, required: true },
  coordinates: [{ latitude: Number, longitude: Number }],
  distance: { type: Number },
  duration: { type: Number },
  speed: { type: Number },
  heartRate: { type: Number },
  stepCount: { type: Number },
  caloriesBurned: { type: Number },
  posts: [{ type: mongoose.Schema.Types.ObjectId, ref: 'ActivityPost' }],
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  username: { type: String},
}, { timestamps: true });


const Activity = mongoose.model('Activity', activitySchema);

module.exports = Activity;
