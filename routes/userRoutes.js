const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/userSchema');
const authenticateToken = require('./authRoutes');
const userRouter = express()
const nodemailer = require('nodemailer');
const e = require('express');
/*  User registration and authentication 1.1
    Register a new user  
    User profile creation with details like name, age, weight, and fitness goals  1.2 */

// @url ; http://localhost:2000/register
userRouter.post('/register', async (req, res) => {
  try {
    const { username, email, password, name, age, weight, fitnessGoals, fitnessLevel } = req.body;

    if (!password) {
      return res.status(400).json({ message: 'Password is required' });
    }

    const existingUser = await User.findOne({ username });
    const existingEmail = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({ message: 'Username already exists' });
    } else if (existingEmail) {
      return res.status(400).json({ message: 'Email already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      username,
      email,
      password: hashedPassword,
      name,
      age,
      weight,
      fitnessGoals,
      fitnessLevel,
    });

    await newUser.save();
    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    console.log("ERROR: ", error);
    res.status(500).json({ message: 'Registration failed', error: error.message });
  }
});


// Login and generate a JWT token
//http://localhost:2000/login
userRouter.post('/login', async (req, res) => {
  const { username, password } = req.body;

  const user = await User.findOne({ username });

  if (!user) {
    return res.status(401).json({ message: 'User not Register' });
  }

  const passwordMatch = await bcrypt.compare(password, user.password);

  if (!passwordMatch) {
    return res.status(401).json({ message: 'Invalid password' });
  }
  const token = jwt.sign({ userId: user._id, username: user.username }, process.env.JWT_SECRET, { expiresIn: '30d' });
  user.token = token;
  await user.save();
  res.cookie('token', token, { httpOnly: true, expires: 0 });

  res.status(201).json({ message: 'User Login successfully', data: { Token: token, Data: user } });

});

/* Example route protected with JWT authentication
   @url:  http://localhost:2000/protected-route  
   Headers : key : Authorization  
*/
userRouter.get('/protected-route', authenticateToken, (req, res) => {
  res.json({ message: 'Protected route accessed by user: ' + req.user.userId });
});


module.exports = userRouter



userRouter.put('/set-fitness-goals', authenticateToken, async (req, res) => {
  try {
    const { fitnessGoals, progress } = req.body;
    const userId = req.user.userId;
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.fitnessGoals = fitnessGoals;
    user.progress = { ...user.progress, ...progress };

    await user.save();
    res.json({ message: 'Fitness goals and progress updated successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to update fitness goals', error: error.message });
  }
});

// Get fitness goals and progress for the authenticated user
userRouter.get('/get-fitness-goals', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.userId;
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const { fitnessGoals, progress } = user;
    res.json({ fitnessGoals, progress });
  } catch (error) {
    res.status(500).json({ message: 'Failed to retrieve fitness goals', error: error.message });
  }
});


userRouter.post('/forgot-password', async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email: email });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    // Generate a random OTP
    const otp = Math.floor(100000 + Math.random() * 900000);
    console.log("OTP", otp);

    // Save the OTP and its expiration time in the user document
    user.resetPasswordOTP = {
      code: otp,
      expires: Date.now() + 15 * 60 * 1000,
    };
    await user.save();

    // Create a Nodemailer transporter to send the OTP via email
    const transporter = nodemailer.createTransport({
      host: "smtp-relay.brevo.com",
      Service: 'Gmail',
      auth: {
        user: 'mitul.thummar@sensussoft.com',
        pass: 'zRQM97CUVcynOmL8',
      },
    });
    // Define the email data
    const emailData = {
      from: `usertest@gmail.com`,
      to: email,
      subject: 'Password Reset OTP',
      text: `Your OTP for password reset is: ${otp}`,
    };

    // Send the email
    await transporter.sendMail(emailData);

    return res.status(200).json({ message: 'OTP sent successfully' });
  } catch (error) {
    console.error('Error: ', error);
    res.status(500).json({ message: 'Failed to request password reset' });
  }
});

userRouter.post('/reset-password', async (req, res) => {
  try {
    const { otp, newPassword, email } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }


    if (!user.resetPasswordOTP || user.resetPasswordOTP.code !== otp) {
      return res.status(401).json({ message: 'Invalid OTP' });
    }

    if (user.resetPasswordOTP.expires < Date.now()) {
      return res.status(401).json({ message: 'OTP has expired' });
    }

    if (user.resetPasswordOTP && user.resetPasswordOTP.code === otp) {

      const hashedPassword = await bcrypt.hash(newPassword, 10);

      user.password = hashedPassword;

      user.resetPasswordOTP.code = null;
      user.resetPasswordOTP.expires = null;

      await user.save();

      res.status(200).json({ message: 'Password reset successful' });
    }
  } catch (error) {
    console.error('Error: ', error);
    res.status(500).json({ message: 'Failed to reset password' });
  }
});

// ------------------------------------------------------------------------------------
// userRouter.post('/send-email', (req, res) => {
//   const emailData = req.body;

//   const transporter = nodemailer.createTransport({
//     host: "smtp-relay.brevo.com",
//     Service: 'Gmail',
//     auth: {
//       user:'mitul.thummar@sensussoft.com',
//       pass: 'zRQM97CUVcynOmL8',
//     },
//   });
//   const mailOptions = {
//     from: 'mitulthummar007@gmail.com',
//     to: emailData.to,
//     subject: emailData.subject,
//     message : emailData.message
//   };
//   transporter.sendMail(mailOptions, (error, info) => {
//     if (error) {
//       console.error('Error sending email: ', error);
//       res.status(500).json({ message: 'Failed to send the email' });
//     } else {
//       console.log('Email sent: ', info.response);
//       res.status(200).json({ message: 'Email sent successfully' });
//     }
//   });
// });
