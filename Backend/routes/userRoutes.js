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
        res.status(201).send({ message: "User registered successfully.", user });
    } catch (err) {
        res.status(500).send({ error: "An error occurred, please try again." });
    }
});



router.post('/login', async (req, res) => {
    try {
     console.log("User: " , req.body);
     const { name, password } = req.body;
     const user = await User.findOne({ name });
 
     if(!user){
         throw new Error('Unable to login, invalid credentials');
     }
 
     const isMatch = await bcrypt.compare(password, user.password);
 
     if(!isMatch){
         throw new Error('Unable to login, invalid credentials');
     }
     req.session.user = user; 
     res.redirect('/dashboard');
    }
     catch (err) {
         console.error(err);
         res.status(400).send({ error: err.message });
     }
  });


module.exports = router;
