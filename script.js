// القوائم المخفية للدكاترة
const doctorCircles = document.querySelectorAll('.doctor-circle');

doctorCircles.forEach(circle => {
    const name = circle.querySelector('.doctor-name');
    const menu = circle.querySelector('.circle-menu');

    name.addEventListener('click', (event) => {
        event.stopPropagation(); // لمنع إخفاء القائمة عند الضغط على الدائرة نفسها

        // إخفاء جميع القوائم الأخرى
        document.querySelectorAll('.circle-menu').forEach(otherMenu => {
            if (otherMenu !== menu) {
                otherMenu.style.transform = 'translate(-50%, -50%) scale(0)';
            }
        });

        // التبديل بين إظهار وإخفاء القائمة الحالية
        if (menu.style.transform === 'translate(-50%, -50%) scale(0)' || menu.style.transform === '') {
            menu.style.transform = 'translate(-50%, -50%) scale(1)';
        } else {
            menu.style.transform = 'translate(-50%, -50%) scale(0)';
        }
    });
});

// إخفاء القوائم عند النقر خارج الدائرة
document.addEventListener('click', () => {
    document.querySelectorAll('.circle-menu').forEach(menu => {
        menu.style.transform = 'translate(-50%, -50%) scale(0)';
    });
});

// عرض صفحة مصممي الموقع عند الضغط على زر الطلاب
const studentsLink = document.getElementById('students-link');
studentsLink.addEventListener('click', (event) => {
    window.location.href = 'students.html';
});