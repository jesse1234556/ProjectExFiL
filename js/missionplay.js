//most of missionplay for missionplay.html is included in terminalscript. terminalscript is shared between sandbox and missions and hack (hack tdb). 

const params = new URLSearchParams(window.location.search);
const requestedMission = parseInt(params.get("mission"), 10);

const highestCompleted = GameSave.state.highestMission;

if (
  Number.isNaN(requestedMission) ||
  requestedMission > highestCompleted + 1
) {
  window.location.href = "nicetry.html";
}

