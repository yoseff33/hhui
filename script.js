document.addEventListener('DOMContentLoaded', function() {
    // Toggle dropdown menu visibility
    document.querySelector('.menu-button').addEventListener('click', function() {
        this.classList.toggle('active');
        const dropdownMenu = document.querySelector('.dropdown-menu');
        if (dropdownMenu.style.display === 'block') {
            dropdownMenu.style.display = 'none';
        } else {
            dropdownMenu.style.display = 'block';
        }
    });

    // Close dropdown menu if clicking outside of it
    document.addEventListener('click', function(event) {
        const isClickInsideMenuButton = document.querySelector('.menu-button').contains(event.target);
        const isClickInsideDropdownMenu = document.querySelector('.dropdown-menu').contains(event.target);

        if (!isClickInsideMenuButton && !isClickInsideDropdownMenu) {
            document.querySelector('.dropdown-menu').style.display = 'none';
        }
    });
});