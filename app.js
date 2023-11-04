const express = require('express');
const app = express();
const dotenv = require('dotenv');
const gpsParser = require('./gps');
const activiesRouter = require('./routes/activitiesRoutes');
const userRouter = require('./routes/userRoutes');
const add_health_metrics = require('./routes/user_health_metrics');
const { workoutplan, workoutRecommendationsRouter } = require('./routes/Workout_Plans_Router');
const nutritionRouter = require('./routes/nutritionRoutes');
const ejs = require("ejs")
const path = require("path")
const cookieParser = require('cookie-parser');
const activities_post = require('./routes/post_activities');
const goalSet = require('./routes/goalSetRouter');
const Activity = require('./models/activitySchema');
const User = require('./models/userSchema');

dotenv.config({
  path: "./.env"
});
require("./config/db")

app.use(express.json());
app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, 'views'));

app.get('/', (req, res) => {
  res.render('dashboard', { message: '' });
});
app.get('/register', (req, res) => {
  res.render('register', { message: '' });
});


app.get('/login', (req, res) => {
  res.render('login', { message: '' });
});
app.get('/forgot-password', (req, res) => {
  res.render('forgot-password', { message: '' });
});
app.get('/reset-password', (req, res) => {
  res.render('reset-password', { message: '' });
});
app.get('/login', (req, res) => {
  res.render('login', { message: '' });
});
app.get('/dashboard', (req, res) => {
  res.render('dashboard', { message: '' });
});
app.get('/about', (req, res) => {
  res.render('about', { message: '' });
});
app.get('/add-activities', (req, res) => {
  res.render('add-activities', { data: {} }); 
});

app.get('/get-user-activities', async (req, res) => {
  const { username } = req.query; // Get the username entered in the form

  try {
    // Search for the user based on the entered username
    const user = await User.findOne({ username });

    if (user) {
      res.render('get-user-activities', { data: user });
    } else {
      res.render('get-user-activities', { data: null });
    }
  } catch (error) {
    return res.status(500).json({ message: 'Error fetching user activities', error });
  }
});



app.get('/get-activities', async (req, res) => {
  try {
    const activities = await Activity.find().populate()

    if (activities.length === 0) {
      return res.status(404).json({ message: "No Activities for this user" });
    }
    res.render('get-activities', { data: activities });
  } catch (error) {
    return res.status(500).json({ message: 'Error fetching user activities', error });
  }
});

app.use("/", userRouter)
app.use("/", activiesRouter)
app.use("/", add_health_metrics)
app.use("/", workoutplan)
app.use("/", workoutRecommendationsRouter)
app.use("/", nutritionRouter)
app.use("/", activities_post)
app.use(cookieParser());
app.use(express.static('public'));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port http://localhost:${PORT}`);
});


