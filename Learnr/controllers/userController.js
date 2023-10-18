//Controller for users. Handles communication between the user views and user models.
const userModel = require('../models/userModel');
const pathwayModel = require('../models/pathwaysModel');

exports.accountUsername = ''; //Global variable used to keep track of which user is currently logged in.
exports.accountUserType = '';

exports.handlePathways = (req, res) => {
    var skill;
    const {pathwayID, menteeUsername} = req.body;
    pathwayModel.getPathway(pathwayID, (pathwaySkill) => {
        skill = pathwaySkill;
    pathwayModel.validatePathwayID(pathwayID, (validation) => {
        if (validation) {
            userModel.validateUsername(menteeUsername, (result) => { //Checks to see if the desired mentee exists within the database.
                if (result){
                    pathwayModel.checkPathway(pathwayID, menteeUsername, (found) =>{ //Checks to see if the mentee-pathway combination already exists.
                        if (found){ //Mentee-Pathway combination exists
                            res.send(`
                                    This mentee already has this pathway. Please select another.
                                    <br><br>
                                    <button onclick="window.location.href='/mentor'">Go Back</button>
                            `);
                        }
                        else {
                            pathwayModel.addPathway(pathwayID, menteeUsername, (err) =>{ //If the combination does not exist, write to the csv file to assign the desired mentee the desired pathway.
                                if (err) {
                                    console.error('Error writing to the CSV file.', err);
                                    res.status(500).send('Internal Server Error');
                                } 
                                else {
                                    res.send(`
                                        New pathway assigned successfully!
                                        <br><br>
                                        <button onclick="window.location.href='/mentor'">Return to Dashboard</button>
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
            this.accountUserType = result;
            this.redirectToPage(result, res);
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
}

exports.getProfile = (req, res) => {
    console.log("inside get profile before calling user data");

    // Fetch user data based on logged-in user.
    userModel.getUserData(this.accountUsername, (userData) => {
        console.log("inside get profile calling get userdata");
        
        if (userData) {
            res.send(`
                <!DOCTYPE html>
                <html lang="en">
                <head>
                    <meta charset="UTF-8">
                    <title>User Profile</title>
                </head>
                <body>
                    
                    <div id="userProfile">
                        <h2>User Profile</h2>
                        <p><strong>Username:</strong> <span id="username">${this.accountUsername}</span></p>
                        <p><strong>Name:</strong> <span id="name">${userData.name || 'add name'}</span></p> 
                        <p><strong>Last Name:</strong> <span id="lastName">${userData.lastName || 'add last name'}</span></p>
                        <p><strong>School:</strong> <span id="school">${userData.school || 'add school'}</span></p>
                        <p><strong>Title:</strong> <span id="title">${userData.title || 'add title'}</span></p>
                        <button onclick="location.href='/dashboard'">Back to Dashboard</button>
                    </div>
                    
                </body>
                </html>
            `);
        } else {
            res.status(404).send('User not found');
        }
    });
};


exports.admin_reset_password = (req, res) => {
    const { username, password, retype_password } = req.body;
    
    console.log(username)
    console.log(password)
    console.log(retype_password)
    
    userModel.validateUsername(username, (exists) => {
        if(exists && password === retype_password) {
            userModel.adminUpdatePassword(username, password, (success) => {
                if(success){
                    res.send(`
                        User successfuflly assigned new password!
                        <br><br>
                        <button onclick="window.location.href='/admin'">Return to Dashboard</button>
                    `);
                }
                else {
                    res.send(`
                        Error resetting password!
                        <br><br>
                        <button onclick="window.location.href='/admin'">Return to Dashboard</button>
                    `);
                }
            });
        }
        else {
            
            if (!exists){
                res.redirect('/?error=email');
            }
            
            if (password !== retype_password) {
                res.redirect('/?error=password');
            }
        }
    });
}


//Register a user by first checking to see if the username already exsists in the csv file. If not, writes to the csv file with the new information.
exports.register = (req, res) => {
    const { newUsername, newPassword, userType, name, email, position} = req.body;
    userModel.userExists(newUsername, (exists) => {
        if (exists) {
            res.send(`
                <div style="background-color: red; padding: 10px; margin-bottom: 10px;">Username is already taken!</div>
                <br><br>
                <button onclick="window.location.href='/register'">Go Back</button>
            `);
        } else {
            userModel.addUser(newUsername, newPassword, userType, name, email, position, (err) => {
                if (err) {
                    console.error('Error writing to the CSV file.', err);
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
exports.redirectToPage = (permission, res) => {

    if (this.accountUserType != 'null') {
        permission = this.accountUserType; 
    }
    
    switch (permission) {
        case 'admin':
            res.redirect('/admin');
            break;
        case 'mentor':
            res.redirect('/mentor');
            break;
        case 'mentee':
            res.redirect('/mentee');
            break;
        default:
            res.redirect('/default');
    }
}
