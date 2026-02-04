// Option sets
const mainMenuOptions = [
    { text: "> Play", target: "playOptions", color: "#00f0ff" },
    { text: "> Options", target: "options.html", color: "#00f0ff" },
    { text: "> Sandbox", target: "sandbox.html", color: "#00f0ff" },
];

const playOptions = [
    { text: "> New Game", target: "dashboard.html", color: "#00f0ff" },
    { text: "> Terminal Tips", target: "loadgame.html", color: "#00f0ff" },
    { text: "> Back", target: "mainMenuOptions", color: "#00f0ff" },
];

// Current menu reference
let currentMenu = mainMenuOptions;

// Populate options dynamically
function populateOptions(menu) {
    const optionBox = document.getElementById('optionBox');
    optionBox.innerHTML = ''; // clear previous options

    menu.forEach(opt => {
        const optionDiv = document.createElement('div');
        optionDiv.classList.add('option');
        optionDiv.dataset.target = opt.target;

        optionDiv.innerHTML = `
            <div class="option-content">
                <span>${opt.text}</span>
                <svg class="triangle" viewBox="0 0 100 100">
                    <polygon points="50 15, 100 100, 0 100" fill="${opt.color}"/>
                </svg>
            </div>
        `;

        optionBox.appendChild(optionDiv);
    });

    initOptionBehavior();
}

// Handle triangle rotation and clicks
function initOptionBehavior() {
    const triangles = document.querySelectorAll('.triangle');

    triangles.forEach(triangle => {
        let rotation = 0;
        let speed = 72; // initial speed
        let lastTime = null;

        const actions = [72, 180, 360, 30, 720];

        function chooseAction() {
            const r = Math.random();
            if (r < 0.35) return actions[0];
            if (r < 0.55) return actions[1];
            if (r < 0.75) return actions[2];
            if (r < 0.90) return actions[3];
            return actions[4];
        }

        let speedTimeout;
        function scheduleNextSpeed() {
            const delay = 500 + Math.random() * 1000;
            speedTimeout = setTimeout(() => {
                speed = chooseAction();
                scheduleNextSpeed();
            }, delay);
        }
        scheduleNextSpeed();

        function animate(time) {
            if (!lastTime) lastTime = time;
            const delta = (time - lastTime) / 1000;
            lastTime = time;

            rotation += speed * delta;
            rotation %= 360;
            triangle.style.transform = `rotate(${rotation}deg)`;

            requestAnimationFrame(animate);
        }
        requestAnimationFrame(animate);

        const parentDiv = triangle.closest('.option');
        parentDiv.addEventListener('mouseenter', () => {
            clearTimeout(speedTimeout);
            speed = 720;
        });
        parentDiv.addEventListener('mouseleave', () => {
            speed = 80;
            scheduleNextSpeed();
        });
    });

    document.querySelectorAll('.option').forEach(option => {
        option.addEventListener('click', () => {
            const target = option.dataset.target;
            if (target === "playOptions") {
                populateOptions(playOptions); // switch to play options
            } else if (target === "mainMenuOptions") {
                populateOptions(mainMenuOptions); // switch back to main menu
            } else if (target.endsWith('.html')) {
            window.location.href = target; // redirect normally
            }
        });
    });
}

// Initialize main menu
populateOptions(currentMenu);
