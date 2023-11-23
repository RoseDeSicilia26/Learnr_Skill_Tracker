//Controller for users. Handles communication between the user views and user models.
const userModel = require('../models/userModel');
const pathwayModel = require('../models/pathwaysModel');
const ejs = require('ejs'); // Import the EJS module
const path = require('path'); // Import the path module
const express = require('express');
const res = express.response;
const app = express();


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
                                    <button onclick="window.location.href='/dashboard'">Return to Dashboard</button>
                                    <button onclick="window.location.href='/assign'">Return to Assign Page</button>
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

exports.assign = (req, res) => {

    var filePath;
    filePath = path.join(__dirname, "..", "views", "assignForm.ejs");

    userModel.getMentees(this.accountEmail, (users) => {
        pathwayModel.getEnabledPathways((pathways) => {
            ejs.renderFile(filePath, { users, pathways }, (err, html) => {
                if (err) {
                    console.error('Error rendering EJS template', err);
                    res.status(500).send('Internal Server Error');
                } else {
                    res.send(html); // Send the rendered HTML
                }
            });
        })
    })
}

exports.assignPathway = (req, res) => {
    const mentee = req.body.users;
    const pathway = req.body.pathway;

    pathwayModel.addPathway(pathway, mentee, (result) => {
        if (result) {
            console.error('Error Adding Pathway:', err);
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
    })
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

exports.deleteSelfAccount = (req, res) => {

    userModel.deleteSelfAccount(this.accountEmail, (result) => {
        if (result) {
            res.redirect("/");
        } else {
            res.json({ success: false, message: "Error deleting account." });
        }
    });
};


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

// the skill tracker dashboard
exports.getPathwayData = (req, res) => {

    console.log(__dirname)

    const pathway_id = req.params.courseId;
    console.log(pathway_id)

    if (this.accountUserType == "mentee") {
        pathwayModel.getMenteePathwaysSingle(this.accountEmail, pathway_id, (pathway) => {
            if (pathway) {
                
                var filePath;
                filePath = path.join(__dirname, "..", "views",  "mentee", "user_skill_tracker.ejs");
                
                // Render the EJS template with dynamic data
                ejs.renderFile(filePath, { pathway }, (err, html) => {
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

// the main dashbaord
exports.getUserDashboard = (req, res) => {
    console.log(__dirname);

    if (this.accountUserType == "mentor") {
        if (this.accountIsAdmin == 1) {
            var filePath = path.join(__dirname, "..", "views", "admin", "supermentor-mentee_pathway_tracker.ejs");
            pathwayModel.getMentorMentees(this.accountEmail, (userData) => {
                // Render the EJS template with dynamic data
                ejs.renderFile(filePath, { userData }, (err, html) => {
                    if (err) {
                        console.error('Error rendering EJS template', err);
                        res.status(500).send('Internal Server Error');
                    } else {
                        res.send(html); // Send the rendered HTML
                    }
                });
    
            });
        } else {
            var filePath = path.join(__dirname, "..", "views", "mentor", "mentor-mentee_pathway_tracker.ejs");
            pathwayModel.getMentorMentees(this.accountEmail, (userData) => {
                // Render the EJS template with dynamic data
                ejs.renderFile(filePath, { userData }, (err, html) => {
                    if (err) {
                        console.error('Error rendering EJS template', err);
                        res.status(500).send('Internal Server Error');
                    } else {
                        res.send(html); // Send the rendered HTML
                    }
                });
    
            });
        }
    } else if (this.accountUserType == "mentee") {
        var filePath = path.join(__dirname, "..", "views",  "mentee", "user_pathways_tracker.ejs");
        pathwayModel.getMenteePathwaysAll(this.accountEmail, (userData) => {
            // Render the EJS template with dynamic data
            ejs.renderFile(filePath, { userData }, (err, html) => {
                if (err) {
                    console.error('Error rendering EJS template', err);
                    res.status(500).send('Internal Server Error');
                } else {
                    res.send(html); // Send the rendered HTML
                }
            });

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
    const {position, bio, school, interests } = req.body;
    console.log(position);
    console.log(bio);
    console.log(school);
    console.log(interests);
    userModel.validateEmail(this.accountEmail, (exists) => {
        if(exists) {
            userModel.updateProfile(this.accountEmail, position, bio, school, interests, (success) => {
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
    });
}

exports.checkIfLoggedIn = (req, res, next) => {
    if (this.accountEmail === '' && this.accountUserType === '') {
        const filePath = path.join(__dirname, '..', 'views', 'LearnrLogin Front.html');
        res.sendFile(filePath);
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
    const newEmail = req.body.email;
    const {newPassword, name, position, userType} = req.body;
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
                        <button onclick="window.location.href='/dashboard'">Return to Dashboard</button>
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

exports.getPathways = (req, res, callback) =>{
    let manipulation = req.body;

    if (manipulation === 0){
        pathwayModel.getEnabledPathways((pathways, call) =>{
            if(call){
                var filePath;
                filePath = path.join(__dirname, "..", "views",  "admin", "supermentor-deletePathway.ejs");

                ejs.renderFile(filePath, {pathways}, (err, html) => {
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

    else if (manipulation === 1){
        pathwayModel.getDisabledPathways((pathways, call) => {
            if(call){
                var filePath;
                filePath = path.join(__dirname, "..", "views",  "admin", "supermentor-enablePathways.ejs");

                ejs.renderFile(filePath, {pathways}, (err, html) => {
                    if (err) {
                        console.error('Error rendering EJS template', err);
                        res.status(500).send('Internal Server Error');
                    } else {
                        res.send(html); // Send the rendered HTML
                    }
                });
            }
        })
    }
}


exports.removePathway = (req, res) =>{
    const pathwayID = req.body.pathway;
    pathwayModel.disablePathway(pathwayID, (result) => {
        if (result){
            pathwayModel.removePathway(pathwayID, (result) =>{
        
                if (result){
                    res.send(`
                        Pathway removed successfully!
                        <br><br>
                        <button onclick="window.location.href='/dashboard'">Return to Dashboard</button>
                        <button onclick="window.location.href='/getPathways'">Remove another Pathway</button>
                        `);
                }
                else {
                    res.send(`
                        Error Removing Pathway.
                        <br><br>
                        <button onclick="window.location.href='/assign'">Go Back</button>
                        `);
                }
            });
        }
        else {
            res.send(`
                        Error Updating Pathways.
                        <br><br>
                        <button onclick="window.location.href='/assign'">Go Back</button>
                        `);
        }
    });
}

exports.enablePathway = (req, res) => {
    const pathwayID = req.body.pathway;
    pathwayModel.enablePathway(pathwayID, (result) => {
        if (result){
            res.send(`
                Pathway Enabled successfully!
                <br><br>
                <button onclick="window.location.href='/dashboard'">Return to Dashboard</button>
                <button onclick="window.location.href='/getPathways'">Enable another Pathway</button>
                `);
        }
        else {
            res.send(`
                Error Enabling Pathway.
                <br><br>
                <button onclick="window.location.href='/assign'">Go Back</button>
                `);
        }
    });
}

exports.getMentees = (req, res) => {
    userModel.getMentees(this.accountEmail, (mentees) => {
        var filePath;
        if (this.accountUserType === 'mentor'){
                filePath = path.join(__dirname, "..", "views",  "mentor", "mentees.ejs");
            if (this.accountIsAdmin){
                filePath = path.join(__dirname, "..", "views",  "admin", "mentees.ejs");
            }
        }
                ejs.renderFile(filePath, {mentees}, (err, html) => {
                    if (err) {
                        console.error('Error rendering EJS template', err);
                        res.status(500).send('Internal Server Error');
                    } else {
                        res.send(html); // Send the rendered HTML
                    }
                });
    })
}
let menteeToChange ='';
let skillToChange = '';

exports.getUserPathways = (req, res) => {
    let menteeEmail = req.body.mentee;
    menteeToChange = menteeEmail;

    pathwayModel.getMenteePathways(menteeEmail, (pathways) => {
        if (this.accountUserType === 'mentor'){
            if (this.accountIsAdmin){
            filePath = path.join(__dirname, "..", "views",  "admin", "menteePathways.ejs");
            }
            else {
              filePath = path.join(__dirname, "..", "views",  "mentor", "menteePathways.ejs");  
            }
        }
            ejs.renderFile(filePath, {pathways}, (err, html) => {
                if (err) {
                    console.error('Error rendering EJS template', err);
                    res.status(500).send('Internal Server Error');
                } else {
                    res.send(html); // Send the rendered HTML
                }
            });
    })
}

exports.updatePathways = (req, res) => {
    let skill = req.body.pathways;
    skillToChange = skill;

    pathwayModel.getPathwaySteps(skill, (steps) => {
        if (this.accountUserType === 'mentor'){
            if (this.accountIsAdmin){
                filePath = path.join(__dirname, "..", "views",  "admin", "pathwaySteps.ejs");
            } else {
                filePath = path.join(__dirname, "..", "views",  "mentor", "pathwaySteps.ejs");  
            }
        }
        
        ejs.renderFile(filePath, { steps }, (err, html) => {
            if (err) {
                console.error('Error rendering EJS template', err);
                res.status(500).send('Internal Server Error');
            } else {
                res.send(html); // Send the rendered HTML
            }
        });
    });
};

exports.updateStep = (req, res) => {
    let step = req.body;
    pathwayModel.getPathwayID (skillToChange, (pathwayID) => {
        userModel.changeStep (menteeToChange, pathwayID, step, (results) => {
            if (results){
                if (results){
                    res.send(`
                        Mentee Progress Changed Successfully!
                        <br><br>
                        <button onclick="window.location.href='/dashboard'">Return to Dashboard</button>
                        <button onclick="window.location.href='/updateProgress'">Change another mentee's progress</button>
                        `);
                }
                else {
                    res.send(`
                        Error Changing Progress.
                        <br><br>
                        <button onclick="window.location.href='/updateProgress'">Go Back</button>
                        `);
                } 
            }
        })  
    });
    
}

exports.createPathway = (req, res) => {
    const {pathwayName, numberOfSteps, pathwayDescription} = req.body;
    pathwayModel.createPathway (pathwayName, numberOfSteps, pathwayDescription, (results) => {
        if (results){
            res.send(`
                        Pathway Added Successfully!
                        <br><br>
                        <button onclick="window.location.href='/dashboard'">Return to Dashboard</button>
                        <button onclick="window.location.href='/createPathway'">Create another pathway</button>
                        `);
        }
        else {
            res.send(`
                        Error Adding Pathway.
                        <br><br>
                        <button onclick="window.location.href='/createPathway'">Go Back</button>
                        `);
        }
    })
}