var inputP1; var inputP2;
var colorP1; var colorP2;
var imgP1; var imgP2;
var currentPlayer;
var uploadImgSuccessP1 = false;
var uploadImgSuccessP2 = false;

LoadAppSettings();

//reset validation
function resetValidation() {
    resetValidationHelper('inputP1', 'background: red');
    resetValidationHelper('inputP2', 'background: red');
    resetValidationHelper('inputP1', 'background: none');
    resetValidationHelper('inputP2', 'background: none');
    resetValidationHelper('alert', 'display: none;');
}
// function for reset validation
function resetValidationHelper(id, style) {
    document.getElementById(id).style = style;
}
// validation
function validation() {
    resetValidation();
    populatePlayers();

    if (!inputP1)
        validationFalse('input1');
    else if (!inputP2)
        validationFalse('input2');
    else if (!uploadImgSuccessP1 || !uploadImgSuccessP2)
        validationFalse('img');
    else {
        SavePlayers();
        window.location.assign('./Game/Characters/characters.html')
    }
}
function validationFalse(id) {
    document.getElementById('alert').style.display = "block";
}
// function for modal
function startDisplayModal(player) {
    currentPlayer = player;
    document.getElementById('displayModal').style.display = "block";
}
function uploadDisplayModal() {
    if (currentPlayer == 0) {
        document.getElementById('imgP1').src = document.getElementById("inputImg").files[0].name;
        uploadImgSuccessP1 = true;
    }
    else {
        document.getElementById('imgP2').src = document.getElementById("inputImg").files[0].name;
        uploadImgSuccessP2 = true;
    }

    function readURL(input) {
        if (input.files && input.files[0]) {
            var reader = new FileReader();

            reader.onload = function (e) {
                $('#imgP1').attr('src', e.target.result);
            }
            reader.readAsDataURL(input.files[0]);
        }
    }
    $("#imgP1").change(function () {
        readURL(this);
    });

    document.getElementById('displayModal').style.display = "none";
}
// data for local storage
function populatePlayers() {
    inputP1 = document.getElementById('inputP1').value;
    inputP2 = document.getElementById('inputP2').value;

    colorP1 = document.getElementById('colorP1').value;
    colorP2 = document.getElementById('colorP2').value;

    imgP1 = document.getElementById('imgP1').src;
    imgP2 = document.getElementById('imgP2').src;
}
function SavePlayers() {
    if (localStorage.getItem('Players') == undefined) {
        var Players = [
            {
                Name: inputP1,
                Color: colorP1,
                Image: imgP1,
                PointsForGame: [{
                    Characters: 0,
                    MyNumber: 0,
                    Couplings: 0,
                    WhoKnowsKnows: 0,
                    Association: 0
                }],
                Points: 0
            },
            {
                Name: inputP2,
                Color: colorP2,
                Image: imgP2,
                PointsForGame: [{
                    Characters: 0,
                    MyNumber: 0,
                    Couplings: 0,
                    WhoKnowsKnows: 0,
                    Association: 0
                }],
                Points: 0
            }
        ]
        localStorage.setItem("Players", JSON.stringify(Players));
    } else {
        return0(0);
        return0(1);
    }
}
// helper for return value on O
function return0(player) {
    storedData[player].PointsForGame[0].Characters = 0;
    storedData[player].PointsForGame[0].MyNumber = 0;
    storedData[player].PointsForGame[0].Couplings = 0;
    storedData[player].PointsForGame[0].WhoKnowsKnows = 0;
    storedData[player].PointsForGame[0].Association = 0;

    localStorage.setItem("Players", JSON.stringify(storedData));
}

// keypress ENTER submit
addEventListener('keydown', start);
function start(e) {
    if (e.which == 13) {
        validation();
    };
};
function LoadAppSettings() {
    let AppSettingsAPI = 'https://api.myjson.com/bins/p0wzk';
    if (localStorage.getItem('AppSettings') == undefined) {
        var request = new XMLHttpRequest;
        request.open('GET', AppSettingsAPI);
        request.send();

        request.onload = async function () {
            var data = await JSON.parse(this.response);
            localStorage.setItem("AppSettings", JSON.stringify(data));
        }
    } else {
        AppSettings.CounterNewGame = 0;
        localStorage.setItem("AppSettings", JSON.stringify(AppSettings));
    }
}