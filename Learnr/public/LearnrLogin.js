// Import required modules
const express = require('express');
const bodyParser = require('body-parser');
const authRoutes = require('./routes/authRoutes');
const userModel = require('./models/userModel');

// // Create the Express app
// const app = express();

// // Middleware
// app.use(bodyParser.urlencoded({ extended: false }));
// app.use(bodyParser.json());

// // Define routes
// app.use('/', authRoutes);

document.getElementById('loginForm').addEventListener('submit', function (e) {
    e.preventDefault();

    // Get user input
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    // Call the login function in your controller
    userController.login(email, password);
});

