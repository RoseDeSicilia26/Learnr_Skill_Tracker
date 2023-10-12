const mysql = require('mysql');

// Create a MySQL database connection
const connection = mysql.createConnection({
    host: 'http://localhost:3306',         // Change this to your MySQL server hostname
    user: 'root',      // Change this to your MySQL username
    password: 'root',  // Change this to your MySQL password
    database: 'learnrdb'     // Change this to your database name
});

// Connect to the MySQL server
connection.connect((err) => {
    if (err) {
        console.error('Error connecting to MySQL:', err);
        return;
    }
    console.log('Connected to MySQL database.');
});

// Define a table structure
const createTableQuery = `
    CREATE TABLE IF NOT EXISTS mytable (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255),
        age INT
    )
`;

// Create the table
connection.query(createTableQuery, (err, results) => {
    if (err) {
        console.error('Error creating table:', err);
    } else {
        console.log('Table created successfully.');
    }
});

// Insert data into the table
const insertDataQuery = 'INSERT INTO mytable (name, age) VALUES ?';
const values = [
    ['John Doe', 30],
    ['Jane Smith', 25]
];

const retrieveUserQuery = 'SELECT * FROM userlist WHERE username = ? ';

connection.query(insertDataQuery, [values], (err, results) => {
    if (err) {
        console.error('Error inserting data:', err);
    } else {
        console.log('Data inserted successfully.');
    }
});

//userModel.checkuser

exports.checkuser = (username, password, callback) => {

    let found = false;

    connection.connect((err) => {
        if (err) {
            console.error('Error connecting to MySQL:', err);
            return;
        }
        console.log('Connected to MySQL database.');
    });

    connection.query(retrieveUserQuery, username, password, (err, results) => {
        if (err) {
            console.error('Error inserting data:', err);
        } else {
            console.log('Data inserted successfully.');
        }
    });

    if (results.length > 0) {
        found = true;
    }
    
    callback(found);

    connection.end();

}