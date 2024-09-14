// التعامل مع زر المنيو
const menuToggle = document.querySelector('.menu-toggle');
const navMenu = document.querySelector('nav ul');

menuToggle.addEventListener('click', () => {
    navMenu.classList.toggle('active');
});

// التعامل مع الدوائر المخفية للدكاترة
const doctorCircles = document.querySelectorAll('.doctor-circle');

doctorCircles.forEach(circle => {
    const menu = circle.querySelector('.circle-menu');

    circle.addEventListener('click', (event) => {
        event.stopPropagation(); // لمنع إغلاق القائمة عند الضغط على نفس الدائرة

        // إخفاء جميع القوائم الأخرى
        document.querySelectorAll('.circle-menu').forEach(otherMenu => {
            if (otherMenu !== menu) {
                otherMenu.style.transform = 'scale(0)';
            }
        });

        // التبديل بين إظهار وإخفاء القائمة الحالية
        if (menu.style.transform === 'scale(0)' || menu.style.transform === '') {
            menu.style.transform = 'scale(1)';
        } else {
            menu.style.transform = 'scale(0)';
        }
    });
});

// إخفاء القوائم عند النقر خارج الدائرة
document.addEventListener('click', () => {
    document.querySelectorAll('.circle-menu').forEach(menu => {
        menu.style.transform = 'scale(0)';
    });
});