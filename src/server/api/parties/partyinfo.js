const { forEach } = require("async-foreach");
const { response } = require("express");
var express = require("express");
var router = express.Router();
var isnumber = require("is-number");
const { generateRoleList } = require("../../classes/Party/Methods");
var partyClass = require("../../classes/Party/Party");
var userClass = require("../../classes/User");

router.get("/fetchPartyById/:partyId", async function (req, res) {
  let database = require("../../db");
  let partyId = req.params.partyId;

  if (isnumber(partyId)) {
    const party = new partyClass(partyId);
    var partyInfo = await party.fetchPartyInfo().then((result)=>{return result[0]}).catch(error=>{console.log(error); return undefined});
    if(partyInfo == undefined){
      res.send({error:"Party not found."});
    }
    else{
      partyInfo.partyRoles = JSON.parse(partyInfo.partyRoles);
      res.send(partyInfo);
    }
  }
});

router.get("/partyRoleList/:partyId", async function (req, res){
  let partyId = req.params.partyId;

  const party = new partyClass(partyId);
  var partyInfo = await party.fetchPartyInfo().then((result)=>{return result[0]}).catch(error=>{console.log(error); return undefined});

  var roleList = generateRoleList(partyInfo);
  var newRoleList = [];

  for(var role of roleList){
      let user = new userClass(role.roleOccupant);
      var userInfo = await user.fetchUserInfo().then((result)=>{return result[0]}).catch(error=>{console.log(error); return undefined});
      role.occupantName = userInfo.politicianName;
      role.occupantPicture = userInfo.profilePic;
      newRoleList.push(role);
  }
  res.send(newRoleList);
})

module.exports.router = router;
