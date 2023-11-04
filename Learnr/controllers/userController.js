//Controller for users. Handles communication between the user views and user models.
const userModel = require('../models/userModel');
const pathwayModel = require('../models/pathwaysModel');
const ejs = require('ejs'); // Import the EJS module
const path = require('path'); // Import the path module
const express = require('express');
const res = express.response;
const app = express();
app.use(express.static('public'));

exports.accountEmail = ''; //Global variable used to keep track of which user is currently logged in.
exports.accountUserType = '';
exports.accountIsAdmin = 0;

exports.handlePathways = (req, res) => {
    var skill;
    const {pathwayID, menteeEmail, step} = req.body;
    pathwayModel.getPathwaySkill(pathwayID, (pathwaySkill) => {
        skill = pathwaySkill;
    pathwayModel.validatePathwayID(pathwayID, (validation) => {
        if (validation) {
            userModel.validateEmail(menteeEmail, (result) => { //Checks to see if the desired mentee exists within the database.
                if (result){
                    pathwayModel.checkPathway(pathwayID, menteeEmail, (found) =>{ //Checks to see if the mentee-pathway combination already exists.
                        if (found){ //Mentee-Pathway combination exists
                            res.send(`
                                    This mentee already has this pathway. Please select another.
                                    <br><br>
                                    <button onclick="window.location.href='/dashboard'">Go Back</button>
                            `);
                        }
                        else {
                            pathwayModel.addPathway(pathwayID, menteeEmail, step, (err) =>{ //If the combination does not exist, write to the csv file to assign the desired mentee the desired pathway.
                                if (err) {
                                    console.error('Error writing to the CSV file.', err);
                                    res.status(500).send('Internal Server Error');
                                } 
                                else {
                                    res.send(`
                                        New pathway assigned successfully!
                                        <br><br>
                                        <button onclick="window.location.href='/dashboard'">Return to Dashboard</button>
                                        <button onclick="window.location.href='/assign'">Assign a new pathway</button>
                                    `);
                                }
                            });
                        }
                    })
                }
                else {
                    res.send(`
                        This mentee does not exist.
                        <br><br>
                        <button onclick="window.location.href='/mentor'">Go Back</button>
                    `);
                }

            })
        }
        else {
            res.send(`
                    This pathway does not exist.
                    <br><br>
                    <button onclick="window.location.href='/mentor'">Go Back</button>
            `);
        }
    })
    });
}

//Logs in the user by checking their information against the csv file and redirecting them to the appropriate page based on the type of permission in the file.
exports.login = (req, res) => { 
    const {email, password} = req.body;
    userModel.checkUser(email, password, (result) => {
        if (result){
            this.accountEmail = email;
            this.accountUserType = result.userType;
            this.accountIsAdmin = result.isAdmin;
            res.redirect("/dashboard");
        }
        else {
            res.redirect('/?error=Invalid%20Credentials');
        }
    });
}

//reset values
exports.logout = (req, res) => {
    this.accountEmail = ''; 
    this.accountUserType = '';
    this.accountIsAdmin = 0;
}

exports.getProfile = (req, res) => {
    // Fetch user data based on logged-in user.
    userModel.getUserData(this.accountEmail, (userData) => {
        if (userData) {

            var filePath;
            if (this.accountUserType == "mentor") {
                if (this.accountIsAdmin == 1) {
                    filePath = path.join(__dirname, "..", "views", "admin", "supermentor-profile.ejs");
                } else {
                    filePath = path.join(__dirname, "..", "views", "mentor", "mentor-profile.ejs");
                }
            } else {
                filePath = path.join(__dirname, "..", "views", "mentee", "mentee-profile.ejs");
            }
            
            // Render the EJS template with dynamic data
            ejs.renderFile(filePath, { userData }, (err, html) => {
                if (err) {
                    console.error('Error rendering EJS template', err);
                    res.status(500).send('Internal Server Error');
                } else {
                    res.send(html); // Send the rendered HTML
                }
            });
        }
    });
};

exports.getUserDashboard = (req, res) => {

    if (this.accountUserType == "mentor") {
        if (this.accountIsAdmin == 1) {
            var filePath = path.join(__dirname, "..", "views", "admin", "supermentor-home.html");
            res.sendFile(filePath);
        } else {
            var filePath = path.join(__dirname, "..", "views", "mentor", "mentor-home.html");
            res.sendFile(filePath);
        }
    } else {
        pathwayModel.getUserPathways(this.accountUsername, (userData) => {
            if (userData) {
                
                var filePath;
                filePath = path.join(__dirname, "..", "views",  "mentee", "user_pathways_tracker.ejs");
                
                // Render the EJS template with dynamic data
                ejs.renderFile(filePath, { userData }, (err, html) => {
                    if (err) {
                        console.error('Error rendering EJS template', err);
                        res.status(500).send('Internal Server Error');
                    } else {
                        res.send(html); // Send the rendered HTML
                    }
                });
            }
        });
    }
    
}


