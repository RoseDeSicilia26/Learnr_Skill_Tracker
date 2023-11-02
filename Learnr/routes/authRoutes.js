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

router.get('/management', userController.checkIfLoggedIn, (req, res) => {
    // Assuming that your user account information is properly set before calling redirectToPage
    // You can set this.accountUserType and this.accountIsAdmin appropriately based on your user data
  
    if (userController.accountUserType == "mentor") {
      if (userController.accountIsAdmin == 1) {
        const filePath = path.join(__dirname, '..', 'views', 'admin', 'supermentor-management.html');
        res.sendFile(filePath);
      } else {
        const filePath = path.join(__dirname, '..', 'views', 'mentor', 'mentor-management.html');
        res.sendFile(filePath);
      }
    } else {
      res.status(404).send("User type not recognized");
    }
});

router.get('/profile', userController.checkIfLoggedIn, userController.getProfile);

router.get('/updateProfile', userController.checkIfLoggedIn, userController.getProfile);

router.post('/updateProfile', userController.checkIfLoggedIn, userController.updateProfile);

router.get('/dashboard', userController.checkIfLoggedIn, (req, res) => {
  // Assuming that your user account information is properly set before calling redirectToPage
  // You can set this.accountUserType and this.accountIsAdmin appropriately based on your user data

  if (userController.accountUserType == "mentor") {
    if (userController.accountIsAdmin == 1) {
      const filePath = path.join(__dirname, '..', 'views', 'admin', 'supermentor-home.html');
      res.sendFile(filePath);
    } else {
      const filePath = path.join(__dirname, '..', 'views', 'mentor', 'mentor-home.html');
      res.sendFile(filePath);
    }
  } else if (userController.accountUserType == "mentee") {
    const filePath = path.join(__dirname, '..', 'views', 'mentee', 'mentee-home.html');
    res.sendFile(filePath);
  }
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