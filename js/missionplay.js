const params = new URLSearchParams(window.location.search);
const requestedMission = parseInt(params.get("mission"), 10);

const highestCompleted = GameSave.state.highestMission;

if (
  Number.isNaN(requestedMission) ||
  requestedMission > highestCompleted + 1
) {
  window.location.href = "nicetry.html";
}
