var currentPlayer = {};
var currentPlayerNum = 1;
var currentQuestion;
var answerFinal;
var num = 0;
var data;

var addPoints = AppSettings.WhoKnowsKnows.addPoints;
var minusPoints = AppSettings.WhoKnowsKnows.minusPoints;

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

        downloadAPI();
        counterGame();
        counterQuestion();
        Time(time_min);
        SwitchPlayer();
        if(AppSettings.CounterNewGame%2==0) {
            SwitchPlayer();
        }
    };
}
// download full api
var API_Base_WhoKnowsKnows = AppSettings.WhoKnowsKnows.API_Base_WhoKnowsKnows;
function downloadAPI() {
    var request = new XMLHttpRequest;
    request.open('GET',API_Base_WhoKnowsKnows);
    request.send();

    request.onload = async function () {
        data = await JSON.parse(this.response);
        insertQuestion();
    }
}
// time
var time_min = AppSettings.WhoKnowsKnows.time_min * 600;
function Time(time) {
    var elem = document.getElementById("progressTime");
    var height = 1;
    var id = setInterval(frame, time);

    function frame() {
        if (height >= 100) {
            clearInterval(id);
        }
        else {
            height++;
            elem.style.height = height + '%';
        }
    }
}
// time for question
var id; // clear interval for progress bar
var time_question_Sec = AppSettings.WhoKnowsKnows.time_question_Sec * 10;
function startTimeQuestion(timeQuestion) {
  var elem = document.getElementById("myBar");   
  var width = 1;
  id = setInterval(frame, timeQuestion);
  function frame() {
    if (width >= 100) {
      clearInterval(id);
      document.getElementById('Ball' + num).style = 'background : red;';
      document.getElementById('answer').value = currentQuestion.Answer;
      TimeAnswer(time_answer_Sec);
    } else {
      width++; 
      elem.style.width = width + '%'; 
    }
  }
}
// progress bar when show answer
var time_answer_Sec = AppSettings.WhoKnowsKnows.time_answer_Sec * 10;
function TimeAnswer(timeAnswer) {
    var elem = document.getElementById("ProgressAnswer");   
    var width = 1;
    id = setInterval(frame, timeAnswer);
    function frame() {
        if (width >= 100) {
            insertQuestion();
        } else {
            document.getElementById('answer').style = "pointer-events:none;";
            width++; 
            elem.style.width = width + '%'; 
        }
    }
}
// insert question 
var arrRanNum = [];
function insertQuestion() {
    document.getElementById('answer').value = "";
    document.getElementById('answer').style = "pointer-events:auto;";
    document.getElementById('answerBtn').style = "pointer-events:auto;"
    document.getElementById('nextBtn').style = "pointer-events:auto;"
    randomNum = Math.floor(Math.random() * data.length);

    for (var i = 0; i < arrRanNum.length; i++) {
       if (arrRanNum[i] == randomNum) {
            insertQuestion();
            return;
       }
    }
    arrRanNum.push(randomNum);

    if(AppSettings.CounterNewGame%2) {
        AppSettings.WhoKnowsKnows.randomNum = arrRanNum;
        localStorage.setItem("AppSettings", JSON.stringify(AppSettings));
    }else {
        var ranWhoKnowsJson = AppSettings.WhoKnowsKnows.randomNum;

        for (var i = 0; i < ranWhoKnowsJson.length; i++) {
            if (ranWhoKnowsJson[i] == randomNum) {
                insertQuestion();
            }
        }
    }

    currentQuestion = data[randomNum];
    document.getElementById('question').innerHTML = currentQuestion.Question;
    clearInterval(id);
    startTimeQuestion(time_question_Sec);
    num = num + 1;
    counterQuestion();
}
// answer for current question
function answer(num) {
    answerFinal = document.getElementById('answer').value;
     if (currentQuestion.Answer.toLowerCase() == answerFinal.toLowerCase()) {
        document.getElementById('Ball' + num).style = 'background : green;';
        UpdatePoints();
        insertQuestion();
        assignmentPoints();
     } else {
        document.getElementById('Ball' + num).style = 'background : red;';
        clearInterval(id);
        document.getElementById('answer').value = currentQuestion.Answer;
        document.getElementById('answerBtn').style = "pointer-events:none;"
        document.getElementById('nextBtn').style = "pointer-events:none;"
        TimeAnswer(time_answer_Sec);
        UpdatePoints();
        assignmentPoints();
     }
}
// keypress ENTER start answer group
addEventListener('keydown', start);
function start(e) {
    if (e.which == 13) {
        answer(num);
    };
};
// button for next question
function nextQuestion() {
    document.getElementById('nextBtn').style = "pointer-events:none;"
    document.getElementById('answerBtn').style = "pointer-events:none;"
    document.getElementById('Ball' + num).style = 'background : red;';
    clearInterval(id);
    document.getElementById('answer').value = currentQuestion.Answer;
    TimeAnswer(time_answer_Sec);
}
// counter of new game
function counterQuestion() {
    if (num > 10) {
        document.getElementById('question').innerHTML = "...";
        clearInterval(id);
        loadingNextGame(time_progress_Sec);
        document.getElementById('answer').style = "pointer-events:none;";
        document.getElementById('answerBtn').style = "pointer-events:none;";
        document.getElementById('nextBtn').style = "pointer-events:none;";
    }
}
// how much points give player
let pointsToAdd;
function UpdatePlayerPoint(player){
    if (currentQuestion.Answer.toLowerCase() == answerFinal.toLowerCase())
        pointsToAdd = addPoints;
    else pointsToAdd = minusPoints;

    storedData[player].Points = storedData[player].Points + pointsToAdd;
    localStorage.setItem("Players", JSON.stringify(storedData));
}
// loading for next game
var time_progress_Sec = AppSettings.WhoKnowsKnows.time_progress_Sec * 10;
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