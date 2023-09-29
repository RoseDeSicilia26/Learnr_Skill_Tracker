//Functions that involve users. Typically checking or manipulating the csv with the users in them.

const fs = require('fs');
const csv = require('csv-parser');


//Checks to see if the user's credentials match any in the csv file.
exports.checkuser = (username, password, callback) => {
    let found = false;
    const stream = fs.createReadStream('UserList.csv');
    stream 
        .pipe(csv())
        .on('data', (row) => {
            if (row.username === username && row.password === password) {
                found = row.permission;
            }
        })
        .on ('end', () => {
            callback(found); //Returns (true/false)
        });
}

//Writes to the csv file with user input.
exports.addUser = (newUsername, newPassword, userType, callback) => {
    const csvLine = `${newUsername},${newPassword},${userType}\n`;
    fs.appendFile('UserList.csv', csvLine, (err) => {
        callback(err);
    });
}

//Checks to see if the username exists in the csv file.
exports.userExists = (newUsername, callback) => {
    let exists = false;
    const stream = fs.createReadStream('UserList.csv');
    stream
        .pipe(csv())
        .on('data', (row) => {
            if (row.username === newUsername) {
                exists = true;
            }
        })
        .on('end', () => {
            callback(exists); //Returns (true/false)
        });
}