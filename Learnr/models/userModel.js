const connection = require('./database');

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

exports.validateEmail = (email, callback) => {

    let found = false;
    const retrieveQuery = 'SELECT * FROM users WHERE username = ?';

        connection.query(retrieveQuery, email, (err, results) => {
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

exports.addUser = (newUsername, newPassword, name, lastName, email, position, userType, isAdmin, callback) => {

    const insertQuery = 'INSERT INTO users (username, password, firstName, lastName, email, position, userType, isAdmin) VALUES (?, ?, ?, ?, ?, ?, ?, ?)';

        connection.query(insertQuery, [newUsername, newPassword, name, lastName, email, position, userType, isAdmin], (err) => {
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

exports.getUserData = (username, callback) => {
    let userData = null;
    const retrieveQuery = 'SELECT * FROM users WHERE username = ?';

    connection.query(retrieveQuery, username, (err, results) => {
        if (err) {
            console.error('Error finding username:', err);
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

    connection.query(updateQuery, [newPassword, username] , (err, results) => {
        if (err) {
            console.error('Error checking username:', err);
            callback(false);
        } 
        else {
            callback(true);
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
