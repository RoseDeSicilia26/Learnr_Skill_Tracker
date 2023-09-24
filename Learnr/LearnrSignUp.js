const express = require('express');
const fs = require('fs');
const bcrypt = require('bcrypt');
const bodyParser = require('body-parser');
const csv = require('csv-parser');

const app = express();
const port = 3000;

// Middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Serve the sign up page
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/LearnrSignUp Front.html');
});

// Handle login requests
app.post('/signUp', async (req, res) => {
    const { username, password, permission } = req.body;

    let found = false;
    const users = [];

    // Read user data from the CSV file
    const stream = fs.createReadStream('UserList.csv')
    
    stream
        .pipe(csv())
        .on('data', async (row) => {
            users.push(row);
        })
        
        .on('end', () => {
            //Check if the username was already taken
            if (users.some((user) => user.username === username)){
                return res.status(400).send('Username already exists. Please choose a different username.');
            }

            //Hash the password
            bcrypt.hash(password, 10, (err, hashedPassword) => {
                if (err){
                    return res.status(500).send('Internal server error.');
                }

                //Add new user to the array
                users.push({ username, password: hashedPassword, permission});

                //Write the updated user to the csv file

                const ws = fs.createWriteStream('UserList.csv');
                ws.write('username,password,permission\n');
                users.forEach((user) => {
                    ws.write(`${user.username},${user.password},${user.permission}\n`);
                });

                res.send('Sign-Up Successful!');
            });
        });
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
