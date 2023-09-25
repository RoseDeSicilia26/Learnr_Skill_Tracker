const express = require('express');
const fs = require('fs');
const bodyParser = require('body-parser');
const csv = require('csv-parser');

const app = express();
const port = 3000;

// Middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());


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


app.get('/', (req, res) => {
    res.sendFile(__dirname + '/LearnrLogin Front.html');
});

app.post('/login', (req, res) => {
    const { username, password } = req.body;
    let found = false;

    const stream = fs.createReadStream('UserList.csv');

    stream
        .pipe(csv())
        .on('data', (row) => {
            if (row.username === username && row.password === password) {
                found = true;
                const permission = row.permission;
                redirectToPage(permission, res);
                stream.destroy();
            }
        })
        .on('end', () => {
            if (!found) {
                res.redirect('/?error=Invalid%20Credentials');
            }
        });
});

app.get('/admin', (req, res) => {
    res.sendFile(__dirname + '/supermentor.html');
});

app.get('/mentor', (req, res) => {
    res.sendFile(__dirname + '/mentor.html');
});

app.get('/mentee', (req, res) => {
    res.sendFile(__dirname + '/mentee.html');
});

app.get('/default', (req, res) => {
    res.send('<h1>Default Dashboard</h1>');
});

app.get('/register', (req, res) => {
    res.sendFile(__dirname + '/newuserform.html');
});


app.post('/register', (req, res) => {
    const { newUsername, newPassword, name, userType } = req.body;
    
    let userExists = false;

    // Check if the username already exists
    const stream = fs.createReadStream('UserList.csv');
    stream
        .pipe(csv())
        .on('data', (row) => {
            if (row.username === newUsername) {
                userExists = true;
            }
        })
        .on('end', () => {
            if (userExists) {
                // If username exists, send an error message
                res.send(`
                    <div style="background-color: red; padding: 10px; margin-bottom: 10px;">Username is already taken!</div>
                    <br><br>
                    <button onclick="window.location.href='/register'">Go Back</button>
                `);
            } else {
                // If username doesn't exist, add it to the CSV
                const csvLine = `${newUsername},${newPassword},${userType}\n`;
                fs.appendFile('UserList.csv', csvLine, (err) => {
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
});




// app.get('/register', (req, res) => {
//     res.send(`
//         <h1>Register New User</h1>
//         <form action="/register" method="post">
//             Username: <input type="text" name="username"><br>
//             Password: <input type="password" name="password"><br>
//             Name: <input type="text" name="name"><br>
//             User Type: 
//             <select name="permission">
//                 <option value="mentee">Mentee</option>
//                 <option value="mentor">Mentor</option>
//                 <option value="admin">Admin</option>
//             </select><br>
//             <button type="submit">Submit</button>
//         </form>
//     `);
// });

app.post('/register', (req, res) => {
    const { username, password, permission } = req.body;
    const newUser = `${username},${password},${permission}\n`;

    fs.appendFile('UserList.csv', newUser, (err) => {
        if (err) throw err;
        res.send('User added successfully!');
    });
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
