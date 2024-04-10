const User = require('../models/User');
const bcrypt = require('bcryptjs');
const { response } = require('express');
const jwt = require('jsonwebtoken');
exports.register = async (req, res) => {
  try {
    const { name, email, password, phonenumber } = req.body;

    // check if user exists
    const isExists = await User.findOne({ name });
    if (isExists) {
      res.status(400);
      throw new Error("User is exist");
    }

    // hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({ name, email, password: hashedPassword, phonenumber });

    await user.save();
    res.status(201).json({ name: user.name, password: user.hashedPassword, email: user.email, phonenumber: user.phonenumber });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
}

// exports.login = async (req, res) => {
//   const { name, password } = req.body;

//   try {
//       const user = await User.findOne({ name });
//       if (!user) {
//           return res.status(404).json({ message: "User not found" });
//       }
//       const isMatch = await bcrypt.compare(password, user.password);
//       if (!isMatch) {
//           return res.status(400).json({ message: "Invalid credentials" });
//       }
//       const token = jwt.sign({ userId: user._id }, 'your_secret_key', { expiresIn: '1y' });
//       res.status(200).json({ 
//         name: user.name, 
//         token, 
//         password: user.hashedPassword, 
//         email: user.email, 
//         id: user._id,
//         phonenumber: user.phonenumber,
//         redirectUrl: './dashboard'
//       });
//       res.render('../views/dashboard.ejs');

//   } catch (error) {
//       console.error('Login error:', error);
//       res.status(500).json({ message: "Internal server error" });
//   }
// };

exports.login = async (req, res) => {
  const { name, password } = req.body;

  try {
    const user = await User.findOne({ name });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign({ userId: user._id }, 'your_secret_key', { expiresIn: '1y' });

    res.status(200).json({ redirectUrl: '../views/dashboard' });
    // Redirect to dashboard view
    // res.render('../views/dashboard');

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: "Internal server error" });
  }
};