const express = require('express');
const app = express();
const port = 3000;
const cors = require('cors');
const fs = require('fs'); // Import the fs module
const path = require('path'); // Node.js module for working with file paths
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const secretKey = "Express is best!";

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

app.use(bodyParser.json());

// Route to serve the index.html file
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});


const userData = JSON.parse(fs.readFileSync('user_credentials.json'));




app.get('/auth/login',(req,res)=>{

    const {username,password} = req.body;
   
    console.log(req);
    if(!username || !password){
        return res.status(400).json({message: "Username and password are required for logging in!" });
    }

    const user = userData.find(u => { if( toString(u.username).toLowerCase() == toString(username).toLocaleLowerCase() && u.password == password) return u ;else return null; } );
    if(user){
    
        let generatedToken = jwt.sign({ id: user.id, username: user.username }, secretKey, { expiresIn: '3m' });
    
    res.status(200).json({
        success:true,
        error:false,
        token : generatedToken,
        msg: username+" authenticated successfully!!"
    });

   }else{

    res.status(400).json({
        success:false,
        error:true,
        token:null,
       msg:"Username or password is incorrect!"
    });

   }
    

});
