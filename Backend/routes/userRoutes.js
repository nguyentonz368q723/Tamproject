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
        if (!email || !password) throw new Error('Email and password are required');
        
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            throw new Error('Email already in use');
        }

        const hashedPassword = await bcrypt.hash(password, saltRounds);
        const user = new User({ name, email, password: hashedPassword, phonenumber });
        await user.save();
        res.status(201).send({ message: "User account was created successfully" });
    } catch (err) {
        res.status(400).send({ error: err.message });
    }
        });

router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user) {
            throw new Error('Invalid login credentials');
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            throw new Error('Invalid login credentials');
        }

        // Thay vì gửi token, set token vào cookie và redirect người dùng
        const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET_KEY, { expiresIn: '30d' });

        // Set token vào cookie với tên 'auth_token'
        res.cookie('auth_token', token, { httpOnly: true, sameSite: 'strict' });

        // Redirect người dùng đến trang dashboard
        res.redirect('/dashboard');
    } catch (err) {
        res.status(400).send({ error: err.message });
    }
 });

module.exports = router;