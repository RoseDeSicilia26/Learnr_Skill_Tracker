//Functions that involve users. Typically checking or manipulating the csv with the users in them.

const fs = require('fs');
const csv = require('csv-parser');
const createCsvWriter = require('csv-writer').createObjectCsvWriter;


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
            callback(found); //Returns (true/false) or in the case of it being true, returns the paermission type of the account.
        });
}


exports.validateUsername = (username, callback) => {
    let found = false;
    const stream = fs.createReadStream('UserList.csv');
    stream 
        .pipe(csv())
        .on('data', (row) => {
            if (row.username === username) {
                found = true;
            }
        })
        .on ('end', () => {
            callback(found); //Returns (true/false)
        });
}

//Writes to the csv file with user input.
exports.addUser = (newUsername, newPassword, userType, name, email, position, callback) => {
    const csvLine = `${newUsername},${newPassword},${userType}, ${name}, ${email}, ${position}, \n`;
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

exports.getUserData = (username, callback) => {
    let userData = null;
    const stream = fs.createReadStream('UserProfile.csv');
    stream 
        .pipe(csv())
        .on('data', (row) => {
            if (row.username === username) {
                userData = {
                    name: row.first_name,
                    lastName: row.last_name,
                    school: row.school,
                    title: row.job_title,
                };
            }
        })
        .on ('end', () => {
            callback(userData);
        });
};


exports.adminUpdatePassword = (username, newPassword, callback) => {
    const rows = [];
    fs.createReadStream('UserList.csv')
        .pipe(csv())
        .on('data', (row) => {
            rows.push(row);
        })
        .on('end', () => {
            const userIndex = rows.findIndex(row => row.username === username);
            if (userIndex === -1) {
                callback(false);
                return;
            }
            rows[userIndex].password = newPassword;

            const csvWriter = createCsvWriter({
                path: 'UserList.csv',
                header: Object.keys(rows[0]).map(key => ({ id: key, title: key })),
            });

            csvWriter.writeRecords(rows)
                .then(() => callback(true))
                .catch((error) => {
                    console.error('Error writing to CSV file:', error);
                    callback(false);
                });
        });
}


exports.getMentee = (mentorUsername, callback) => {

    fs.readFile('Relationship.csv', 'utf8', (err, data) => {
            // Read the CSV file

        // Split the CSV data into lines
        const lines = data.split('\n');
    
        // Initialize an array to store the separated strings
        const menteeList = [];

        // Iterate through the lines to find the specified value in the additional column
        for (const line of lines) {

            const parts = line.split('.');
                const mentor = parts[0];
                const mentee1 = parts[1];
                const mentee2 = parts[2];

                if (mentorUsername === mentor) {
                    menteeList.push({ mentee1, mentee2});
                    callback(menteeList);
                }
        }
    })
}