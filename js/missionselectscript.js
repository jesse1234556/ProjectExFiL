const sidebar = document.querySelector('.sidebar');
const button = document.getElementById('myButton');

sidebar.addEventListener("mouseenter", () => {
  sidebar.classList.toggle('active');
});

sidebar.addEventListener("mouseleave", () => {
  sidebar.classList.toggle('active');
});

console.log(GameSave.state.highestMission);

// Load save once
const gameSave = GameSave.state;
const highestMission = gameSave.highestMission;

// Get all mission divs
const missions = [
  document.getElementById("1stmission"),
  document.getElementById("2rdmission"),
  document.getElementById("3rdmission"),
  document.getElementById("4thmission"),
  document.getElementById("5thmission"),
  document.getElementById("6thmission")
];

const missionsdiv = missions.map(mission => mission.parentElement);
console.log(missionsdiv);

// Lock/unlock missions
missions.forEach((sidenumberDiv, index) => {
  if (index <= highestMission) {
    // unlocked: show number
    sidenumberDiv.innerHTML = (index + 1).toString();
    sidenumberDiv.classList.remove('locked');
  } else {
    // locked: insert padlock SVG
    sidenumberDiv.innerHTML = `<svg class="padlock"><use xlink:href="#icon-padlock"></use></svg>`;
    sidenumberDiv.classList.add('locked');
  }
});
let currentlySelected = null; // mission number
let previouslySelectedDiv = null; // keep track of the selected .item

missionsdiv.forEach((itemDiv, index) => {
  itemDiv.addEventListener("click", () => {
    const sidenumberDiv = itemDiv.querySelector(".sidenumber");

    if (sidenumberDiv.classList.contains("locked")) {
      const padlock = sidenumberDiv.querySelector(".padlock");
      if (padlock) jiggle(padlock);
    } else {
      currentlySelected = index + 1; // mission number
      console.log(`Mission ${currentlySelected} selected`);

      // Remove "selected" from previous
      if (previouslySelectedDiv) {
        previouslySelectedDiv.classList.remove("selected");
      }

      // Add "selected" to the new one
      itemDiv.classList.add("selected");
      previouslySelectedDiv = itemDiv;
    }
  });
});




function jiggle(element) {
  element.animate([
    { transform: 'translateX(0px) rotate(0deg)' },
    { transform: 'translateX(-4px) rotate(-10deg)' },
    { transform: 'translateX(4px) rotate(10deg)' },
    { transform: 'translateX(-2px) rotate(-8deg)' },
    { transform: 'translateX(2px) rotate(8deg)' },
    { transform: 'translateX(0px) rotate(0deg)' }
  ], {
    duration: 450,
    easing: 'ease-out'
  });
}
