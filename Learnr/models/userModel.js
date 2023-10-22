const connection = require('./database');

const fs = require('fs');
const csv = require('csv-parser');
const createCsvWriter = require('csv-writer').createObjectCsvWriter;

exports.checkuser = (username, password, callback) => {
    console.log('Checking user');
    let found = false;
    const retrieveQuery = 'SELECT userType, isAdmin FROM users WHERE username = ? AND password = ?';

    connection.query(retrieveQuery, [username, password], (err, results) => {
        console.log('Retrieving query');
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


exports.validateUsername = (username, callback) => {

    let found = false;
    const retrieveQuery = 'SELECT * FROM users WHERE username = ?';

        connection.query(retrieveQuery, username, (err, results) => {
            if (err) {
                console.error('Error finding username:', err);
                callback(found);
            } 
            else {
                if (results.length>0){
                    found = true;
                }

                callback(found);
            }

        });

}

exports.addUser = (newUsername, newPassword, name, lastName, email, position, userType, isAdmin, callback) => {

    const insertQuery = 'INSERT INTO users (username, password, name, lastName, email, position, userType, isAdmin) VALUES (?, ?, ?, ?, ?, ?, ?, ?)';

        connection.query(insertQuery, [newUsername, newPassword, userType], (err) => {
            if (err) {
                console.error('Error adding user:', err);
            } 

            callback(err);

        });
}

exports.userExists = (newUsername, callback) => {

    let found = false;
    const retrieveQuery = 'SELECT * FROM users WHERE username = ?';

        connection.query(retrieveQuery, newUsername, (err, results) => {
            if (err) {
                console.error('Error finding username:', err);
            } 
            else {
                if (results.length>0){
                    found = true;
                }

                callback(found);
            }

        });

}

exports.updateProfile = (username, firstName, lastName, email, position, bio, school, interests, callback) => {
    const updateQuery = 'UPDATE users SET firstName = ?, lastName = ?, email = ?, position = ?, bio = ?, school = ?, interests = ? WHERE username = ?';
    console.log("Inisde update profile with my username " + username);
    connection.query(updateQuery, [firstName, lastName, email, position, bio, school, interests, username], (err, results) => {
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

    connection.query(updateQuery, [newPassword, username], (err, results) => {
        if (err) {
            console.error('Error updating password:', err);
            callback(false);
        } else {
            if (results.affectedRows > 0) { // Check if the password was updated successfully
                callback(true);
            } else {
                callback(false);
            }
        }
    });
};


exports.getUserData = (username, callback) => {
    const retrieveQuery = 'SELECT firstName, lastName, email, bio, interests, position, school, userType FROM users WHERE username = ?';

    connection.query(retrieveQuery, username, (err, results) => {
        if (err) {
            console.error('Error retrieving user data:', err);
            callback(null);
        } else {
            if (results.length > 0) {
                const row = results[0];
                const userData = {
                    username: username,
                    firstName: row.firstName,
                    lastName: row.lastName,
                    email: row.email,
                    bio: row.bio, 
                    interests: row.interests,
                    position: row.position,
                    school: row.school,
                    userType: row.userType,
                };
                callback(userData);
            } else {
                callback(null);
            }
        }
    });
};



//exports.getMentee = (mentorUsername, callback) => {
//     fs.readFile('Relationship.csv', 'utf8', (err, data) => {
//             // Read the CSV file

//         // Split the CSV data into lines
//         const lines = data.split('\n');
    
//         // Initialize an array to store the separated strings
//         const menteeList = [];

//         // Iterate through the lines to find the specified value in the additional column
//         for (const line of lines) {

//             const parts = line.split('.');
//                 const mentor = parts[0];
//                 const mentee1 = parts[1];
//                 const mentee2 = parts[2];

//                 if (mentorUsername === mentor) {
//                     menteeList.push({ mentee1, mentee2});
//                     callback(menteeList);
//                 }
//         }
//     })
// }