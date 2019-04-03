var currentTwoRandom;
var currentThreeRandomNum;
var currentPlayer = {};
var currentPlayerNum = 1;
var hiddenElement = [];
var player1Num;
var player2Num;

var pointsNum = AppSettings.MyNumber.pointsNum;

useData();

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
        ShuffleNum(1);
        insertNum();
        counterGame();
        SwitchPlayer();
        if(AppSettings.CounterNewGame%2==0) {
            SwitchPlayer();
        }
        document.getElementById("reset").style.pointerEvents = "none";
        eventEnableDisable("nums","none");
        eventEnableDisable("operator","none"); 
        eventEnableDisable("operatorSep","none");
    };
}
// time
var time_min = AppSettings.MyNumber.time_min * 600;
function Time(time) {
    var elem = document.getElementById("progressTime");
    var height = 1;
    var id = setInterval(frame, time);

    function frame() {
        if (height >= 100) {
            clearInterval(id);
            displayModalStart('displayModal','display: block;');
            document.getElementById("confirm").style.pointerEvents = "auto";
            document.getElementById("reset").style.pointerEvents = "auto";
        }
        else {
            height++;
            elem.style.height = height + '%';
        }
    }
}
// change num
var canShaffle = true;
var speedShuffleCharacter = AppSettings.MyNumber.shuffleCharacterStyle_msec;
function randomNum(Length) {
    var text = "";
    var possible = "0123456789";
    for( var i=0; i < Length; i++ )
        text += possible.charAt(Math.floor(Math.random() * possible.length));
        return text;
}
function ShuffleNum(Length){
    if (canShaffle == true) {
        int = setInterval(function(){
            for (var i = 0; i <= 8; i++) {
                document.getElementById("num" + i).innerHTML = randomNum(Length);
            }
        },speedShuffleCharacter);
    }
}
// stop numbers
function stopNumbers() {
    document.getElementById('btnStop').style = "display: none;";
    document.getElementById('confirm').style = "display: block;" + "pointer-events:none;";
    Time(time_min);
    clearInterval(int);
    innerData();
}
// use numbers from array
function insertNum() {
    var twoDigitNum = AppSettings.MyNumber.twoDigitNum;
    var threeDigitNum = AppSettings.MyNumber.threeDigitNum;
    twoRandomNum = Math.floor(Math.random() * twoDigitNum.length);
    threeRandomNum = Math.floor(Math.random() * threeDigitNum.length);
    currentTwoRandom = twoDigitNum[twoRandomNum];
    currentThreeRandomNum = threeDigitNum[threeRandomNum];
}
// inner data from usabile array
function innerData() {
    for (var i = 3; i <= 6; i++) {
        let num = document.getElementById('num' + i).innerHTML;
        if(num == 0){
            while(true){
                let rndNum = randomNum(1);
                if(rndNum != 0){
                    document.getElementById('num' + i).innerHTML = rndNum;
                    break;
                }
            }
        }
    }

    document.getElementById('num7').innerHTML = currentTwoRandom;
    document.getElementById('num8').innerHTML = currentThreeRandomNum;
}
// input number in result
function inputNum(id) {
    eventEnableDisable("operator","auto");
    eventEnableDisable("nums","none");
    var chart = document.getElementById(id).innerHTML;
    var chartObj = document.getElementById(id);
    document.getElementById("resFinal").value += chart; 
    hiddenElement.push(chartObj);
    listElement();
}
// input operator in result
function inputOperator(id) {
    var chart = document.getElementById(id).innerHTML;
    document.getElementById("resFinal").value += chart; 
    eventEnableDisable("operator","none");
    eventEnableDisable("nums","auto");
    listElement();
}
// input operator separator () in result
function inputOperatorSep(id) {
    var chart = document.getElementById(id).innerHTML;
    document.getElementById("resFinal").value += chart;
    eventEnableDisable("operator","auto");
    eventEnableDisable("nums","auto");   
    listElement();
}
// list hidden element
function listElement() {
    for (var i = 0; i < hiddenElement.length; i++) {
        var x = hiddenElement[i];
        x.style = "visibility: hidden;";
    }
}
// delete numbers from reslt
function deleteResult() {
    hiddenElement = [];
    for (var i = 0; i < 9; i++) {
        document.getElementById('num' + i).style = "visibility: visible;";
    }  
}
// whose number is closer
function checkNumber() {
        var num0 = document.getElementById('num0').innerHTML;
        var num1 = document.getElementById('num1').innerHTML;
        var num2 = document.getElementById('num2').innerHTML;
        var currentRes = num0 + num1 + num2;

        player1Num = document.getElementById('player1Num').value;
        player2Num = document.getElementById('player2Num').value;

        var playP1 = Math.abs(currentRes - player1Num);
        var playP2 = Math.abs(currentRes - player2Num);
        
        if (AppSettings.CounterNewGame%2!=0 && playP2 < playP1) {
            SwitchPlayer();
            document.getElementById('result').innerHTML = player2Num;
        }
        else if(AppSettings.CounterNewGame%2==0 && playP1 < playP2){
            SwitchPlayer();
            document.getElementById('result').innerHTML = player1Num;
        }else if (playP1 == playP2) {
            document.getElementById('result').innerHTML = player1Num;
        }

        document.getElementById('showResP1').value = player1Num;
        document.getElementById('showResP2').value = player2Num;
        eventEnableDisable("nums","auto");
        eventEnableDisable("operatorSep","auto");
        closeModal('displayModal','display: none;')
}
// check which number is correct
var secoundClick = false;
function correctNum() {
    if (secoundClick == false) {
        document.getElementById("confirm").style.pointerEvents = "none";
        var result = document.getElementById('result').innerHTML;
        var resFinal = document.getElementById('resFinal').value;
        var resultFinal = eval(resFinal);

        if (result == resultFinal) {
            displayModalStart('modalSucsBG','display: block;');
            UpdatePoints();
            assignmentPoints();
            loadingNextGame(time_progress_Sec);

        }else {
            document.getElementById('trueNum').innerHTML = document.getElementById('result').innerHTML;
            document.getElementById('falseNum').innerHTML = resultFinal;
            displayModalStart('modalErorBG','display: block;');
            SwitchPlayer();
            deleteResult();
            document.getElementById('resFinal').value = "";
            secoundClick = true;
            document.getElementById('confirm').style = "pointer-events:auto;";
        }
    }else {
        document.getElementById("confirm").style.pointerEvents = "none";
        var result = document.getElementById('result').innerHTML;
        var resFinal = document.getElementById('resFinal').value;
        var resultFinal = eval(resFinal);

        if (result != player1Num) 
             nextPlayer = player1Num
        else  nextPlayer = player2Num;

        document.getElementById('result').innerHTML = nextPlayer;

        if (resultFinal == nextPlayer) {
            displayModalStart('modalSucsBG','display: block;');
            UpdatePoints();
            assignmentPoints();
            loadingNextGame(time_progress_Sec);
        }else {
            loadingNextGame(time_progress_Sec);
            document.getElementById('trueNum').innerHTML = document.getElementById('result').innerHTML;
            document.getElementById('falseNum').innerHTML = resultFinal;
            displayModalStart('modalErorBG','display: block;');
        }
    }
}
// how much points give player
let pointsToAdd;
function UpdatePlayerPoint(player){
    let x = storedData[0].Points;
    sum = storedData[player].Points;
    pointsToAdd = pointsNum;

    storedData[player].Points = sum + pointsToAdd;
    sum = storedData[player].Points;
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