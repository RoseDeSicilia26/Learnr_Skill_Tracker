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

router.get('/dashboard', userController.checkIfLoggedIn, userController.redirectToPage);

router.get('/admin', userController.checkIfLoggedIn, userController.validateRoute('admin'), (req, res) => {
    const filePath = path.join(__dirname, '..', 'views', 'admin', 'Supermentor.html');
    res.sendFile(filePath);
});

router.get('/mentor', userController.checkIfLoggedIn, userController.validateRoute('mentor'), (req, res, next) => {
        const filePath = path.join(__dirname, '..', 'views', 'mentor', 'Mentor.html');
        res.sendFile(filePath);
});

router.get('/mentee', userController.checkIfLoggedIn, userController.validateRoute('mentee'), (req, res) => {
        const filePath = path.join(__dirname, '..', 'views', 'mentee', 'Mentee.html');
        res.sendFile(filePath);
});

router.get('/register', userController.checkIfLoggedIn, userController.validateRoute('admin'), (req, res) => {
    const filePath = path.join(__dirname, '..', 'views', 'NewUserForm.html');
    res.sendFile(filePath);
});

router.post('/register', userController.checkIfLoggedIn, userController.register);

router.get('/profile', (req, res) => {
    const filePath = path.join(__dirname, '..', 'views', 'Profile.html');
    res.sendFile(filePath);
});

router.get('/user/profile', userController.getProfile);

router.get('/admin_reset_password', userController.checkIfLoggedIn, userController.validateRoute('admin'), (req, res) => {
    const filePath = path.join(__dirname, '..', 'views', 'ResetUserPasswordForm.html');
    res.sendFile(filePath);
});

router.post('/admin_reset_password', userController.admin_reset_password);

router.get('/assign', userController.checkIfLoggedIn, (req, res) => {
    const filePath = path.join(__dirname, '..', 'views', 'assignForm.html');
    res.sendFile(filePath);
});

router.post('/assign', userController.handlePathways);

router.get('/msal', userController.msalLogin);

router.get('/msal', (req, res) => {
    const authCodeUrlParameters = {
      scopes: ['User.Read'],
      redirectUri: 'http://localhost:3000/auth/callback', // This should match your app registration
    };
  
    pca.getAuthCodeUrl(authCodeUrlParameters).then((url) => {
      res.redirect(url);
    }).catch((error) => {
      console.log(error);
      res.status(500).send('Unable to start Microsoft authentication');
    });
  });

module.exports = router;