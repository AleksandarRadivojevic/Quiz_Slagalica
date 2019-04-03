var currentPlayer = {};
var currentPlayerNum = 1;
var openFieldsCouter; // Broji koliko je polja otvoreno u jednoj koloni
var ranAss;
var statusNum = 1;
var timeOn = true;
var currentAssociation;

UseData();

// poents dipends of open fields
var points_fieldsNotOpen = AppSettings.Association.points_fieldsNotOpen;
var points_openOneField = AppSettings.Association.points_openOneField;
var points_openTwoFields = AppSettings.Association.points_openTwoFields;
var points_openThreeFields = AppSettings.Association.points_openThreeFields;
var points_openFourFields = AppSettings.Association.points_openFourFields;
var points_finallyField = AppSettings.Association.points_finallyField;

// use data from local storage
function UseData() {
    window.onload = function () {
        document.getElementById('nameP1').innerHTML = storedData[0].Name;
        document.getElementById('nameP2').innerHTML = storedData[1].Name;

        document.getElementById('picP1').src = storedData[0].Image;
        document.getElementById('picP2').src = storedData[1].Image;

        document.getElementById('p0').style.borderColor = storedData[0].Color;
        document.getElementById('p1').style.borderColor = storedData[1].Color;

        downloadAPI();
        counterGame();
        SwitchPlayer();
        if(AppSettings.CounterNewGame%2==0) {
            SwitchPlayer();
        }
        Time(time_min);
        assignmentPoints();
    };
}
// download API and set on local storage
var API = AppSettings.Association.API;
function downloadAPI() {
    var request = new XMLHttpRequest;
    request.open('GET', API);
    request.send();

    request.onload = async function () {
        var data = await JSON.parse(this.response);
        ranAss = Math.floor(Math.random() * data.length);
        currentAssociation = data[ranAss];
        
        if(AppSettings.CounterNewGame%2) {
            AppSettings.Association.ranAss = ranAss;
            localStorage.setItem("AppSettings", JSON.stringify(AppSettings));
        }else {
            var ranAssJson = AppSettings.Association.ranAss;
            if (ranAss == ranAssJson) {
                downloadAPI();
            }
        }
    }
}
// how much field is opened with your answer
function countOpenFields(id) {
    openFieldsCouter = 0;
    for (var i = 1; i <= 4; i++) {
        let x = document.getElementById(id + i).innerHTML;
        if (x.length != 2)
            openFieldsCouter++;
    }
}
// time
var time_min = AppSettings.Association.time_min * 600;
function Time(time_min) {
    var elem = document.getElementById("progress");
    var height = 1;
    var id = setInterval(frame, time_min);

    function frame() {
        if (!timeOn)
            height = 100;
        if (height >= 100) {
            visibilityPlayers(0);
            visibilityPlayers(1);
            showAssociation();
            loadingNextGame(time_progress_Sec);
            clearInterval(id);
        }
        else {
            height++;
            elem.style.height = height + '%';
        }
    }
}
// show full association after time is up
function showAssociation() {
    let colChar = ['A', 'B', 'C', 'D'];
    for (let i = 0; i <= 3; i++) {
        let element = document.getElementById(colChar[i]).value;
        if (element == '') {
            countOpenFields(colChar[i]);
        }
    colorizeColumns(colChar[i], currentAssociation["finally"]);
    }
    colorizeFinallyField();
}
// open field
function openField(id) {
    document.getElementById(id).innerHTML = currentAssociation[id];
    document.getElementById(id).style = "pointer-events:none;";
    eventEnableDisable("field","none");
}
// switch color players and cloud      -----FRAMEWORKS no possibile because we call event
function SwitchPlayer() {
    let holdingPlayer = currentPlayerNum;

    if (currentPlayerNum == 0)
        currentPlayerNum = 1;
    else currentPlayerNum = 0;

    let n = currentPlayerNum;

    currentPlayer.Name = storedData[n].Name;
    currentPlayer.Image = storedData[n].Image;
    currentPlayer.Color = storedData[n].Color;
    shadowBlack = "#000000";

    SwitchPlayerStyle('visible', n, storedData[holdingPlayer].Color, 'activePlayer');
    SwitchPlayerStyle('hidden', holdingPlayer, shadowBlack, 'player');
    eventEnableDisable("field","auto");
}
function SwitchPlayerStyle(visibility, playerNum, shadow, className) {
    document.getElementById('alertSwitchP' + playerNum).style = "visibility: " + visibility +";";
    var element1 = document.getElementById('p' + playerNum);
    element1.className = className;
    element1.style.boxShadow = "0 0 50px " + shadow;
}
// visibility players when time is up
function visibilityPlayers(num) {
    document.getElementById('alertSwitchP' + num).style = "visibility: hidden;";
}
// check field A;B;C;D
function checkField(event, id) {
    if (event.which == 13) {
        let field = document.getElementById(id).value;
        let fieldResult = currentAssociation[id];

        if (field.toLowerCase() == fieldResult.toLowerCase()) {
            document.getElementById(id).blur(); //lose cursor
            colorizeField(id, fieldResult);
            countOpenFields(id);

            for (i = 1; i <= 4; i++) {
                colorizeField(id + i, fieldResult)
            }
            UpdatePoints();
            assignmentPoints();
        }
        else {
            document.getElementById(id).value = "";
            SwitchPlayer();
        }
    };
}
// finally field
function checkFinally(event,id) {
    if (event.which == 13) {
        var fieldFinally = document.getElementById('finally').value;
        var fieldFinallyMemory = currentAssociation['Finally'];
        if (fieldFinally.toLowerCase() == fieldFinallyMemory.toLowerCase()) {
            timeOn = false;
            let colChar = ['A', 'B', 'C', 'D'];
            for (let i = 0; i <= 3; i++) {
                let element = document.getElementById(colChar[i]).value;
                if (element == '') {
                    countOpenFields(colChar[i]);
                    UpdatePoints();
                }
                colorizeColumns(colChar[i], currentAssociation[id]);
            }
            colorizeFinallyField();
            UpdatePoints();
            assignmentPoints();
        }else {
            document.getElementById('finally').value = "";
            SwitchPlayer();
        }
    }
}
let pointsToAdd;
// how much points give player
function UpdatePlayerPoint(player){
    let x = storedData[0].Points;
    let sum = storedData[player].Points;

        switch (openFieldsCouter) {
          case 0:
            pointsToAdd = points_fieldsNotOpen;
            break;
          case 1:
            pointsToAdd = points_openOneField;
            break;
          case 2:
            pointsToAdd = points_openTwoFields;
            break;
          case 3:
            pointsToAdd = points_openThreeFields;
            break;
          case 4:
            pointsToAdd = points_openFourFields;
            break;
        }
        storedData[player].Points = sum + pointsToAdd;
        localStorage.setItem("Players", JSON.stringify(storedData));
}
// colorize finally Field
function colorizeFinallyField() {
    var fieldFinallyMemory = currentAssociation['Finally'];
    var finallyField = document.getElementById('finally');
    finallyField.blur(); //lose cursor
    finallyField.value = fieldFinallyMemory;
    finallyField.className = "finallyCorrectField";
    finallyField.style = "background-color: aquamarine;" + "color: black;";
}
// colorize field   PROBLEM DA MU SKINEM SERVIS
function colorizeField(id, fieldResult) {
    var element = document.getElementById(id);

    var request = new XMLHttpRequest;
    request.open('GET', API);
    request.send();

    request.onload = async function () {
        var data = await JSON.parse(this.response);
        let fieldResult = data[ranAss][id];
        element.value = fieldResult;
        element.innerHTML = fieldResult;
        element.className = "correctField";
    }
}
// colorize columns
function colorizeColumns(id, data) {
    for (var i = 1; i <= 4; i++) {
        var currentField = id + i;
        var fieldResult0 = currentAssociation[currentField];
        var newCurrent = document.getElementById(currentField);
        newCurrent.value = fieldResult0;
        newCurrent.className = "correctField";
        newCurrent.innerHTML = fieldResult0;
    }
    colorizeField(id, data);
}
// loading for result 
var time_progress_Sec = AppSettings.Association.time_progress_Sec * 10;
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