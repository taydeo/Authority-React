const md5 = require('md5');
var chars = `!#$%&()0123456789?@ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz{|}~`;

function randomString(length) {
    var result = '';
    for (var i = length; i > 0; --i) result += chars[Math.floor(Math.random() * chars.length)];
    return ''+result+'';
}

function setSessionDefaults(req){
    req.session.playerData = {};
    req.session.playerData.cookieID = randomString(18);
    req.session.playerData.loggedIn = false;
    req.session.playerData.loggedInId = 0;
}

function setSessionAuthorized(req, userRow){
    if (req.session.playerData == null || !req.session.playerData.loggedIn) {
        req.session.playerData.cookieID = randomString(18);
        req.session.playerData = {};
        req.session.playerData.loggedIn = true;
        req.session.playerData.loggedInId = userRow.id;
        req.session.playerData.admin = 0;
    }
    if (userRow.admin == 1) {
        req.session.playerData.admin = 1;
    }
}

module.exports = {
    setSessionDefaults,
    setSessionAuthorized
}