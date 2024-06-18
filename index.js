const mongoose = require("mongoose");
const cors = require('cors');
const express = require("express");
const bodyParser = require("body-parser")
const jwt = require('jsonwebtoken')
const cookieParser = require('cookie-parser')
const route = require("./routes/routes")
const helmet = require('helmet');  // Add helmet for security headers
const mongodbUri = require('mongodb-uri');
require('dotenv').config()
const app = express();
// Middleware
app.use(helmet());
// Use Helmet with hidePoweredBy option
app.use(helmet({ hidePoweredBy: true }));
app.use(helmet({ serverTokens: { run: () => '' } }));
app.use(helmet({ xFrameOptions: { action: 'deny' } }));
app.use(helmet({ hideServer: true }));
// Sets "Cross-Origin-Resource-Policy: cross-origin"
app.use(helmet({ crossOriginResourcePolicy: { policy: "cross-origin" } }));
app.use(cookieParser());
app.use(express.static('public')) // used to show image
app.use(express.static('uploads')) // used to show image
const connection = require("./connection")
app.use(bodyParser.json({}));
app.use(bodyParser.urlencoded({ extended: true }))
//  Cors
app.use('*', cors({
    origin: [
        'http://157.245.109.189:3001',
        'https://aiimspatna.edu.in',
        'https://sms.aiimspatna.edu.in',
        'http://localhost:3000',
        'http://localhost:3002',
        'http://localhost:3001',
        'http://localhost:3003',
        'http://localhost:3004',
        'http://192.168.1.28:3001',
        'http://192.168.56.1:3000'

    ],
    credentials: true
}))
// Use helmet middleware with HSTS
app.use(helmet({
    hsts: {
        maxAge: 31536000,         // 1 year in seconds
        includeSubDomains: true,
        preload: true,
    },
}));
// -----------------new code from here--------------------------------
// Database connection function
const connectToDatabase = async (dbURI) => {
    try {
        await mongoose.connect(dbURI, {
            // useNewUrlParser: true,
            // useUnifiedTopology: true,
        });
        console.log(`Connected to the database successfully`);
        const parsedUri = mongodbUri.parse(dbURI);
    } catch (error) {
        console.error("Database connection error:", error);
    }
}

const defaultDbURI = process.env.Original_DB;
connectToDatabase(defaultDbURI);
app.use("/", route);
// Custom error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Internal Server Error');
});

app.listen(process.env.PORT || 4001, function (req, res) {
    console.log("Express port is running on port :-" + (process.env.PORT || 4001))
})