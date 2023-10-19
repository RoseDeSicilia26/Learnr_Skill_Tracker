// Import required modules
const express = require('express');
const bodyParser = require('body-parser');
const authRoutes = require('./routes/authRoutes');
const userModel = require('./models/userModel');

// Create the Express app
const app = express();

// Middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Define routes
app.use('/assign', authRoutes);

document.getElementById('assign-form').addEventListener('submit', function (e) {
    e.preventDefault();

    // Get user input
    const pathwayID = document.getElementById('pathwayID').value;
    const menteeUSername = document.getElementById('menteeUsername').value;
    const step = document.getElementById('step').value;

    // Call the login function in your controller
    userController.handlePathways(pathwayID, skill, menteeUSername, step);
});

