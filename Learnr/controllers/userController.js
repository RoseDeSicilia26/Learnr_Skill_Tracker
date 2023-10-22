//Controller for users. Handles communication between the user views and user models.
const userModel = require('../models/userModel');
const pathwayModel = require('../models/pathwaysModel');

exports.accountUsername = ''; //Global variable used to keep track of which user is currently logged in.
exports.accountUserType = '';
exports.accountIsAdmin = 0;
exports.userData = {};

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
                                    <button onclick="window.location.href='/mentor'">Go Back</button>
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
            this.accountUserType = result.userType;
            this.accountIsAdmin = result.isAdmin;
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
    this.accountIsAdmin = 0;
    this.userData = {};
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

                <p><b>Username</b>: ${userData.username}</p>
                <p><b>User Type</b>: ${userData.userType}</p>

                <form id="editProfileForm" action="/updateProfile" method="POST">
                    <p><label>
                        <strong>First Name:</strong>
                        <input type="text" name="firstName" value="${userData.firstName || ''}" placeholder="Add first name">
                    </label>
                    <br></p>
            
                    <p><label>
                        <strong>Last Name:</strong>
                        <input type="text" name="lastName" value="${userData.lastName || ''}" placeholder="Add last name">
                    </label>
                    <br></p>
            
                    <p><label>
                        <strong>Email:</strong>
                        <input type="email" name="email" value="${userData.email || ''}" placeholder="Add email">
                    </label>
                    <br></p>

                    <p><label>
                        <strong>Position:</strong>
                        <select name="position">
                            <option value="intern" ${userData.position === 'intern' ? 'selected' : ''}>Intern</option>
                            <option value="fulltime" ${userData.position === 'fulltime' ? 'selected' : ''}>Full Time</option>
                        </select>
                    </label></p>

            
                    <p><label>
                        <strong>Bio:</strong>
                        <textarea name="bio" placeholder="Add bio">${userData.bio || ''}</textarea>
                    </label>
                    <br></p>
            
                    <p><label>
                        <strong>School:</strong>
                        <input type="text" name="school" value="${userData.school || ''}" placeholder="Add school">
                    </label>
                    <br></p>
            
                    <p><label>
                        <strong>Interests:</strong>
                        <input type="text" name="interests" value="${userData.interests || ''}" placeholder="Add interests">
                    </label>
                    <br></p>

                    <button type="submit" style="background-color: green; color: white;">Update Profile</button>
                    
                    </form>

                    <br><br>
                    <button onclick="window.location.href='/dashboard'" style="background-color: white; color: black;">Return to Dashboard</button>
                    
                </div>
                    
            
                </body>
                </html>
            `);
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

        if(exists && password === retype_password) {
            userModel.adminUpdatePassword(email, password, (success) => {
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

    const { newUsername, newPassword, name, lastName, email, position, userType, isAdmin} = req.body;
    userModel.userExists(newUsername, (exists) => {
        if (exists) {
            res.send(`
                <div style="background-color: red; padding: 10px; margin-bottom: 10px;">Username is already taken!</div>
                <br><br>
                <button onclick="window.location.href='/register'">Go Back</button>
            `);
        } else {
            userModel.addUser(newUsername, newPassword, name, lastName, email, position, userType, isAdmin, (err) => {
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
exports.redirectToPage = (userType, res) => {

    if (this.accountUserType != 'null') {
        userType = this.accountUserType;
        isAdmin = this.accountIsAdmin; 
    }
    
    if (userType == "mentor") {
        if (isAdmin == 1) {

            res.redirect('/admin');
        }
        else {
            res.redirect('/mentor');
        }
    }
    else if (userType == "mentee") {
        res.redirect('/mentee');
    }

}
