const connection = require('./database');

exports.checkuser = (username, password, callback) => {
    console.log('Checking user');
    let found = false;
    let userType = null;
    let isAdmin = false;

    const retrieveQuery = 'SELECT userType, isAdmin FROM users WHERE username = ? AND password = ?';

    connection.query(retrieveQuery, [username, password], (err, results) => {
        console.log('Retrieving query');
        if (err) {
            console.error('Error retrieving data:', err);
        } 
        else {
            if (results.length>0){
                userType = results[0].userType;
                if (results[0].isAdmin === 1){
                    isAdmin = true;
                }
                console.log(isAdmin);
            }

            callback(userType, isAdmin);
        }

    });
}


exports.validateUsername = (username, callback) => {

    let found = false;
    const retrieveQuery = 'SELECT * FROM users WHERE username = ?';

        connection.query(retrieveQuery, username, (err, results) => {
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

exports.validateEmail = (email, callback) => {

    let found = false;
    const retrieveQuery = 'SELECT * FROM users WHERE email = ?';

        connection.query(retrieveQuery, email, (err, results) => {
            if (err) {
                console.error('Error finding Email:', err);
            } 
            else {
                if (results.length>0){
                    found = true;
                }

                callback(found);
            }

        });

}

exports.addUser = (newUsername, newPassword, userType, name, email, position, callback) => {

    const insertQuery = 'INSERT INTO users (username, password, userType, firstName, email, position) VALUES (?, ?, ?, ?, ?, ?)';

        connection.query(insertQuery, [newUsername, newPassword, userType, name, email, position], (err) => {
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
                    title: results[0].position,
                    email: results[0].email,
                    sex: results[0].sex,
                    bio: results[0].bio,
                    interests: results[0].interests,
                };
            }

            callback(userData);
        }

    });
};


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
