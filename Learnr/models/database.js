const mysql2 = require('mysql2');

// Create a MySQL database connection
const connection = mysql2.createConnection({
    host: 'localhost',
    port: '3306',         // Change this to your MySQL server hostname
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

process.on('exit', () => {
    connection.end((err) => {
        if (err) {
            console.error('Error closing MySQL connection:', err);
        } else {
            console.log('MySQL connection closed.');
        }
    });
});
// Export the connection for use in other modules
module.exports = connection;
