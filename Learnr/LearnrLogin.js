const express = require('express');
const fs = require('fs');
const bcrypt = require('bcrypt');
const bodyParser = require('body-parser');
const csv = require('csv-parser');

const app = express();
const port = 3000;

//const messageDiv = document.getElementById("message");


// Middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());


function redirectToPage(permission, res){
    switch (permission){
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

// Serve the login page
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/LearnrLogin Front.html');
});

// Handle login requests
app.post('/LearnrLogin Front.html', async (req, res) => {
    const { username, password } = req.body;

    let found = false;

    // Read user data from the CSV file
    const stream = fs.createReadStream('UserList.csv')
    
    stream
        .pipe(csv())
        .on('data', async (row) => {
            if (row.username === username) {
                if (row.password === password){
                const isValid = true;
                    if (isValid) {
                        found = true;
                        const permission = row.permission;
                        redirectToPage(permission, res);
                        stream.destroy();
                    } 
                }
            }
            })
        
            .on('end', () => {
                if (!found) {
                    res.status(401).sendFile(__dirname + '/LearnrLogin Front.html', { error: 'Invalid Credentials'});
                }
                if (!found) {
                    error = 'Invalid username or password.';
                    messageDiv.innerText = error;
                }
            });
});

app.get('/admin', (req, res) => {
    res.send('Admin Dashboard');
});

app.get('/mentor', (req, res) => {
    res.send('Mentor Dashboard');
});

app.get('/mentee', (req, res) => {
    res.send('Mentee Dashboard');
});

app.get('/default', (req, res) => {
    res.send('Default Dashboard');
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