exports.verifyIsAmin = (req, res) => {

    if (this.accountUserType == "mentor" && this.accountIsAdmin == 1) {
        res = true;
    } else {
        res = false;
    }
}



exports.updateProfile = (req, res) => {
    const { firstName, lastName, position, bio, school, interests } = req.body;
    userModel.validateEmail(this.accountEmail, (exists) => {
        if(exists) {
            userModel.updateProfile(this.accountEmail, firstName, lastName, position, bio, school, interests, (success) => {
                if(success){
                    res.redirect("/profile");
                }
                else {
                    res.send(`
                        <p>Error updating profile!</p>
                        <div>
                        <button onclick="window.location.href='/dashboard'" style="background-color: white; color: black;">Return to Dashboard</button>
                        <button onclick="window.location.href='/profile'" style="background-color: green; color: white;">Return to Profile</button>
                        </div>
                    `);
                }
            });
        }
        else {
            res.send(`
                <p>Error finding account!</p>
                <div>
                <button onclick="window.location.href='/'" style="background-color: green; color: white;">Return to Login</button>
                </div>
            `);
}
    });
}

exports.checkIfLoggedIn = (req, res, next) => {
    if (this.accountEmail === '' && this.accountUserType === '') {
        res.send(`
            <p>Not logged in<p>
            <button onclick="location.href='/'" style="background-color: green; color: white;">Return to Log In</button>
        `);
    } else {
        next(); // Move to the next middleware or route handler
    }
};

exports.admin_reset_password = (req, res) => {
    const { email, password, retype_password } = req.body;
    
    userModel.validateEmail(email, (exists) => {

        if(exists && (password === retype_password)) {
            userModel.adminUpdatePassword(email, password, (success) => {
                if(success){
                    res.send(`
                        User successfully assigned new password!
                        <br><br>
                        <button onclick="window.location.href='/dashboard'">Return to Dashboard</button>
                    `);
                }
                else {
                    res.send(`
                        Error resetting password!
                        <br><br>
                        <button onclick="window.location.href='/admin_reset_password'">Return to Password Reset</button>
                        <button onclick="window.location.href='/dashboard'">Return to Dashboard</button>
                    `);
                }
            });
        }
        else {
            
            if (!exists){
                res.redirect('/admin_reset_password/?error=email');
            }
            
            else if (password !== retype_password) {
                res.redirect('/admin_reset_password/?error=password');
            }
        }
    });
}


//Register a user by first checking to see if the email already exsists in the csv file. If not, writes to the csv file with the new information.
exports.register = (req, res) => {
    const { newEmail, newPassword, name, position, userType} = req.body;
    userModel.validateEmail(newEmail, (exists) => {
        if (exists) {
            res.send(`
                <div style="background-color: red; padding: 10px; margin-bottom: 10px;">An account with this email has already been registered!</div>
                <br><br>
                <button onclick="window.location.href='/register'">Go Back</button>
            `);
        } else {
            userModel.addUser(newEmail, newPassword, userType, name, position, (err) => {
                if (err) {
                    res.status(500).send('Internal Server Error');
                } else {
                    res.send(`
                        New user registered successfully!
                        <br><br>
                        <button onclick="window.location.href='/admin'">Return to Dashboard</button>
                    `);
                }
            });
        }
    });
}

//Function to redirect the user to the their correct dashboard.
exports.redirectToPage = (req, res) => {
   
    if (this.accountUserType == "mentor") {
        if (this.accountIsAdmin == 1) {
            res.redirect('/admin');
        }
        else {
            res.redirect('/mentor');
        }
    }
    else if (this.accountUserType == "mentee") {
        res.redirect('/mentee');
    }
}

exports.validateRoute = (routeType) => {
    return (req, res, next) => { 
        if (routeType === 'admin'){
            if (this.accountIsAdmin === 1){
                next();
            }
        }
        else if (routeType === this.accountUserType){
            next();
        }
        else{
            res.send(`
            Access Denied
            <br><br>
            <button onclick="window.location.href='/dashboard'">Return to Dashboard</button>
            <button onclick="window.location.href='/logout'">Logout</button>`);
        }
    }
}

exports.msalLogin = (req, res) => {
    console.log('In MSAL Controller');
    // Define the callback function to handle the response
    const handleResponse = (response) => {
        userModel.validateEmail(email, password, (userType, isAdmin) => {
            if (userType != null){
                this.accountEmail = email;
                this.accountUserType = userType;
                console.log(isAdmin);
                if (isAdmin){
                    console.log('Going to admin page');
                    this.redirectToPage('admin', res);
                }
                else{
                    this.redirectToPage(userType, res);
                }
            }
        
        // Handle the response, e.g., update UI
        // Also, handle redirection based on userType
        // Example: res.redirect('/admin') based on userType
        });
    }

    // Call the login_msal function with the user type and callback
    userModel.login_msal(handleResponse);
};