const sidebar = document.querySelector('.sidebar');

sidebar.addEventListener("mouseenter", () => {
  sidebar.classList.toggle('active');
});

sidebar.addEventListener("mouseleave", () => {
  sidebar.classList.toggle('active');
});