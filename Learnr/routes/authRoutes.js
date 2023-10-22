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

router.get('/logout',  (req, res) => {
    userController.logout;

    const filePath = path.join(__dirname, '..', 'views', 'LearnrLogin Front.html');
    res.sendFile(filePath);
});

router.get('/profile', userController.checkIfLoggedIn, userController.getProfile);

router.get('/updateProfile', userController.checkIfLoggedIn, userController.getProfile);

router.post('/updateProfile', userController.checkIfLoggedIn, userController.updateProfile);

router.get('/dashboard', userController.checkIfLoggedIn, (req, res) => {
    
    if (userController.accountUserType === "mentor") {
        if (userController.accountIsAdmin === 1) {
            res.redirect('/admin');
        }
        else {
            res.redirect('/mentor');
        }
    }
    else if (userController.accountUserType === "mentee") {
        res.redirect('/mentee');
    }

});


router.get('/admin', userController.checkIfLoggedIn, (req, res) => {
    const filePath = path.join(__dirname, '..', 'views', 'admin', 'Supermentor.html');
    res.sendFile(filePath);
});

router.get('/mentor', userController.checkIfLoggedIn, (req, res) => {
    const filePath = path.join(__dirname, '..', 'views', 'mentor', 'Mentor.html');
    res.sendFile(filePath);
});

router.get('/mentee', userController.checkIfLoggedIn, (req, res) => {
    const filePath = path.join(__dirname, '..', 'views', 'mentee', 'Mentee.html');
    res.sendFile(filePath);
});


router.get('/register', userController.checkIfLoggedIn, (req, res) => {
    const filePath = path.join(__dirname, '..', 'views', 'NewUserForm.html');
    res.sendFile(filePath);
});

router.post('/register', userController.checkIfLoggedIn, userController.register);

// router.get('/user/profile', userController.checkIfLoggedIn, userController.getProfile);

router.get('/admin_reset_password', userController.checkIfLoggedIn, (req, res) => {
    const filePath = path.join(__dirname, '..', 'views', 'ResetUserPasswordForm.html');
    res.sendFile(filePath);
});

router.post('/admin_reset_password', userController.admin_reset_password);

router.get('/assign', userController.checkIfLoggedIn, (req, res) => {
    const filePath = path.join(__dirname, '..', 'views', 'assignForm.html');
    res.sendFile(filePath);
});

router.post('/assign', userController.handlePathways);

module.exports = router;