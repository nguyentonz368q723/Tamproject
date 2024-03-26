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
    secret: 'your_secret_key', // Thay 'your_secret_key' bằng một giá trị bí mật thực tế
    resave: false,
    saveUninitialized: true,
    cookie: { secure: !true } // Đặt 'secure: true' nếu bạn đang sử dụng HTTPS
  }));
app.use('/users', userRoutes);
app.use('/tasks', taskRoutes);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.get('/', (req, res) => {
    res.render('home');
});
app.get('/login', (req, res) => {
    res.render('login');
    // res.redirect('login');
});
app.get('/users/register', (req, res) => {
    res.render('register');
    // res.redirect('register');
});
function isAuthenticated(req, res, next) {
    if (!req.session.user) {
        return res.redirect('/login');
    }
    next();
}
app.get('/dashboard', isAuthenticated, (req, res) => {
    res.render('dashboard', { user: req.session.user, tasks: [] });
});

app.use('/tasks', taskRoutes);

app.get('/logout', (req, res) => {
    req.session.destroy(err => {
        if(err) {
            return console.log(err);
        }
        res.redirect('/login');
    });
});
app.use((req, res, next) => {
    res.header('Cache-Control', 'no-store');
    next();
  });
  

// Middleware đơn giản để log lỗi
app.use((err, req, res, next) => {
    console.error(err);
    res.status(500).json({ error: 'Internal Server Error' });
  });
  
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}.`);
});