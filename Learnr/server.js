const express = require('express');
const bodyParser = require('body-parser');
const authRoutes = require('./routes/authRoutes');

const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static('public'));

app.use('/', authRoutes);


//Host the Server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
