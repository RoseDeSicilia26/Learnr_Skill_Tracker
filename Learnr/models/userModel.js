const connection = require('./database');

//userModel.checkuser

exports.checkuser = (username, password, callback) => {
    console.log('Checking user');
    let found = false;
    const retrieveQuery = 'SELECT permission FROM userlist WHERE username = ? AND password = ?';

    connection.query(retrieveQuery, [username, password], (err, results) => {
        console.log('Retrieving query');
        if (err) {
            console.error('Error inserting data:', err);
        } 
        else {
            if (results.length>0){
                found = results[0].permission;
            }

            callback(found);
        }

    });
}

exports.validateUsername = (username, callback) => {

    let found = false;
    const retrieveQuery = 'SELECT * FROM userlist WHERE username = ?';

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

exports.addUser = (newUsername, newPassword, userType, name, email, position, callback) => {

    const insertQuery = 'INSERT INTO userlist (username, password, permission) VALUES (?, ?, ?)';

        connection.query(insertQuery, [newUsername, newPassword, userType], (err) => {
            if (err) {
                console.error('Error adding user:', err);
            } 

            callback(err);

        });
}

exports.userExists = (newUsername, callback) => {

    let found = false;
    const retrieveQuery = 'SELECT * FROM userlist WHERE username = ?';

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

// //Returns a list of mentees
// exports.getMentee = (mentorUsername, callback) => {

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