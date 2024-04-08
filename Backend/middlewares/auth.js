const jwt = require('jsonwebtoken');
const User = require('../models/User');

    const auth = async (req, res, next) => {
        try {
            const authHeader = req.header('Authorization');
                if (!authHeader || !authHeader.startsWith('Bearer ')) {
                    throw new Error('Authorization token is missing or invalid');
                }
                const token = authHeader.replace('Bearer ', '');
                const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
        
                const user = await User.findOne({
                    _id: decoded._id,
                });
                console.log("User found");
        
                if (!user) {
                    throw new Error('Unable to login, invalid credentials');
                }
        
                req.user = user;
                req.token = token;
                next();
        
            } catch (error) {
                res.status(401).send({ error: error.message });
            }
        };


module.exports = auth;