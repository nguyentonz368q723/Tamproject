const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const userRoutes = require('./routes/userRoutes');
const taskRoutes = require('./routes/taskRoutes');
const path = require('path');
const session = require('express-session');

require('dotenv').config();
require('./db');
const PORT = 8000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(session({
    secret: 'your_secret_key',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }
}));
app.use('/users', userRoutes);
app.use('/tasks', taskRoutes);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Render home page
app.get('/', (req, res) => {
    res.render('home');
});

// Render login page
app.get('/login', (req, res) => {
    res.render('login');
});

// Render register page
app.get('/users/register', (req, res) => {
    res.render('register');
});


// Middleware to check if user is authenticated
function isAuthenticated(req, res, next) {
    if (req.session.user) {
        return res.redirect('/dashboard');
    } else {
        return res.redirect('/login');
    }
}


// Render dashboard page if user is authenticated
app.get('/dashboard', isAuthenticated, async (req, res) => {
    try {
        // Assuming you have a Task model defined and can fetch tasks from MongoDB
        const Task = require('./models/Task');

        // Fetch tasks from database
        const tasks = await Task.find({ userId: req.session.user._id }).exec();

        // Render dashboard view with user and tasks data
        res.render('dashboard', { user: req.session.user, tasks });
    } catch (error) {
        console.error('Error fetching tasks:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Handle user logout
app.get('/logout', (req, res) => {
    req.session.destroy(err => {
        if (err) {
            return console.log(err);
        }
        res.redirect('/login');
    });
});

// Set Cache-Control header to 'no-store' for all responses
app.use((req, res, next) => {
    res.header('Cache-Control', 'no-store');
    next();
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err);
    res.status(500).json({ error: 'Internal Server Error' });
});
  
// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}.`);
});
