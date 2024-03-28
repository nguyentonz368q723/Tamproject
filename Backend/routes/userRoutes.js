const express = require('express');
const User = require('../models/User');
const router = express.Router();
const bcrypt = require('bcrypt');
const saltRounds = 10;
const jwt = require('jsonwebtoken');

router.get('/', (req, res) => {
    res.send('User routes are working!');
});

router.post('/register', async (req, res) => {
    try {
        const { name, email, password, phonenumber } = req.body;
        const hashedPassword = await bcrypt.hash(password, saltRounds);
        const user = new User({
            name, 
            email, 
            password: hashedPassword, 
            phonenumber
        });
        await user.save();
        res.status(201).send({ message: "User registered successfully." });
    } catch (err) {
        res.status(500).send({ error: "An error occurred, please try again." });
    }
});



router.post('/login', async (req, res) => {
    try {
        const { name, password } = req.body; 
        const user = await User.findOne({ name }); 
        console.log('User found:', user);
        if (!user) {
            return res.status(401).send({ error: 'Login failed, check authentication credentials' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        console.log('Password match:', isMatch);
        if (!isMatch) {
            return res.status(401).send({ error: 'Login failed, check authentication credentials' });
        }
    } catch (err) {
        res.status(500).send({ error: 'Internal Server Error' });
    }
});


module.exports = router;
