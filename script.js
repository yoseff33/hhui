document.addEventListener('DOMContentLoaded', function () {
    // الحصول على زر القائمة والقائمة نفسها
    const menuToggle = document.getElementById('menu-toggle');
    const menu = document.getElementById('main-menu');

    // عند الضغط على زر القائمة
    menuToggle.addEventListener('click', function (event) {
        event.stopPropagation(); // منع انتشار الحدث
        menu.classList.toggle('menu-open');
        if (menu.style.display === 'block') {
            menu.style.display = 'none';
        } else {
            menu.style.display = 'block';
        }
    });

    // إغلاق القائمة إذا تم الضغط في أي مكان آخر على الصفحة
    document.addEventListener('click', function (event) {
        if (!menuToggle.contains(event.target) && !menu.contains(event.target)) {
            menu.style.display = 'none';
        }
    });
});