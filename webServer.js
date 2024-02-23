const express = require('express');
const app = express();
const port = 3000;
const cors = require('cors');
const fs = require('fs'); // Import the fs module
const path = require('path'); // Node.js module for working with file paths
// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

// Route to serve the index.html file
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});


const userData = JSON.parse(fs.readFileSync('user_credentials.json'));

app.get('/users', (req, res) => {
    res.json(userData);
});

