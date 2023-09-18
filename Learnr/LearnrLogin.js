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

// Serve the login page
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/LearnrLogin Front.html');
});

// Handle login requests
app.post('/login', (req, res) => {
    const { username, password } = req.body;

    console.log(username);
    console.log(password);

    // Read user data from the CSV file
    fs.createReadStream('UserList.csv')
        .pipe(csv())
        .on('data', (row) => {
            if (row.username === username) {
                bcrypt.compare(password, row.password, (err, result) => {
                    if (err || !result) {
                        res.sendFile(__dirname + '/LearnrLogin Front.html', { error: 'Invalid Credentials'});
                    } else {
                        res.send('Login successful!');
                    }
                });
            }
        })
        .on('end', () => {
            res.sendFile(__dirname + '/LearnrLogin Front.html', { error: 'Invalid Credentials'});
        });
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
