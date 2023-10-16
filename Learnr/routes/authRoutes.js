//File responsible for handling routes between other files.

const express = require('express');
const userController = require('../controllers/userController');
const router = express.Router();
const path = require('path');

router.get('/', (req, res) => {
    const filePath = path.join(__dirname, '..', 'views', 'LearnrLogin Front.html');
    res.sendFile(filePath);
});

router.post('/login', userController.login);


router.get('/admin', (req, res) => {
    const filePath = path.join(__dirname, '..', 'views', 'admin', 'Supermentor.html');
    res.sendFile(filePath);
});

router.get('/mentor', (req, res) => {
    const filePath = path.join(__dirname, '..', 'views', 'mentor', 'Mentor.html');
    res.sendFile(filePath);
});

router.get('/mentee', (req, res) => {
    const filePath = path.join(__dirname, '..', 'views', 'mentee', 'Mentee.html');
    res.sendFile(filePath);
});

router.get('/default', (req, res) => {
    res.send('<h1>Default Dashboard</h1>');
});

router.get('/register', (req, res) => {
    const filePath = path.join(__dirname, '..', 'views', 'NewUserForm.html');
    res.sendFile(filePath);
});

router.post('/register', userController.register);

router.get('/profile', (req, res) => {
    const filePath = path.join(__dirname, '..', 'views', 'Profile.html');
    res.sendFile(filePath);
});

router.get('/user/profile', userController.getProfile);




router.get('/admin_reset_password', (req, res) => {
    const filePath = path.join(__dirname, '..', 'views', 'ResetUserPasswordForm.html');
    res.sendFile(filePath);
});

router.post('/admin_reset_password', userController.admin_reset_password);

router.get('/assign', (req, res) => {
    const filePath = path.join(__dirname, '..', 'views', 'assignForm.html');
    res.sendFile(filePath);
});

router.post('/assign', userController.handlePathways);

module.exports = router;