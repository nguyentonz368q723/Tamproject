const express = require('express');
// const User = require('../models/User');
const userController = require('../controller/userController');
const router = express.Router();

router.get('/', (req, res) => {
    res.send('User routes are working!');
});

router.post("/register", userController.register);
router.post("/login", userController.login);

module.exports = router;
