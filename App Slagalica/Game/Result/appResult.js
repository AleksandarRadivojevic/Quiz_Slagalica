// use data
useData();
function useData() {
    window.onload = function () {
        document.getElementById('nameP1').innerHTML = storedData[0].Name;
        document.getElementById('nameP2').innerHTML = storedData[1].Name;

        document.getElementById('picP1').src = storedData[0].Image;
        document.getElementById('picP2').src = storedData[1].Image;

       	document.getElementById('pointsP1').innerHTML = storedData[0].Points;
        document.getElementById('pointsP2').innerHTML = storedData[1].Points;

        document.getElementById('CharactersP0').innerHTML = storedData[0].PointsForGame[0].Characters;
        document.getElementById('CharactersP1').innerHTML = storedData[1].PointsForGame[0].Characters;
        document.getElementById('MyNumberP0').innerHTML = storedData[0].PointsForGame[0].MyNumber;
        document.getElementById('MyNumberP1').innerHTML = storedData[1].PointsForGame[0].MyNumber;
        document.getElementById('CouplingsP0').innerHTML = storedData[0].PointsForGame[0].Couplings;
        document.getElementById('CouplingsP1').innerHTML = storedData[1].PointsForGame[0].Couplings;
        document.getElementById('WhoKnowsKnowsP0').innerHTML = storedData[0].PointsForGame[0].WhoKnowsKnows;
        document.getElementById('WhoKnowsKnowsP1').innerHTML = storedData[1].PointsForGame[0].WhoKnowsKnows;
        document.getElementById('AssociationP0').innerHTML = storedData[0].PointsForGame[0].Association;
        document.getElementById('AssociationP1').innerHTML = storedData[1].PointsForGame[0].Association;
    };
}
// revanche
function revanche() {
    window.location.assign('../../index.html');
}