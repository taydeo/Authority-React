function selectColor(colors, x){
    var chroma = require('chroma-js');
    var domain = [-10,10];
    var scale = chroma.scale(colors).mode('lrgb').domain(domain);
    return scale(x).hex();
}




function getEcoPositionName(position){
    str = "";
    switch(true){
        case position < -5:
            str = "<u><i>P̴͔̤̻̟͖̳͇̮̱̑̿͑̂̉͛̅̓̆́͘͘ö̷̧̯̱͚͕̪̗͎͓̠͙͕̗̙̜͈͆̊́̽͊́̐̊̕͝͠s̵̹̹̬̖͒̽͛̔͌͊͐̃͂̒̌͘̕̕â̵̧̨̡͉̹̹̯͓̱̤̦̭͎̠͙̲͑͑̊̿̕͘͜͝͝d̵̡̛̯̻̑͗͋̈́̕͘͠͠i̸͕̭̗͖̺͓͙͍͈̘͊̃̋̆͌̏̕͜s̵̨̝̝͖͖͌͐̐̃̇m̵̘̩̳͉͙͎̲̯͖͓̳̫̹̬̥̯̭̝̾̓́̒͑̐̋̋̉̀͌͛̄̚͝</i></u>";
            break;
        case position >= -5 && position <= -4.5:
            str = "Collectivism";
            break;
        case (position > -4.5) && (position <= -4):
            str = "Socialism";
            break;
        case (position > -4) && (position <= -3):
            str = "Left Wing";
            break;
        case (position > -3) && (position <= -2):
            str = "Somewhat Left Wing";
            break;
        case (position > -2) && (position <= -1):
            str = "Slightly Left Wing";
            break;
        case (position > -1) && (position < -0.1):
            str = "Center Left";
            break;
        case position >= -0.1 && position <= 0.1:
            str = "Mixed Capitalism";
            break;
        case (position > 0.1) && (position < 1):
            str = "Center Right";
            break;
        case (position >= 1) && (position < 2):
            str = "Slightly Right Wing";
            break;
        case (position >= 2) && (position < 3):
            str = "Somewhat Right Wing";
            break;
        case (position >= 3) && (position < 4):
            str = "Right Wing";
            break;
        case (position >= 4) && (position < 4.5):
            str = "Capitalism";
            break;
        case position >= 4.5 && position < 10:
            str = "Libertarianism";
            break;
        case position >= 10:
            str = "<i><u>S̷̢̡͓̩͉̦͎̝̟̬͚̉̎͌̿́͆̓͊͂̕͜L̶̹̠̹͚̀͐͊̂̆́̒̍͂̒̎̃͜͝Ä̶͖͚̝͕̻́͒̒̿̏͋̈͐̆̅̎̕͝V̴͕͌̓̓̿̃̄̏͒̈́̿͘͝Ę̷̹͍͚̞̾̓͆̋̓̔̑̈́̀͆̆̈͑̈́̅ ̶̯͈̓̄̂̓̆̄̋͂̂Ľ̵̡͈͔̭̲̹̗͈̺̘̳̪̭̭͆́͆̀Ã̸̖͚̳̖͉͇̯͖̬̟̼̊͑͋̐̿̾̍̇͑͜͝͝B̸̫̝̞͔̰̯̰̅͒̋̊̉̃̊͘O̸͓̹̭̼͈͚̠̿͐̀͒̒̀̈̇͐̌̍͆̉͘R̵̨̧̺̮̜̭̠̤̖̽̽̒̈́̀ͅ</u></i>";
            break;
    }
    return str;
}
function getSocPositionName(position){
    str = "";
    switch(true){
        case position <= -5 && position< -4.5:
            str = "Anarchism";
            break;
        case (position >= -4.5) && (position <= -4):
            str = "Communalism";
            break;
        case (position > -4) && (position <= -3):
            str = "Left Wing";
            break;
        case (position > -3) && (position <= -2):
            str = "Somewhat Left Wing";
            break;
        case (position > -2) && (position <= -1):
            str = "Slightly Left Wing";
            break;
        case (position > -1) && (position < -0.1):
            str = "Center Left";
            break;
        case position >= -0.1 && position <= 0.1:
            str = "Centrist";
            break;
        case (position > 0.1) && (position < 1):
            str = "Center Right";
            break;
        case (position >= 1) && (position < 2):
            str = "Slightly Right Wing";
            break;
        case (position >= 2) && (position < 3):
            str = "Somewhat Right Wing";
            break;
        case (position >= 3) && (position < 4):
            str = "Right Wing";
            break;
        case (position >= 4) && (position < 4.5):
            str = "Authoritarian Right";
            break;
        case position >= 4.5 && position < 10:
            str = "Totalitarian Right";
            break;
        case position >= 10:
            str = "<i><u>P̷̧̛̘̅̄̆̓͋̐̊̏͝͝Ú̷̝̼͚͙͍̣͇͚͎̯̠̲̩̖̙̪̩̉͠R̷̨̘̳̽̍̈́G̸̡͇͉͈̲̮̼͍̬̩̪̰̖͇̳̺͚̼͙̻̤͐̓̑͋͑̋̊́͌̾́͝Ę̶̛̛͈̟̪̭̱͖͉̻̤̖͓̟̣͔͔̣͋͌̍̇̔̎̒͗͂̌̉̃̐̆̐̕ ̵̨̢̫̫͉̼̠̰̝͇͎͍̞̯̉͒͂̐̐͌̎T̵͆̎̄̈́͛̆̋̏̊̈́̋͊͂͜͠͠͝H̴̥̦̋̚È̴͈͕̭̼̪̬̻̗̯̟̦̜̥͕͎͙̻̔͐̀͑͂̐͒̀͆̆̓̅̉̂̌̈́̐͘̕͜ ̴̡̢̝͚̰̱͔͍̝̘͎̫̟̲́̐͐̊͒͑͒̄͊͐̆̊́̒̚͜W̴̡̡̹̼̰̥̻͚̭͚̟̠̞̺̝̎͊̒̒̒͒̂̌̏̑̃̄͒̕̕͝O̵̰͓̳̲̤͚̤͈͓̱͇͔̰̐͋̽͊͝ͅŖ̵̦̺͉̗͈̞͕̟͙͔̩͎͙͙̺͙͍̈́͑͂̉͐͌͑̂͐̉ͅL̵̡̺̳̭̩̳̒̉̏͌̐͛͊̈́̍͐̽͛͐̀͊͗͠Ḓ̶̨̨̙͎͚̮̘̲̺͙̹͇̜̄̈́͜</u></i>";
            break;
    }
    return str;
}
function getPositionName(positionType, position){
    if(positionType == "social"){
        return getSocPositionName(position);
    }
    else if(positionType=="economic"){
        return getEcoPositionName(position);
    }
}

module.exports = {
    selectColor,
    getPositionName
}