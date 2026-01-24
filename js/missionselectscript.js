const startbutton = document.getElementById("start");
const homebutton = document.getElementById("home");



const missionStars = document.getElementById("mission-stars");          // ★ ☆ stars
const missionTitleText = document.getElementById("mission-title-text"); // The span with the title text
const missionSummary = document.getElementById("mission-summary");                // summary text
const missionTools = document.getElementById("mission-tools");                // tools text


homebutton.addEventListener("click", () => {
  window.location.href = `dashboard.html`;
});

// Load save once
const gameSave = GameSave.state;
const highestMission = gameSave.highestMission;
currentlySelected = highestMission + 1; //currentlySelected is the misson currently hovered by player. Automatically set to highest avaliable mission. 

//missions defined by id
const missionListData = [
  {
    id: 1,
    title: "Orientation Protocol",
    stars: 1,
    summary: "Learn the fundamentals of system navigation and basic command usage.",
    tools: ["cd", "ls", "cat"]
  },
  {
    id: 2,
    title: "Honeypot Simulator",
    stars: 2,
    summary: "Interact with a decoy system to identify suspicious behavior patterns.",
    tools: ["netstat", "grep", "whois"]
  },
  {
    id: 3,
    title: "Apartment Complex",
    stars: 3,
    summary: "Survey a multi-node environment to locate hidden access points.",
    tools: ["nmap", "ping", "traceroute"]
  },
  {
    id: 4,
    title: "International Airport",
    stars: 4,
    summary: "Navigate a high-traffic network while avoiding detection mechanisms.",
    tools: ["tcpdump", "awk", "iptables"]
  },
  {
    id: 5,
    title: "Nuclear Research Lab",
    stars: 5,
    summary: "Extract critical data from a hardened and heavily monitored system.",
    tools: ["ssh", "scp", "openssl"]
  },
  {
    id: 6,
    title: "Blacksite",
    stars: 6,
    summary: "Infiltrate a classified environment with minimal tooling and zero margin for error.",
    tools: ["custom shell", "memory inspector", "manual hex editor"]
  }
];



// Get all mission divs
const missions = [
  document.getElementById("1stmission"),
  document.getElementById("2ndmission"),
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


// Set currentlySelected and previouslySelectedDiv to the highest unlocked mission
currentlySelected = highestMission + 1; // missions are 1-indexed
previouslySelectedDiv = missionsdiv[highestMission];
previouslySelectedDiv.classList.add("selected");

function updateMissionDisplay(currentlySelected) {
  // missionListData assumed to be defined already
  const mission = missionListData.find(m => m.id === currentlySelected);
  if (!mission) return; // safety check

  // Update title
  missionTitleText.textContent = mission.title;

  // Update stars
 if (mission.stars === 6) {
    // Blacksite special styling
    missionStars.textContent = "★★★★★";       // 5 stars
    missionStars.style.color = "black";         // make stars black
    missionStars.style.filter = 
        "drop-shadow(0 0 2px white) drop-shadow(0 0 4px white)"; // white glow
} else {
    // Regular missions
    missionStars.textContent = "★".repeat(mission.stars) + "☆".repeat(5 - mission.stars);
    missionStars.style.color = "";   // reset to default
    missionStars.style.filter = "";  // reset filter
}


  // Update summary
  missionSummary.textContent = mission.summary;

  // Update tools
  missionTools.textContent = mission.tools.join(", ");
}



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
      updateMissionDisplay(currentlySelected);
      // Add "selected" to the new one
      itemDiv.classList.add("selected");
      previouslySelectedDiv = itemDiv;
      
    }
  });
});

 updateMissionDisplay(currentlySelected);
startbutton.addEventListener("click", () => {
  let missionNumber = currentlySelected;
  window.location.href = `missionplay.html?mission=${missionNumber}`;
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
