const express = require('express');
const logger = require('node-color-log');
const path = require('path');
const User = require('./classes/User');
const axios = require('axios');
const { setSessionDefaults } = require('./classes/Misc/setSessionDefaults');


// RATE LIMIT MIDDLEWARE: https://www.npmjs.com/package/express-rate-limit
const rateLimit = require('express-rate-limit');
const limiter = rateLimit({
    windowMs: 1 * 60 * 1000, // 1 minute
    max: 200 // limit each IP to 100 requests per windowMs
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

const logOut = function(req) { req.session.playerData.loggedIn = false; req.session.playerData.loggedInId = 0; }

app.get("/api/init",async (req,res)=>{
    // Initialize session data
    if(req.session.playerData == null){
        setSessionDefaults(req);
    }
    //
    if(req.session.playerData.loggedIn){
        let userDoesExist = await User.userDoesExistId(req.session.playerData.loggedInId).then((result)=>{return result;}).catch((err)=>console.log(err));
        if(userDoesExist){
            User.updateLastOnline(req.session.playerData.loggedInId);

            const resp = await axios.get(`http://localhost:8080/api/userInfo/fetchUserById/${req.session.playerData.loggedInId}/true`)
            .then((response)=>{return response})
            .catch((err)=>res.send({error:"Logged in, but player does not exist."}));
            if(resp != "Not Found"){
                req.session.playerData.loggedInInfo = resp.data;
            }

        }
        else{ 
            logOut(req) 
        }
    }
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


