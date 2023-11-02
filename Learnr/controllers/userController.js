//Controller for users. Handles communication between the user views and user models.
const userModel = require('../models/userModel');
const pathwayModel = require('../models/pathwaysModel');
const ejs = require('ejs'); // Import the EJS module
const path = require('path'); // Import the path module
const express = require('express');
const res = express.response;
const app = express();
app.use(express.static('public'));

exports.accountUsername = ''; //Global variable used to keep track of which user is currently logged in.
exports.accountUserType = '';
exports.accountIsAdmin = 0;

exports.handlePathways = (req, res) => {
    var skill;
    const {pathwayID, menteeUsername, step} = req.body;
    pathwayModel.getPathwaySkill(pathwayID, (pathwaySkill) => {
        skill = pathwaySkill;
    pathwayModel.validatePathwayID(pathwayID, (validation) => {
        if (validation) {
            userModel.userExists(menteeUsername, (result) => { //Checks to see if the desired mentee exists within the database.
                if (result){
                    pathwayModel.checkPathway(pathwayID, menteeUsername, (found) =>{ //Checks to see if the mentee-pathway combination already exists.
                        if (found){ //Mentee-Pathway combination exists
                            res.send(`
                                    This mentee already has this pathway. Please select another.
                                    <br><br>
                                    <button onclick="window.location.href='/dashboard'">Go Back</button>
                            `);
                        }
                        else {
                            pathwayModel.addPathway(pathwayID, menteeUsername, step, (err) =>{ //If the combination does not exist, write to the csv file to assign the desired mentee the desired pathway.
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
    const {username, password} = req.body;
    userModel.checkuser(username, password, (result) => {
        if (result){
            this.accountUsername = username;
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
    this.accountUsername = ''; 
    this.accountUserType = '';
    this.accountIsAdmin = 0;
}

exports.getProfile = (req, res) => {
    console.log("inside get profile before calling user data");

    // Fetch user da ta based on logged-in user.
    userModel.getUserData(this.accountUsername, (userData) => {
        console.log("inside get profile calling get userdata");

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


exports.updateProfile = (req, res) => {

    const { firstName, lastName, email, position, bio, school, interests } = req.body;
    userModel.validateUsername(this.accountUsername, (exists) => {
        if(exists) {
            userModel.updateProfile(this.accountUsername, firstName, lastName, email, position, bio, school, interests, (success) => {
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
    if (this.accountUsername === '' && this.accountUserType === '') {
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


//Register a user by first checking to see if the username already exsists in the csv file. If not, writes to the csv file with the new information.
exports.register = (req, res) => {

    const { newUsername, newPassword, name, lastName, email, position, userType, isAdmin} = req.body;
    userModel.userExists(newUsername, (exists) => {
        if (exists) {
            res.send(`
                <div style="background-color: red; padding: 10px; margin-bottom: 10px;">Username is already taken!</div>
                <br><br>
                <button onclick="window.location.href='/register'">Go Back</button>
            `);
        } else {

            if(isAdmin === 'yes') {
                isAdmin_val = 1;
            }
            else {
                isAdmin_val = 0;
            }
            
            userModel.addUser(newUsername, newPassword, name, lastName, email, position, userType, isAdmin_val, (err) => {
                if (err) {
                    console.error('Error writing to the sql database file.', err);
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
