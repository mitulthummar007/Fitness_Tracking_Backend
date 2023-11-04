const express = require('express');
const activityPostTable = require('../models/social/activityPostSchema ');
const authenticateToken = require('./authRoutes');
const activities_post = express.Router();

// Create a new activity post
activities_post.post('/create-activity-post',authenticateToken,async (req, res) => {
  try {
    const { activityId, content } = req.body;
    const userId = req.user.userId;
    const newActivityPost = new activityPostTable({
      user: userId, // Associate the post with the author (User)
      activity: activityId, // Associate the post with the activity
      comments: [],
      likes: [],
      content,
    });

    await newActivityPost.save();

    res.status(201).json({ message: 'Activity post created successfully', data: newActivityPost });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to create an activity post', error });
  }
});

activities_post.post('/like-activity-post', authenticateToken, async (req, res) => {
  try {
    const { activityPostId } = req.body;
    const userId = req.user.userId;

    const activityPost = await activityPostTable.findById(activityPostId);

    if (!activityPost) {
      return res.status(404).json({ message: 'Activity post not found' });
    }

    const userAlreadyLiked = activityPost.likes.some(like => like && like.user && like.user.toString() === userId);

    if (userAlreadyLiked) {
      return res.status(400).json({ message: 'Activity post already liked by the user' });
    }

    activityPost.likes.push({ user: userId });
    await activityPost.save();
    res.json({ message: 'Activity post liked successfully', data: activityPost });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Failed to like the activity post', error });
  }
});


activities_post.post('/comment-activity-post', authenticateToken, async (req, res) => {
  try {
    const { activityPostId, content } = req.body;
    const userId = req.user.userId;

    const activityPost = await activityPostTable.findById(activityPostId);

    if (!activityPost) {
      return res.status(404).json({ message: 'Activity post not found' });
    }
    if (content.trim() === '') {
      return res.status(400).json({ message: 'Comment cannot be empty' });
    }
    const newComment = {
      user: userId,
      content,
    };

    activityPost.comments.push(newComment);
    await activityPost.save();

    res.status(201).json({ message: 'Comment added to the activity post successfully', data: newComment });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to add a comment to the activity post', error });
  }
});

module.exports = activities_post;
