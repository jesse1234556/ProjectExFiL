const homebutton = document.getElementById("home");
const resetProgressButton = document.getElementById("resetProgressButton");
const cancelBtn = document.getElementById('cancelBtn');
const confirmBtn = document.getElementById('confirmBtn');

function closeModal() {
    const modal = document.querySelector('.confirmation-modal');
    if (modal) {
        modal.style.display = 'none';
    }
}

function openModal() {
    const modal = document.querySelector('.confirmation-modal');
    if (modal) {
        modal.style.display = 'flex';

        // Disable confirm button and start countdown
        confirmBtn.disabled = true;
        let countdown = 3;
        confirmBtn.textContent = countdown + "...";
        confirmBtn.style.opacity = "0.5";

        const countdownInterval = setInterval(() => {
            countdown--;
            if (countdown > 0) {
                confirmBtn.textContent = countdown + "...";
            } else {
                clearInterval(countdownInterval);
                confirmBtn.textContent = "Confirm";
                confirmBtn.disabled = false;
                confirmBtn.style.opacity = "1";
            }
        }, 1000);
    }
}

cancelBtn.addEventListener('click', closeModal);

resetProgressButton.addEventListener("click", () => {
    openModal();
});

confirmBtn.addEventListener('click', () => {
    if (!confirmBtn.disabled) {
        GameSave.resetProgress(); 
        window.location.href = "index.html";
    }
});

homebutton.addEventListener("click", () => {
    window.location.href = "index.html";
});
