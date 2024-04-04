const express = require('express');
// const User = require('../models/User');
const userController = require('../controller/userController');
const router = express.Router();
// const bcrypt = require('bcrypt');
// const saltRounds = 10;
// const jwt = require('jsonwebtoken');
router.get('/', (req, res) => {
    res.send('User routes are working!');
});

router.post("/register", userController.register);
router.post("/login", userController.login);




// router.post('/register', async (req, res) => {
//     try {
//         const { name, email, password, phonenumber } = req.body;
//         const hashedPassword = await bcrypt.hash(password, saltRounds);
//         const user = new User({
//             name, 
//             email, 
//             password: hashedPassword, 
//             phonenumber
//         });

//         const isMatch = await bcrypt.compare(password, hashedPassword);
//         console.log('isMatch', isMatch);

//         await user.save();
//         res.status(201).send({ message: "User registered successfully.", user });
//     } catch (err) {
//         res.status(500).send({ error: "An error occurred, please try again." });
//     }
// });



// router.post('/login', async (req, res) => {
//     try {
//      console.log("User: " , req.body);
//      const { name, password } = req.body;
//      const user = await User.findOne({ name });
//      console.log('user does not exist', user);
//      console.log(user.password);
//      console.log(password);
//      if(!user){
//         // console.log("Anh Ton cao toc");
//         // throw new Error('Unable to login, invalid credentials');
         
//      }
 
//      const isMatch = await bcrypt.compare(password, user.password);
//      console.log('isMatch', isMatch);
//      if(!isMatch){
//         //  throw new Error('Unable to login, invalid credentials');
//         //  console.log("Anh Ton khong cao toc");
//      }
//      req.session.user = user; 
//     }
//      catch (err) {
//          console.error(err);
//          res.status(400).send({ error: err.message });
//      }
//   });



module.exports = router;
