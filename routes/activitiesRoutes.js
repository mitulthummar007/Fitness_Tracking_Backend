const express = require('express');
const Activity = require("../models/activitySchema");
const authenticateToken = require('./authRoutes');
const activiesRouter = express()
const Geolib = require('geolib');
//@url : http://localhost:2000/add-activity
activiesRouter.post('/add-activity', async (req, res) => {
    try {
        const { type, coordinates, timestamp,username } = req.body;
        const activityData = calculateMetrics(coordinates);

        const activity = new Activity({
            type,
            coordinates,
            distance: activityData.distance,
            duration: activityData.duration,
            speed: activityData.speed,
            date: timestamp,
            // user: req.user.userId,
            username : username
        });

        await activity.save();

        return res.status(201).json({ message: 'Activity recorded successfully', data: activity });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: 'Activity recording failed', error });
    }
});

// Function to calculate metrics based on GPS coordinates
function calculateMetrics(coordinates) {
    let distance = 0;
    let duration = 0;

    for (let i = 1; i < coordinates.length; i++) {
        const prevCoord = coordinates[i - 1];
        const currCoord = coordinates[i];

        // Calculate distance between consecutive coordinates+
        distance += Geolib.getDistance(prevCoord, currCoord);

        // Calculate time difference in seconds
        duration += (currCoord.timestamp - prevCoord.timestamp) / 1000;
    }

    // Calculate speed (distance / duration)
    const speed = duration > 0 ? (distance / duration) : 0;

    return { distance, duration, speed };
}

// get particular user activities
activiesRouter.get('/user-activities', authenticateToken, async (req, res) => {
    try {
        const userId = req.user.userId;

        const activities = await Activity.find({ user: userId });
        if (activities.length === 0) {
            return res.status(404).json({ msg: "No Activities" })
        }

        return res.json({ data: activities });
    } catch (error) {
        return res.status(500).json({ message: 'Error fetching user activities', error });
    }
});
activiesRouter.get('get-activities',authenticateToken, async (req, res) => {
    try {
        const activities = await Activity.find().populate('user');

        if (activities.length === 0) {
            return res.status(404).json({ msg: "No Activities" });
        }

        return res.json({ data: activities });
    } catch (error) {
        return res.status(500).json({ message: 'Error fetching user activities', error });
    }
});  

activiesRouter.get('/user-activities-datewise', authenticateToken, async (req, res) => {
    try {
        const { fromDate, toDate } = req.query;

        // Check if fromDate and toDate parameters are provided
        if (!fromDate || !toDate) {
            return res.status(400).json({ message: 'Please provide both fromDate and toDate parameters.' });
        }

        const activities = await Activity.find({
            date: { $gte: new Date(fromDate), $lte: new Date(toDate) },
        }).populate('user');

        if (activities.length === 0) {
            return res.status(404).json({ msg: "No Activities in the specified date range" });
        }

        return res.json({ data: activities });
    } catch (error) {
        return res.status(500).json({ message: 'Error fetching activities within the date range', error });
    }
});

module.exports = activiesRouter