var currentPlayer = {};
var currentPlayerNum = 1;
var data;
var currentCoupling;
var rightSide;
var leftSide;
var shuffleRightSide;

var addPoints = AppSettings.Couplings.addPoints;

useData();

// use data from local storage
function useData() {
    window.onload = function () {
        document.getElementById('nameP1').innerHTML = storedData[0].Name;
        document.getElementById('nameP2').innerHTML = storedData[1].Name;
        document.getElementById('nameP1mar').innerHTML = storedData[0].Name;
        document.getElementById('nameP2mar').innerHTML = storedData[1].Name;

        document.getElementById('picP0').src = storedData[0].Image;
        document.getElementById('picP1').src = storedData[1].Image;

       	document.getElementById('pointsP1').innerHTML = storedData[0].Points;
        document.getElementById('pointsP2').innerHTML = storedData[1].Points;

        document.getElementById('picP0').style.borderColor = storedData[0].Color;
        document.getElementById('picP1').style.borderColor = storedData[1].Color;

        counterGame();
        Time(time_min);
        downloadAPI();
        SwitchPlayer();
        if(AppSettings.CounterNewGame%2==0) {
            SwitchPlayer();
        }
    };
}
// time
var time_min = AppSettings.Couplings.time_min * 600;
function Time(time) {
    var elem = document.getElementById("progressTime");
    var height = 1;
    var id = setInterval(frame, time);

    function frame() {
        if (height >= 100) {
            clearInterval(id);
            loadingNextGame(time_progress_Sec);
            for (var i = 0; i < 10; i++) {
                document.getElementById('right' + i).style = "pointer-events:none;";
            }
        }
        else {
            height++;
            elem.style.height = height + '%';
        }
    }
}
// inner data from json
var API_Base_Couplings = AppSettings.Couplings.API_Base_Couplings;
function downloadAPI() {
	var request = new XMLHttpRequest;
    request.open('GET',API_Base_Couplings);
    request.send();

    request.onload = async function () {
        data = await JSON.parse(this.response);
        randomNum = Math.floor(Math.random() * data.length);

        if(AppSettings.CounterNewGame%2) {
            AppSettings.Couplings.randomNum = randomNum;
            localStorage.setItem("AppSettings", JSON.stringify(AppSettings));
        }else {
            var ranCouplingsJson = AppSettings.Couplings.randomNum;
            if (randomNum == ranCouplingsJson) {
                downloadAPI();
                return;
            }
        }

        currentCoupling = data[randomNum];
        leftSide = currentCoupling.left
        rightSide = currentCoupling.right
        innerData('left');
        innerData('right')
    }
}
// shuffle right side
function shuffleRight(shuffleRightSide) {
  for (var c = shuffleRightSide.length - 1; c > 0; c--) {
    var b = Math.floor(Math.random() * (c + 1));
    var a = shuffleRightSide[c];
    shuffleRightSide[c] = shuffleRightSide[b];
    shuffleRightSide[b] = a;
  }
  return shuffleRightSide
};
// inner data in field
function innerData(side) {
    document.getElementById('left0').style = "background : #3495DB";
    document.getElementById('textQuestion').innerHTML = currentCoupling.QuestionText;
	let arrSide;
	if(side=='left'){
		arrSide=leftSide;
        for (var i = 0; i < arrSide.length; i++) {
        document.getElementById(side + i).innerHTML = arrSide[i][side+i];
        }
    }
	else if (side=='right') {
        arrSide = rightSide;
        shuffleRightSide = [];
        for (var i = 0; i < arrSide.length; i++) {
        shuffleRightSide.push(arrSide[i][side+i]);
        };
        shuffleRight(shuffleRightSide);
        for (var i = 0; i < shuffleRightSide.length; i++) {
        document.getElementById(side + i).innerHTML = shuffleRightSide[i];
        }
    } 
}
// comparation items 
var n = 0;
var dataLeft;
var dataRight;
var rightSideJson;
var leftSideJson;
function comparisonItems(id) {
    dataLeft = document.getElementById('left'+n).innerHTML;
    dataRight = document.getElementById(id).innerHTML;

    for (var i = 0; i < rightSide.length; i++) {
        rightSideJson = rightSide[i]["right"+i];
        leftSideJson = leftSide[i]["left"+i];

        if ((dataLeft+dataRight)==(leftSideJson+rightSideJson)) {
            document.getElementById('left'+n).style = "background : green";
            document.getElementById(id).className = "disableField";
            nCoupling();
            UpdatePoints();
            assignmentPoints();
            return;
        }else {
            document.getElementById('left'+n).style = "background : red";
        }
    }
    nCoupling();
}
var n; 
var x = 0;
function nCoupling() {
    for (var i = 0; i <= 10; i++) {

        if (i < 10) {
            let color = document.getElementById('left' + i).style.background;

            if (color == 'none' || color == '') {
                document.getElementById('left' + i).style.background = "#3495DB";
                n = i; 
                break;
            }
        }
        else {
            if(x==0) {
                allTrue();
            }
            else{
                loadingNextGame(time_progress_Sec);
                for (var i = 0; i < 10; i++) {
                    document.getElementById('right' + i).style = "pointer-events:none;";
                }
            }
        }
    }
}
var z= 0;
function allTrue() {
    for (var i = 0; i <= 9; i++) {
        if (document.getElementById('left' + i).style.background == "green") {
            z= z+1;
        }
    }
    if (z == 10) {
        loadingNextGame(time_progress_Sec);
    }else {
        resetRedFields();
        SwitchPlayer();
        nCoupling();
        x++;
    }
}
function resetRedFields() {
    for (var i = 0; i <= 9; i++) {
        if (document.getElementById('left' + i).style.background == "red") {
            document.getElementById('left' + i).style = "background: none";
        }
    }
}
// how much points give player
let pointsToAdd;
function UpdatePlayerPoint(player){
    if ((dataLeft+dataRight)==(leftSideJson+rightSideJson))
        pointsToAdd = addPoints;

    storedData[player].Points = storedData[player].Points + pointsToAdd;
    localStorage.setItem("Players", JSON.stringify(storedData));
}
// loading for next game
var time_progress_Sec = AppSettings.Couplings.time_progress_Sec * 10;
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