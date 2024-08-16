// routes/authRoutes.js
const express = require('express');
const router = express.Router();
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Login route
router.post('/login', async (req, res) => {
    const { username, password } = req.body;

    try {
        // Find the user by username
        const user = await User.findOne({ username });
        if (!user) {
            console.log('User not found'); // Log if user is not found
            return res.status(401).json({ message: 'Invalid username credentials' });
        }
        if (user.status !== 'active') {
            console.log('Account is not active'); // Log if account is not active
            return res.status(401).json({ message: 'Your account has been deactivated, Please contact admin' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        

        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }


        // Generate OTP and update user
        const otp = '123456'; // Dummy OTP
        user.otp_code = otp;
        await user.save();
        console.log('OTP generated and saved:', otp); // Log OTP generation
        console.log(user.user_type)
        res.status(200).json({ message: 'OTP sent', userId: user._id , username: user.username , userType : user.user_type});
    } catch (error) {
        console.error('Error:', error); // Log any error
        res.status(500).json({ error: 'Server error' });
    }
});


// Verify OTP route
router.post('/verify-otp', async (req, res) => {
    const { userId, otp } = req.body;
    try {
        const user = await User.findById(userId);
        if (!user || user.otp_code !== otp) {
            return res.status(401).json({ message: 'Invalid OTP' });
        }

        // Mark OTP as verified
        user.otp_verified = true;
        user.otp_code = null; // Clear OTP after verification
        await user.save();

        // Generate JWT token
        const token = jwt.sign({ id: user._id }, 'your_jwt_secret', { expiresIn: '1h' });

        res.status(200).json({ message: 'OTP verified', userType:user.user_type, token });
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
});

module.exports = router;
