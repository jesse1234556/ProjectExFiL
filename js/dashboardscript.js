const missionsdiv = document.getElementById("missions");
const hackdiv = document.getElementById("hack");
const circuitbreakersdiv = document.getElementById("circuitbreakers");
const blackmarketdiv = document.getElementById("blackmarket");
const homebutton = document.getElementById("home");

if(GameSave.state.doneTutorial == false){
   window.location.href = "missionplay.html?mission=1";
}

homebutton.addEventListener("click",  () => {
    window.location.href = "index.html";

});

missionsdiv.addEventListener("click", () => {
    window.location.href = "missionselect.html";
});

