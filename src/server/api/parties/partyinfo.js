var express = require("express");
var router = express.Router();
var isnumber = require("is-number");
var partyClass = require("../../classes/Party/Party");

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

module.exports.router = router;
