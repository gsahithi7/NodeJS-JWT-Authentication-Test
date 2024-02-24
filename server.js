const express = require('express');
const app = express();
const port = 3000;
const fs = require('fs');
const path = require('path');
const jwt = require('jsonwebtoken');
const secretKey = "Express is best!";

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

const userData = JSON.parse(fs.readFileSync('user_credentials.json'));

app.post('/auth/login', (req, res) => {
    const { username, password } = req.body;
   
    if (!username || !password) {
        return res.status(400).json({ message: "Username and password are required for logging in!" });
    }

    const user = userData.find(u => u.username.toLowerCase() === username.toLowerCase() && u.password === password);
    if (user) {
        const generatedToken = jwt.sign({ id: user.id, username: user.username }, secretKey, { expiresIn: '3m' });
        res.status(200).json({
            success: true,
            token: generatedToken,
            msg: `${username} authenticated successfully!!`
        });
    } else {
        res.status(400).json({
            success: false,
            msg: "Username or password is incorrect!"
        });
    }
});

app.get('/api/dashboard', authenticateToken, (req, res) => {
    console.log(req);
    res.json({
        success: true,
        error: false,
        msg: 'Token verified users can only able to view this page!'
    });
});

app.get('/api/settings', authenticateToken, (req, res) => {
    console.log(req);
    res.json({
        success: true,
        error: false,
        msg: 'Token verified users can only able to view this page!'
    });
});

function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    if (!authHeader) {
        return res.status(401).json({ msg: 'Token not provided' });
    }

    const token = authHeader.split(' ')[1]; // remove bearer

    try {
        jwt.verify(token, secretKey, (err, user) => {
            if (err) {
                console.error(err);
                return res.status(403).json({ msg: 'Invalid token' });
            }
            req.user = user;
            next();
        });
    } catch (error) {
        console.error('Error verifying token:', error);
        return res.status(500).json({ msg: 'Internal server error occurred while verifying token' });
    }
}

