var express = require("express");
var router = express.Router();
var bcrypt = require("bcryptjs");
var User = require("../../classes/User");
const setSessionDefaults = require("../../classes/Misc/setSessionDefaults");
const {
  setSessionAuthorized,
} = require("../../classes/Misc/setSessionDefaults");
const requestIP = require("request-ip");

router.get("/logout", function (req, res) {
  req.session.playerData.loggedIn = false;
  req.session.playerData.loggedInId = 0;
  req.session.playerData.loggedInInfo = null;
  req.session.playerData.admin = 0;

  res.send(req.session.playerData);
});

router.post("/login", function (req, res) {
  console.log();
  const providedUsername = req.body.username;
  const providedPassword = req.body.password;

  var db = require("../../db");
  var sql =
    "SELECT * FROM users WHERE username =" + db.escape(providedUsername);

  var userCheckQuery = db.query(sql, function (err, result) {
    if (err) {
      throw err;
    } else {
      // If the username they've provided exists and if the password matches.
      if (
        result.length == 1 &&
        bcrypt.compareSync(providedPassword, result[0].password)
      ) {
        // Now we change the session data.
        setSessionAuthorized(req, result[0]);
        res.send(req.session.playerData);
      } else {
        res.send({ error: "Authentication failed." });
      }
    }
  });
});

router.post("/register", async function (req, res) {
  var ip = requestIP.getClientIp(req);

  var cookieID;
  if (req.session.playerData == null) {
    setSessionDefaults(req);
  }
  var cookieID = req.session.playerData.cookieID;

  let db = require("../../db");
  const { username, password, politicianName, state, country, ecoPos, socPos } =
    req.body;

  let matchingUsers = await User.userDoesExist(politicianName);

  let salt = bcrypt.genSaltSync(10);
  let hash = bcrypt.hashSync(password, salt);

  if (matchingUsers == 0) {
    var sql = `INSERT INTO users 
        (username, password, regCookie, currentCookie, 
        regIP, currentIP, politicianName, lastOnline, state, 
        nation, ecoPos, socPos) 
        VALUES (${db.escape(username)},${db.escape(
      hash
    )},'${cookieID}','${cookieID}','${ip}','${ip}',
        ${db.escape(politicianName)},${Date.now()},${db.escape(
      state
    )},${db.escape(country)},${db.escape(ecoPos)},${db.escape(socPos)})`;

    db.query(sql, function (err, result) {
      if (err) throw err;
      req.session.playerData.loggedIn = true;
      req.session.playerData.loggedInId = result.insertId;

      res.send(req.session.playerData);
    });
  } else {
    res.send({ error: "Politician already exists!" });
  }
});

router.post("/setUserImage", function (req, res) {
  if (req.session.playerData) {
    if (req.session.playerData.loggedIn) {
      var db = require("../../db");
      var sql = `UPDATE users SET profilePic=${db.escape(
        req.body.pictureUrl
      )} WHERE id=${req.session.playerData.loggedInId}`;
      db.query(sql, function (err, response) {
        if (err) throw err;
        else {
          res.sendStatus(200);
        }
      });
    }
  }
});

router.post("/setUserBio", function (req, res) {
  if (req.session.playerData) {
    if (req.session.playerData.loggedIn) {
      if (req.body.bio.length < 1000) {
        let db = require("../../db");
        var sql = `UPDATE users SET bio=${db.escape(req.body.bio)} WHERE id=${
          req.session.playerData.loggedInId
        }`;
        db.query(sql, function (err, response) {
          if (err) throw err;
          else {
            res.sendStatus(200);
          }
        });
      }
    }
  }
});

module.exports.router = router;
