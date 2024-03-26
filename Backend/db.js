const mongoose = require('mongoose');

require('dotenv').config();

const MONGO_URL = process.env.MONGO_URL;
const DB_NAME = process.env.DB_NAME;

console.log("MONGO_URL:", MONGO_URL);

mongoose.connect(MONGO_URL, {
    dbName: DB_NAME,
    useNewUrlParser: true, 
    useUnifiedTopology: true
}).then(
    () => {
        console.log('Connected to database successfully.');
    }
).catch((err) => {
    console.log('Error connecting to database ' + err);
});

