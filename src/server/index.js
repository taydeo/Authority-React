const express = require('express');
const logger = require('node-color-log');
const path = require('path');
const User = require('./classes/User');

// RATE LIMIT MIDDLEWARE: https://www.npmjs.com/package/express-rate-limit
const rateLimit = require('express-rate-limit');
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100 // limit each IP to 100 requests per windowMs
});

const app = express();

app.use(limiter);
app.use(express.urlencoded({extended:true}));
app.use(express.json());



/*  Initialize session which will be used for storing user data and the like. */
try{
    app.use(require('./sessionInit'));
}
catch(exception){
    logger.color('red').bold().log("[session] Error initializing session. Read previous exception for more details. Shutting down server.");
    return;
}

// Default session variables.
const setSessionDefaults = function(req){
    req.session.playerData = {};
    req.session.playerData.cookieID = Math.floor(Math.random()*1000000000)
    req.session.playerData.loggedIn = false;
    req.session.playerData.loggedInId = 0;
}
const logOut = function(req) { req.session.playerData.loggedIn = false; req.session.playerData.loggedInId = 0; }

app.get("/api/init",(req,res)=>{
    // Initialize session data
    if(req.session.playerData == null){
        setSessionDefaults(req);
    }
    //
    if(User.userDoesExistId(req.session.playerData.loggedInId)){
        User.updateLastOnline(req.session.playerData.loggedInId);
    }
    else{ logOut(req) }
    res.send(req.session.playerData);
})

// AUTH
app.use('/api/auth',require('./api/auth/authRoutes').router);
// GET USER INFO
app.use('/api/userinfo',require('./api/users/userInfo').router);
// GET PARTY INFO
app.use('/api/partyinfo',require('./api/parties/partyinfo').router);
// GET STATE INFO
app.use('/api/stateinfo',require('./api/states/stateinfo').router);
// DEVELOPMENT ROUTES
app.use('/api/misc/development',require('./api/misc/development').router);

app.use(express.static('dist'));

app.get("/*", function(req,res){
    res.sendFile(path.join(__dirname + '../../../dist/index.html'));
})

app.listen(process.env.PORT || 8080, () => console.log(`Listening on port ${process.env.PORT || 8080}!`));


