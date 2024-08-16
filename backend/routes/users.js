const express = require('express');
const router = express.Router();
const User = require('../models/User');
const bcrypt = require('bcryptjs');

// GET all users
router.get('/', async (req, res) => {
    try {
        const users = await User.find();
        res.json(users);
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
});

// POST new user
router.post('/', async (req, res) => {
    const { username, password, userType, email_id, mobile_no } = req.body;
    try {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        const newUser = new User({
            username,
            password: hashedPassword, // Ensure to hash passwords before storing
            user_type: userType,
            email_id,
            mobile_no
        });
        await newUser.save();
        res.status(201).json(newUser);
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
});

router.delete('/:id', async (req, res) => {
    try {
        const userId = req.params.id;
        const result = await User.findByIdAndDelete(userId);

        if (!result) {
            return res.status(404).json({ error: 'User not found' });
        }

        res.status(200).json({ message: 'User deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
});
router.put('/:id', async (req, res) => {
    const userId = req.params.id;
    const { status } = req.body; // Expecting { status: 'active' | 'inactive' }

    try {
        // Validate status value
        if (status !== 'active' && status !== 'inactive') {
            return res.status(400).json({ error: 'Invalid status value' });
        }

        const updatedUser = await User.findByIdAndUpdate(
            userId,
            { status },
            { new: true, runValidators: true } // Return the updated document and run validation
        );

        if (!updatedUser) {
            return res.status(404).json({ error: 'User not found' });
        }

        res.status(200).json(updatedUser);
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
});

module.exports = router;
