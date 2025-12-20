const missionsdiv = document.getElementById("missions");
const hackdiv = document.getElementById("hack");
const circuitbreakersdiv = document.getElementById("circuitbreakers");
const blackmarketdiv = document.getElementById("blackmarket");
const homebutton = document.getElementById("home");

homebutton.addEventListener("click",  () => {
    window.location.href = "index.html";

});

missionsdiv.addEventListener("click", () => {
    window.location.href = "missionselect.html";
});
