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

exports.resetPassword = (newPassword,confirmPassword,callback ) =>  {
    let exists = false;
    const stream = fs.createReadStream('UserList.csv');
    stream
        .pipe(csv())
        .on('data', (row) => {
            if (row.password === newPassword  &&  row.password === confirmPassword) {
                exists = true;
            }
        })
        .on('end', () => {
            callback(exists); //Returns (true/false)
        });
}
exports.resetPassword2 = (newPassword, confirmPassword, callback) => {
    
  // CSV file path
  const csvFilePath = 'UserList.csv';

  // Convert the data to a CSV-formatted string
  const csvData = dataToWrite.map(row => row.join(',')).join('\n');

  // Create a write stream and write the data to the CSV file
  const writeStream = fs.createWriteStream(csvFilePath);
  writeStream.write(csvData, 'utf8', (err) => {
    if (err) {
      console.error('Error writing to CSV file:', err);
      callback(false);
    } else {
      console.log('Data written to CSV file successfully.');
      callback(true);
    }
  });
};

exports.profile = (Username, password, bio, interests, school, callback) => {
    let exists = false;
    const stream = fs.createReadStream('UserList.csv');
    stream
        .on('data', (row) => {
            // Assuming each row is an object with properties like "username" and "password"
            const userData = JSON.parse(row); // Assuming your CSV contains JSON data
            if (userData.username === Username && userData.password === password) {
                exists = true;
            }
        })
        .on('end', () => {
            callback(exists); // Returns (true/false)
        });
};

exports.updateProfile = (Username, password, bio, interests, school, callback) => {
    let exists = false;
    const userDataToUpdate = {
      bio: bio,
      interests: interests,
      school: school,
    };
    const updatedUsers = [];
    let userData; // Define userData at a higher scope

    const stream = fs.createReadStream('UserList.csv');

    stream
      .pipe(csv())
      .on('data', (row) => {
        // The 'row' variable already contains CSV data as an object
        // No need to parse it as JSON
        if (row.username === Username && row.password === password) {
          exists = true;
          // Merge the updated data into the existing user data
          const updatedUserData = { ...row, ...userDataToUpdate };
          updatedUsers.push(updatedUserData);
        } else {
          updatedUsers.push(row);
        }
      })
      .on('end', () => {
        if (!exists) {
          // If the user doesn't exist, return an error
          callback({ error: 'User not found' });
        } else {
          // Save the updated user data back to the CSV file
          const writeStream = fs.createWriteStream('UserList.csv');
  
          writeStream.write('username,password,bio,interests,school\n'); // CSV header
  
          updatedUsers.forEach((user) => {
            writeStream.write(
              `${user.username},${user.password},${user.bio},${user.interests},${user.school}\n`
            );
          });
  
          writeStream.end();
  
          // Return success message and updated user data
          callback({
            message: 'Profile updated successfully',
            user: userDataToUpdate,
          });
        }
      });
  };
  






