const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const jwt = require('jsonwebtoken');
const User = require('../models/usermodel');

// create new users
router.post('/newuser', async (req, res) => {
    try {
        const { username, password } = req.body;

        // Check if user already exists
        let user = await User.findOne({ username });

        if (user) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // Create new user
        user = new User({ username, password });

        // Save user to database
        await user.save();

        res.status(201).json({ message: 'User created successfully' });

    } catch (error) {
        console.error(error.message);
        res.status(500).json({ message: 'Server Error' });
    }
});
// create new users

// get all users
router.get('/userlist', async (req, res) => {
    try {
        const users = await User.find();
        res.json(users);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
})
// get all users

// authenticate user for further process
router.post('/authuser', async (req, res) => {
    try {
        const { username, password } = req.body;

        // Check if user exists
        let user = await User.findOne({ username });

        if (!user) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        console.log(password)
        console.log(user.password)

        // Check password
        const isMatch = password === user.password ? true : false

        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        // Create and return JWT token
        const payload = {
            user: {
                id: user.id
            }
        };

        jwt.sign(payload, 'jwtPlutosSecret', { expiresIn: '10h' }, (err, token) => {
            if (err) throw err;
            res.json({ token });
        });
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ message: 'Server Error' });
    }
});
// authenticate user for further process

// delete one user
router.delete('/delete/:id', async (req, res) => {
    try {

        const userId = req.params.id;

        // Check if the user ID is valid
        if (!mongoose.Types.ObjectId.isValid(userId)) {
            return res.status(400).json({ message: 'Invalid user ID' });
        }

        // Find user by ID and delete
        const deletedUser = await User.findByIdAndDelete(userId);

        // Check if the user exists
        if (!deletedUser) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.json({ message: 'User deleted successfully' });

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});
// delete one user


module.exports = router;