document.addEventListener('DOMContentLoaded', function () {
    const menuButton = document.querySelector('.menu-toggle');
    const menu = document.querySelector('nav');

    if (menuButton && menu) {
        menuButton.addEventListener('click', function () {
            menu.classList.toggle('active');
        });
    }

    const body = document.querySelector('body');
    if (!body.classList.contains('home-page')) {
        const menuSidebar = document.querySelector('.menu');
        const menuSidebarButton = document.querySelector('.menu-button');

        if (menuSidebar && menuSidebarButton) {
            menuSidebarButton.addEventListener('click', function () {
                menuSidebar.classList.toggle('active');
            });
        }
    }
});