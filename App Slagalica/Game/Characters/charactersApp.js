var int;
var id;
var currentPlayer = {};
var currentPlayerNum = 1;
var characters;
var player1Char;
var player2Char;
var playerWord;
var playerWordMin;
var currentName;
let sum = 0;
let activeMin = false;

useData();

// points for how much characters have a word
var points_2char = AppSettings.Characters.points_2char;
var points_3char = AppSettings.Characters.points_3char;
var points_4char = AppSettings.Characters.points_4char;
var points_5char = AppSettings.Characters.points_5char;
var points_6char = AppSettings.Characters.points_6char;
var points_7char = AppSettings.Characters.points_7char;
var points_8char = AppSettings.Characters.points_8char;
var points_9char = AppSettings.Characters.points_9char;
var points_10char = AppSettings.Characters.points_10char;
var points_11char = AppSettings.Characters.points_11char;
var points_12char = AppSettings.Characters.points_12char;


// use data from local storage
function useData() {
    window.onload = function () {
        document.getElementById('nameP1').innerHTML = storedData[0].Name;
        document.getElementById('nameP2').innerHTML = storedData[1].Name;
        document.getElementById('nameP1mar').innerHTML = storedData[0].Name;
        document.getElementById('nameP2mar').innerHTML = storedData[1].Name;
        document.getElementById('modalNameP1').innerHTML = storedData[0].Name;
        document.getElementById('modalNameP2').innerHTML = storedData[1].Name;

        document.getElementById('picP0').src = storedData[0].Image;
        document.getElementById('picP1').src = storedData[1].Image;

       	document.getElementById('pointsP1').innerHTML = storedData[0].Points;
        document.getElementById('pointsP2').innerHTML = storedData[1].Points;

        document.getElementById('picP0').style.borderColor = storedData[0].Color;
        document.getElementById('picP1').style.borderColor = storedData[1].Color;
        
        insertWord();
        ShuffleCharacters(1);
        counterGame();
        SwitchPlayer();
        if(AppSettings.CounterNewGame%2==0) {
            SwitchPlayer();
        }
        eventEnableDisable("letter","none");
    };
}
// time
var time_min = AppSettings.Characters.time_min * 600;
function Time(time) {
    var elem = document.getElementById("progressTime");
    var height = 1;
    var id = setInterval(frame, time);

    function frame() {
        if (height >= 100) {
            clearInterval(id);
            displayModalStart('displayModal','display: block;');
        }
        else {
            height++;
            elem.style.height = height + '%';
        }
    }
}
// change charters
var canShaffle = true;
var speedShuffleCharacter = AppSettings.Characters.shuffleCharacterStyle_msec;
function randomCharacter(Length) {
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPRSTUVZ";
    for( var i=0; i < Length; i++ )
        text += possible.charAt(Math.floor(Math.random() * possible.length));
        return text;
}
function ShuffleCharacters(Length){
    if (canShaffle == true) {
        int = setInterval(function(){
            for (var i = 0; i <= 11; i++) {
                document.getElementById("letter" + i).innerHTML = randomCharacter(Length);
            }
        },speedShuffleCharacter);
    }
}
// stop characters
function stopCharacter() {
    clearInterval(int);
    innerData();
    Time(time_min);
    document.getElementById('btnStop').style = "display: none;";
    document.getElementById('alertMsg').style = "display: block;"
}
// input character in result
function inputChar(id) {
    document.getElementById('confirm').style = "pointer-events:auto;";
    document.getElementById("reset").style.pointerEvents = "auto";
    var chart = document.getElementById(id).innerHTML;
    document.getElementById("playerWord").value += chart;
    document.getElementById(id).style = "visibility: hidden;";
}
// delete letters from reslt
function deleteResult() {
    for (var i = 0; i < 12; i++) {
        document.getElementById('letter' + i).style = "visibility: visible;";
    }  
}
// use word from json 
var API_Base_Characters = AppSettings.Characters.API_Base_Characters;
function insertWord() {
    var request = new XMLHttpRequest;
    request.open('GET', API_Base_Characters);
    request.send();

    request.onload = async function () {
        var data = await JSON.parse(this.response);
        randomNum = Math.floor(Math.random() * data.length);

        if(AppSettings.CounterNewGame%2) {
            AppSettings.Characters.randomNum = randomNum;
            localStorage.setItem("AppSettings", JSON.stringify(AppSettings));
        }else {
            var ranCharJson = AppSettings.Characters.randomNum;
            if (randomNum == ranCharJson) {
                insertWord();
            }
        }
        
        currentName = data[randomNum];
        characters = currentName.split("");
        shuffleArray(characters);
    }
}
// inner data in letter
function innerData() {
    for (var i = 0; i < characters.length; i++) {
        document.getElementById('letter' + i).innerHTML = characters[i];
    }
}
// shuffle Characters
function shuffleArray(characters) {
  for (var c = characters.length - 1; c > 0; c--) {
    var b = Math.floor(Math.random() * (c + 1));
    var a = characters[c];
    characters[c] = characters[b];
    characters[b] = a;
  }
  return characters
};
// check who have bigger word
function resetNum() {
    document.getElementById('player1Char').style = "border: 1px solid red;" + "width: 40px;";
    document.getElementById('player2Char').style = "border: 1px solid red;" + "width: 40px;";
    document.getElementById('player1Char').style = "border: 1px solid #ccc;" + "width: 40px;";
    document.getElementById('player2Char').style = "border: 1px solid #ccc;" + "width: 40px;"
}
function checkChar() {
    document.getElementById('alertMsg').style = "display: none;"
    document.getElementById('confirm').style = "display: block;"
    resetNum();
    player1Char = parseInt(document.getElementById('player1Char').value);
    player2Char = parseInt(document.getElementById('player2Char').value);   

    if (!player1Char) 
        document.getElementById('player1Char').style = "border: 1px solid red;" + "width: 40px;"
    else if (!player2Char) 
        document.getElementById('player2Char').style = "border: 1px solid red;" + "width: 40px;"
    else {
    eventEnableDisable("letter","auto");
    document.getElementById('displayModal').style = "display: none;";
    };

    if ((currentPlayerNum == 0 && player1Char < player2Char) || 
        (currentPlayerNum == 1 && player1Char > player2Char)) {
        SwitchPlayer();
    }
}
// check if is correct word 
var API_GoogleTranslate = AppSettings.Characters.API_GoogleTranslate;
function checkCorrectWord() {
    if (activeMin == false) 
        var resFinal = playerWord.toLowerCase();
    else var resFinal = playerWordMin.toLowerCase();

    var request = new XMLHttpRequest(); // Create a request variable and assign a new XMLHttpRequest object to it.
    request.open('GET', API_GoogleTranslate + resFinal + '', true); // Open a new connection, using the GET request on the URL endpoint
    request.send();

    request.onload = function () {
        var data = JSON.parse(this.response);
        //Is grammatically correct word?
        let tempWord = data[0][0];
        
        if(tempWord[0] != tempWord[1]){
            displayModalStart('modalSucsBG','display: block;')
            document.getElementById('computerWord').innerHTML = currentName.toUpperCase();
            extraPoints();
            UpdatePoints();
            assignmentPoints();
            loadingNextGame(time_progress_Sec);
        }
        else if (activeMin == false) {
            displayModalStart('modalFailedBG','display: block;');
            document.getElementById('charFault').innerHTML = document.getElementById('playerWord').value;
            document.getElementById('playerWord').value = "";
            activeMin = true;
            SwitchPlayer();
            deleteResult();
        }else {
            displayModalStart('modalFailedBG','display: block;');
            document.getElementById('charFault').innerHTML = document.getElementById('playerWord').value;
            loadingNextGame(time_progress_Sec);
        }
      }
}
// check word if is the same num length
function checkWord() {
    document.getElementById('confirm').style = "pointer-events:none;";
    if (activeMin == false) {
        playerWord = document.getElementById('playerWord').value;
        var x = Math.max(player1Char, player2Char);
        if (x == playerWord.length) {
            checkCorrectWord();
        }else {
            displayModalStart('modalErorBG','display: block;');
            document.getElementById('logCharNum').innerHTML = x;
            document.getElementById('charNum').innerHTML = playerWord.length;
            document.getElementById('playerWord').value = "";
            activeMin = true;
            SwitchPlayer();
            deleteResult();
        };
    }else {
        playerWordMin = document.getElementById('playerWord').value;
        var x = Math.min(player1Char, player2Char);
        if (x == playerWordMin.length) {
            checkCorrectWord();
        }else {
            displayModalStart('modalErorBG','display: block;');
            document.getElementById('logCharNum').innerHTML = x;
            document.getElementById('charNum').innerHTML = playerWordMin.length;
            loadingNextGame(time_progress_Sec);
            
        }
    }
}
// check if player have bigger word from computer
function extraPoints() {
    if (activeMin == false) {
        if (playerWord.length > currentName.length) {
            sum = sum + 6;
        }else if (playerWord.length == currentName.length) {
            sum = sum + 3;
        }
    }else {
        if (playerWordMin > currentName.length) {
            sum = sum + 6;
        }else if (playerWordMin == currentName.length) {
            sum = sum + 3;
        }
    }
}
// how much points give player
let pointsToAdd;
function UpdatePlayerPoint(player){
    let x = storedData[0].Points;
    sum = sum + storedData[player].Points;
    pointsToAdd;
    if (activeMin == false) { 
        counterPoint = playerWord.length;
    }else {
        counterPoint = playerWordMin.length;
    };

        switch (counterPoint) {
          case 2:
            pointsToAdd = points_2char;
            break;
          case 3:
            pointsToAdd = points_3char;
            break;
          case 4:
            pointsToAdd = points_4char;
            break;
          case 5:
            pointsToAdd = points_5char;
            break;
          case 6:
            pointsToAdd = points_6char;
            break;
          case 7:
            pointsToAdd = points_7char;
            break;
          case 8:
            pointsToAdd = points_8char;
            break;
          case 9:
            pointsToAdd = points_9char;
            break;
          case 10:
            pointsToAdd = points_10char;
            break;
          case 11:
            pointsToAdd = points_11char;
            break;
          case 12:
            pointsToAdd = points_12char;
            break;
        }

        storedData[player].Points = sum + pointsToAdd;
        localStorage.setItem("Players", JSON.stringify(storedData));
}
// loading for next game
var time_progress_Sec = AppSettings.Characters.time_progress_Sec * 10;
function loadingNextGame(progresTime) {
    document.getElementById('boxProgress').style = "visibility: visible;";
    var elem = document.getElementById("progressBar");
    var width = 1;
    var id = setInterval(frame, progresTime);

    function frame() {
        if (width >= 100) {
            nextGame();
            clearInterval(id);
        }
        else {
            width++;
            elem.style.width = width + '%';
        }
    }
}