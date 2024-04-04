const User = require('../models/User');
const bcrypt = require('bcryptjs');

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
      res.status(201).json({ user });
    }  catch (error) {
      res.status(400).json({ message: error.message });
    }
}

exports.login = async (req, res) => {
    const { name, password } = req.body;
    const user = await User.findOne({ name });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }
    
    res.status(200).json({ user, token });
  };