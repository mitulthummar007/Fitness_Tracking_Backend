const { default: mongoose } = require("mongoose");


const activityPostSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    content: { type: String,required : true },
    comments: [{ user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, content: String }],
    likes: [{ user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' } }],
    timestamp: { type: Date, default: Date.now },
  });   

const activityPostTable = mongoose.model('activityPost',activityPostSchema)
module.exports = activityPostTable