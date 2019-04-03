let AppSettings = JSON.parse(localStorage.getItem("AppSettings"));
var storedData = JSON.parse(localStorage.getItem("Players"));

// counter of game      -----FOR FRAMEWORKS
function counterGame() {
    AppSettings.CounterNewGame = AppSettings.CounterNewGame + 1;
    localStorage.setItem("AppSettings", JSON.stringify(AppSettings));
}
// visibile all modals      -----FOR FRAMEWORKS
function displayModalStart(id,style) {
    document.getElementById(id).style = style;
}
// close modals all      -----FOR FRAMEWORKS
function closeModal(id,style) {
    document.getElementById(id).style = style;
}
// switch color players and cloud      -----FOR FRAMEWORKS
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

    SwitchPlayerStyle('block', n, storedData[holdingPlayer].Color);
    SwitchPlayerStyle('none', holdingPlayer, shadowBlack);
}
function SwitchPlayerStyle(display, playerNum, shadow) {
    document.getElementById('displayP' + playerNum).style = "display: " + display +";";
    var element1 = document.getElementById('picP' + playerNum);
    element1.style.boxShadow = "0 0 50px" + shadow;
}
// enable pointer-event for letter      -----FOR FRAMEWORKS
function eventEnableDisable(id,EnableDisable) {
    var id = document.getElementsByClassName(id);
        for (var i = 0; i < id.length; i++) {
            id[i].style = "pointer-events:" + EnableDisable + ";"
        } 
}
// choose player who update points      -----FOR FRAMEWORKS
function UpdatePoints(){
    if(currentPlayerNum == 0) {
        UpdatePlayerPoint(0);
        updatePointsGame(0);
    }else {
        UpdatePlayerPoint(1);
        updatePointsGame(1);
    }
}   
// add points after good answer      -----FOR FRAMEWORKS
function assignmentPoints() {
        document.getElementById('pointsP1').innerHTML = storedData[0].Points;
        document.getElementById('pointsP2').innerHTML = storedData[1].Points;
}
// assign on next game      -----FOR FRAMEWORKS
function nextGame(){
    let gameOrder=[];
    for (var game of AppSettings.OrderGames) {
        gameOrder.push(game.Page);
    }
    
    let currNewGame = AppSettings.CounterNewGame;

    let carrPageNum = (currNewGame%2==0) ? (currNewGame/2-1) : Math.floor(currNewGame/2);
    let carrPage = gameOrder[carrPageNum];
    let nextPage = '../' + AppSettings.OrderGames[carrPageNum+1].Name + '/' + gameOrder[carrPageNum+1];

    
    if(AppSettings.CounterNewGame%2==0) {
            window.location.assign(nextPage);
        }
    else {
            window.location.assign(carrPage);
        }
}
// set points on locale storage game on game
function updatePointsGame(player){
    let CounterNewGame = AppSettings.CounterNewGame;

    if ((CounterNewGame == 1) || (CounterNewGame == 2)) {
        storedData[player].PointsForGame[0].Characters = storedData[player].PointsForGame[0].Characters + pointsToAdd;
        localStorage.setItem("Players", JSON.stringify(storedData));
    }else if ((CounterNewGame == 3) || (CounterNewGame == 4)) {
        storedData[player].PointsForGame[0].MyNumber = storedData[player].PointsForGame[0].MyNumber + pointsToAdd;
        localStorage.setItem("Players", JSON.stringify(storedData));
    }else if ((CounterNewGame == 5) || (CounterNewGame == 6)) {
        storedData[player].PointsForGame[0].Couplings = storedData[player].PointsForGame[0].Couplings + pointsToAdd;
        localStorage.setItem("Players", JSON.stringify(storedData));
    }else if ((CounterNewGame == 7) || (CounterNewGame == 8)) {
        storedData[player].PointsForGame[0].WhoKnowsKnows = storedData[player].PointsForGame[0].WhoKnowsKnows + pointsToAdd;
        localStorage.setItem("Players", JSON.stringify(storedData));
    }else if ((CounterNewGame == 9) || (CounterNewGame == 10)) {
        storedData[player].PointsForGame[0].Association = storedData[player].PointsForGame[0].Association + pointsToAdd;
        localStorage.setItem("Players", JSON.stringify(storedData));       
    }
}