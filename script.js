// Toggle the navigation menu visibility
document.querySelector('.menu-toggle').addEventListener('click', function() {
    this.classList.toggle('active'); // Toggle the active class
});

// Hide menu when clicking outside
document.addEventListener('click', function(event) {
    const menu = document.querySelector('nav ul');
    if (!event.target.closest('.header-content')) {
        menu.style.display = 'none'; // Hide menu if clicked outside
    }
});