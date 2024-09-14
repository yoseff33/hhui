// التحكم في ظهور وإخفاء القائمة
const menuBtn = document.querySelector('.menu-btn');
const nav = document.querySelector('nav');

menuBtn.addEventListener('click', () => {
    if (nav.style.display === 'none' || nav.style.display === '') {
        nav.style.display = 'block';
    } else {
        nav.style.display = 'none';
    }
});

// إغلاق القائمة عند النقر خارجها
document.addEventListener('click', (event) => {
    if (!nav.contains(event.target) && !menuBtn.contains(event.target)) {
        nav.style.display = 'none';
    }
});

// إدارة ظهور الدائرة المخفية عند الضغط على دائرة الدكتور
const doctorCircles = document.querySelectorAll('.doctor-circle');

doctorCircles.forEach(circle => {
    const menu = circle.querySelector('.circle-menu');

    circle.addEventListener('click', (event) => {
        event.stopPropagation(); // لمنع إخفاء القائمة عند الضغط على الدائرة نفسها

        // إخفاء جميع القوائم الأخرى
        document.querySelectorAll('.circle-menu').forEach(otherMenu => {
            if (otherMenu !== menu) {
                otherMenu.style.transform = 'translate(-50%, -50%) scale(0)';
                otherMenu.style.visibility = 'hidden';
            }
        });

        // التبديل بين إظهار وإخفاء القائمة الحالية
        if (menu.style.transform === 'translate(-50%, -50%) scale(0)' || menu.style.transform === '') {
            menu.style.transform = 'translate(-50%, -50%) scale(1)';
            menu.style.visibility = 'visible';
        } else {
            menu.style.transform = 'translate(-50%, -50%) scale(0)';
            menu.style.visibility = 'hidden';
        }
    });
});

// إغلاق القوائم عند النقر خارجها
document.addEventListener('click', () => {
    document.querySelectorAll('.circle-menu').forEach(menu => {
        menu.style.transform = 'translate(-50%, -50%) scale(0)';
        menu.style.visibility = 'hidden';
    });
});