//Controller for users. Handles communication between the user views and user models.

const userModel = require('../models/userModel');


//Logs in the user by checking their information against the csv file and redirecting them to the appropriate page based on the type of permission in the file.
exports.login = (req, res) => { 
    const {username, password} = req.body;
    userModel.checkuser(username, password, (result) => {
        if (result){
            redirectToPage(result, res);
        }
        else {
            res.redirect('/?error=Invalid%20Credentials');
        }
    });
}

//Register a user by first checking to see if the username already exsists in the csv file. If not, writes to the csv file with the new information.
exports.register = (req, res) => {
    const { newUsername, newPassword, userType } = req.body;
    userModel.userExists(newUsername, (exists) => {
        if (exists) {
            res.send(`
                <div style="background-color: red; padding: 10px; margin-bottom: 10px;">Username is already taken!</div>
                <br><br>
                <button onclick="window.location.href='/register'">Go Back</button>
            `);
        } else {
            userModel.addUser(newUsername, newPassword, userType, (err) => {
                if (err) {
                    console.error('Error writing to the CSV file.', err);
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
//Writes the new password to the CSV file 
exports.resetPassword = (req, res) => {
    const { Username, newPassword, confirmPassword  } = req.body;
    
    const updatedUser = { /* your user data here */ };

    userModel.userExists(Username, (exists) => {
      if (!exists) {
        // User does not exist, handle this case appropriately
        return res.status(404).json({ message: "User not found" });
      } else {
        userModel.addUser(updatedUser, (error) => {
          if (error) {
            // Handle the error when adding the user
            return res.status(500).json({ message: "Error adding the user" });
          }
          // User added successfully
          users[Username] = updatedUser;
          return res.status(200).json({ message: "User is found and added!" });
        });
      }
    });
    
    

        // Assuming userModel.resetPassword is asynchronous and returns a Promise
        userModel.resetPassword(Username, newPassword)
            
        if (newPassword !== confirmPassword) {
            // Passwords do not match, handle this case appropriately
            return res.status(400).json({ message: "Passwords do not match" });
        }
        else
        {
            res.status(200).json({ message: "Password updated successfully" });

        }
    }


//Writes the profile to the csv file
exports.profile = (req, res) => {
    const { Username, password, bio, interests, school } = req.body;

    userModel.userExists(Username, (exists) => {
        if (!exists) {
            // Handle the case where the user does not exist
            res.status(404).json({ error: 'User not found' });

        } else {
            res.status(200).json({message:'User is found and added/updated!'});
            // Update the user's profile with the provided data
            userModel.updateProfile(Username, { bio, interests, school }, (error, updatedUser) => {
                if (error) {
                    res.status(500).json({ error: 'Internal server error' });
                } else {
                    res.status(200).json(updatedUser);
                }
            });
        }
    });
};

exports.updateProfile = (req, res) => {
    const { Username, password, bio, interests, school } = req.body;

    userModel.userExists(Username, (exists) => {
        if (!exists) {
            res.status(404).json({ error: 'User not found' });
        } else {
            res.status(200).json({message: 'User is found and updated!'});
            // Assuming you have a function to update the user's profile
            userModel.updateUserProfile(Username, { bio, interests, school }, (error, updatedUser) => {
                if (error) {
                    res.status(500).json({ error: 'Internal server error' });
                } else {
                    res.status(200).json({ message: 'Profile updated successfully', user: updatedUser });
                }
            });
        }
    });
};

    

//Function to redirect the user to the their correct dashboard.
function redirectToPage(permission, res) {
    switch (permission) {
        case 'admin':
            res.redirect('/admin');
            break;
        case 'mentor':
            res.redirect('/mentor');
            break;
        case 'mentee':
            res.redirect('/mentee');
            break;
        default:
            res.redirect('/default');
    }
}