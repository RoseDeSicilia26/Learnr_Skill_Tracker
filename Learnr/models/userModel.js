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
    const retrieveQuery = 'SELECT * FROM users WHERE username = ?';

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
                    username: results[0].username,
                    userType: results[0].userType,
                };
            }

            callback(userData);
        }

    });
};

exports.updateProfile = (email, firstName, lastName, position, bio, school, interests, callback) => {
    const updateQuery = 'UPDATE users SET firstName = ?, lastName = ?, position = ?, bio = ?, school = ?, interests = ? WHERE email = ?';
    connection.query(updateQuery, [firstName, lastName, position, bio, school, interests, email], (err, results) => {
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

exports.adminUpdatePassword = (username, newPassword, callback) => {

    const updateQuery = 'UPDATE users SET password = ? WHERE username = ?';

    connection.query(updateQuery, [newPassword, username] , (err, results) => {
        if (err) {
            console.error('Error checking username:', err);
            callback(false);
        } 
        else {
            callback(true);
        }
    });
}

