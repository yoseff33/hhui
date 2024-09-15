document.addEventListener('DOMContentLoaded', function () {
    const menuButton = document.querySelector('.menu-button');
    const menu = document.querySelector('.menu');
    const header = document.querySelector('header');
    const menuToggle = document.querySelector('.menu-toggle');
    const navMenu = document.querySelector('nav ul');

    // وظيفة لعرض وإخفاء القائمة الجانبية
    menuButton.addEventListener('click', function () {
        menu.classList.toggle('show-menu');
    });

    // وظيفة لعرض وإخفاء قائمة التنقل في الهيدر
    menuToggle.addEventListener('click', function () {
        navMenu.classList.toggle('active');
    });

    // إغلاق القائمة الجانبية عند النقر خارجها
    document.addEventListener('click', function (event) {
        if (!menu.contains(event.target) && !menuButton.contains(event.target)) {
            menu.classList.remove('show-menu');
        }
    });
});