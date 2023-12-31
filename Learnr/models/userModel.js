const connection = require('./database');
const msalInstance = require('./msalConfig');
const login = require('./msalConfig');

exports.login_msal = async (callback) => {
    // console.log('Logging In');
  
    // const loginRequest = {
    //     scopes: ['openid', 'profile', 'User.Read'], // Adjust the scopes as needed
    // };

    // try {
    //     const response = await msalInstance.loginPopup(loginRequest);
    //     // Handle the response, e.g., update UI
    //     callback(response);
    // } catch (error) {
    //     console.error(error);
    //     throw error;
    // }
    login.login();
};

exports.deleteSelfAccount = (email, callback) => {

    let found = false;
    const badges = 'DELETE FROM menteebadges WHERE menteeEmail = ?';
    
    connection.query(badges, email, (err, results) => {
        if (err) {
            console.error('Error deleting user:', err);
        } 
        else {
            let found = false;
            const pathways = 'DELETE FROM menteepathways WHERE menteeEmail = ?'
            
            connection.query(pathways, email, (err, results) => {
                if (err) {
                    console.error('Error deleting user:', err);
                } 
                else {
                    let found = false;
                    const relationships = 'DELETE FROM relationships WHERE menteeEmail = ?';
                    
                    connection.query(relationships, email, (err, results) => {
                        if (err) {
                            console.error('Error deleting user:', err);
                        } 
                        else {
                            let found = false;
                            const badges = 'DELETE FROM users WHERE email = ?';
                            
                            connection.query(badges, email, (err, results) => {
                                if (err) {
                                    console.error('Error deleting user:', err);
                                } 
                                else {
                                    found = true;
                                    callback(found);
                                }
                            });
                        }
                    });
                }
            });
        }
    });
}



exports.checkUser = (email, password, callback) => {
    let found = false;
    const retrieveQuery = 'SELECT userType, isAdmin FROM users WHERE email = ? AND password = ?';

    connection.query(retrieveQuery, [email, password], (err, results) => {
        if (err) {
            console.error('Error inserting data:', err);
        } 
        else {
            if (results.length>0){
                found = {
                    userType: results[0].userType,  // Access the userType property of the first row
                    isAdmin: results[0].isAdmin    // Access the isAdmin property of the first row
                };  
            }
            callback(found);
        }
    });
}

exports.validateEmail = (email, callback) => {

    let found = false;
    const retrieveQuery = 'SELECT * FROM users WHERE email = ?';

        connection.query(retrieveQuery, email, (err, results) => {
            if (err) {
                console.error('Error finding email:', err);
            } 
            else {
                if (results.length>0){
                    found = true;
                }

                callback(found);
            }

        });

}

exports.addUser = (newEmail, newPassword, userType, name, position, callback) => {

    const insertQuery = 'INSERT INTO users (email, password, userType, firstName, position) VALUES (?, ?, ?, ?, ?)';

        connection.query(insertQuery, [newEmail, newPassword, userType, name, position], (err) => {
            if (err) {
                console.error('Error adding user:', err);
            } 

            callback(err);

        });
}

exports.getUserData = (email, callback) => {
    let userData = null;
    const retrieveQuery = 'SELECT * FROM users WHERE email = ?';

    connection.query(retrieveQuery, email, (err, results) => {
        if (err) {
            console.error('Error finding email:', err);
        } 
        else {
            if (results.length>0){
                userData = {
                    firstName: results[0].firstName,
                    lastName: results[0].lastName,
                    school: results[0].school,
                    position: results[0].position,
                    email: results[0].email,
                    sex: results[0].sex,
                    bio: results[0].bio,
                    interests: results[0].interests,
                    userType: results[0].userType,
                };
            }

            callback(userData);
        }

    });
};

exports.updateProfile = (email, position, bio, school, interests, callback) => {
    const updateQuery = 'UPDATE users SET position = ?, bio = ?, school = ?, interests = ? WHERE email = ?';
    connection.query(updateQuery, [position, bio, school, interests, email], (err, results) => {
        if (err) {
            console.error('Error updating profile:', err);
            callback(false);
        } else {
            if (results.affectedRows > 0) { // Check if the profile was updated successfully
                callback(true);
            } else {
                callback(false);
            }
        }
    });

}

exports.adminUpdatePassword = (email, newPassword, callback) => {
    const updateQuery = 'UPDATE users SET password = ? WHERE email = ?';

    connection.query(updateQuery, [newPassword, email] , (err, results) => {
        if (err) {
            console.error('Error checking email:', err);
            callback(false);
        } 
        else {
            callback(true);
        }
    });
}

exports.getMentees = (mentorEmail, callback) => {

    const retrieveQuery = 'SELECT * FROM relationships WHERE mentorEmail = ?';

    connection.query(retrieveQuery, mentorEmail, (err, results) => {
        if (err){
            console.error('Error Getting Users:', err);
        }
        else{
            callback(results);
        }
    })

}

exports.changeStep = (menteeEmail, pathwayID, step, callback) => {
    const updateQuery = 'UPDATE menteepathways SET step = ? WHERE menteeEmail = ? AND pathwayID = ?';

    connection.query(updateQuery, [step.steps, menteeEmail, pathwayID], (err, results) => {
        if (err){
            console.error('Error Changing Pathway Step:', err);
            callback(false);
        }
        else{
            callback(true);
        }
    })

}

