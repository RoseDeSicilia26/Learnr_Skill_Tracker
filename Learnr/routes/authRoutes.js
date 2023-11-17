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

router.get('/skill_tracker', userController.checkIfLoggedIn,  (req, res) => {

  const filePath = path.join(__dirname, '..', 'views', 'mentee', 'user_skill_tracker.html');
  res.sendFile(filePath);
});

router.get('/pathways/pathway_:courseId', userController.checkIfLoggedIn, userController.getPathwayData);

router.get('/profile', userController.checkIfLoggedIn, userController.getProfile);

router.post('/updateProfile', userController.checkIfLoggedIn, userController.updateProfile);

router.get('/dashboard', userController.checkIfLoggedIn, userController.getUserDashboard);

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

router.get('/user/profile', userController.getProfile);

router.get('/admin_reset_password', userController.checkIfLoggedIn, userController.validateRoute('admin'), (req, res) => {
    const filePath = path.join(__dirname, '..', 'views', 'ResetUserPasswordForm.html');
    res.sendFile(filePath);
});

router.post('/admin_reset_password', userController.admin_reset_password);

router.get('/assign', userController.checkIfLoggedIn, userController.assign);

router.post('/assignPathway',  userController.checkIfLoggedIn, userController.assignPathway);

router.get('/disablePathways', userController.checkIfLoggedIn, (req, res) => {
  userController.getPathways({ body: 0 }, res);
});

router.post('/removePathway', userController.checkIfLoggedIn, userController.removePathway);

router.get('/enablePathways', userController.checkIfLoggedIn, (req, res) => {
  userController.getPathways({ body: 1 }, res);
});

router.post('/enable', userController.checkIfLoggedIn, userController.enablePathway);

router.get('/updateProgress', userController.checkIfLoggedIn, userController.getMentees);

router.post('/updatePathways', userController.checkIfLoggedIn, userController.updatePathways);

router.post('/updateStep', userController.checkIfLoggedIn, userController.updateStep);

router.post('/getMenteePathways', userController.checkIfLoggedIn, userController.getUserPathways);

router.get('/createPathway', userController.checkIfLoggedIn, (req, res) => {
    const filePath = path.join(__dirname, '..', 'views', 'createPathwayForm.html');
    res.sendFile(filePath);
});

router.post('/create', userController.checkIfLoggedIn, userController.createPathway);

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