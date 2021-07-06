var each = require('foreach');

function userHasPerm(userId, partyInfo, permName) {
  const partyRoles = partyInfo.partyRoles;
  var hasPerm = false;
  if (partyInfo) {
    Object.keys(partyRoles).forEach(function (key) {
      var perms = partyRoles[key].perms;
      Object.keys(perms).forEach(function (key) {
        let permission = key;
        let value = perms[permission];
        if (permission == "leader" && value == 1) {
          hasPerm = true;
        } else {
          if (permission == permName && value == 1) {
            hasPerm = true;
          }
        }
      });
    });
  }
  return hasPerm;
}

function getLeaderInfo(partyInfo, nameOrID) {
    var returnVariable = "";
    if(partyInfo){
        each(partyInfo.partyRoles, function(role,roleTitle){
            each(role.perms, function(value,key){
                if(key == "leader" && value == 1){
                    if(nameOrID == "title"){
                        returnVariable = roleTitle;
                    }
                    if(nameOrID == "id"){
                        returnVariable = role.occupant;
                    }
                }
            })
        })
    }
    return returnVariable;
}
function generateRoleList(partyInfo, includeLeader=false){
    var partyRoleJSON = [];
    if(partyInfo){
        each(JSON.parse(partyInfo.partyRoles), function(role,roleTitle){
            var roleJSON = {
                roleName:roleTitle,
                roleOccupant:role.occupant,
                rolePermissions:[],
                isLeader:0
            }
            each(role.perms, function(permissionValue, permission){
                if(permissionValue == 1){
                    if(permission == "leader"){
                        roleJSON.isLeader = 1;
                    }
                    roleJSON.rolePermissions.push(permission)
                }
            })
            if(roleJSON.isLeader){ 
                if(includeLeader){ partyRoleJSON.push(roleJSON) }
            }
            else{
                partyRoleJSON.push(roleJSON)
            }
            ;
        })
    }
    return partyRoleJSON;

}



module.exports = {
  userHasPerm,
  getLeaderInfo,
  generateRoleList
};
