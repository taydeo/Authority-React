const express = require('express');
const logger = require('node-color-log');
const cookieSession = require('cookie-session');
const app = express();
const path = require('path');

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
    req.session.playerData.loggedIn = false;
    req.session.playerData.loggedInId = 0;
}

app.get("/api/init",(req,res)=>{
    // Initialize session data
    if(req.session.playerData == null){
        setSessionDefaults(req);
    }
    //
    res.send(req.session.playerData);
})

// AUTH
app.use('/api/auth',require('./api/auth/authRoutes').router);
// GET USER INFO
app.use('/api/userinfo',require('./api/users/userInfo').router);
// GET PARTY INFO
app.use('/api/partyinfo',require('./api/parties/partyinfo').router);
// DEVELOPMENT ROUTES
app.use('/api/misc/development',require('./api/misc/development').router);

app.use(express.static('dist'));

app.get("/*", function(req,res){
    res.sendFile(path.join(__dirname + '../../../dist/index.html'));
})

app.listen(process.env.PORT || 8080, () => console.log(`Listening on port ${process.env.PORT || 8080}!`));


