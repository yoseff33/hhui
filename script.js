// جلب جميع الدوائر الخاصة بالدكاترة
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

// إخفاء جميع القوائم عند النقر خارج أي دائرة
document.addEventListener('click', () => {
    document.querySelectorAll('.circle-menu').forEach(menu => {
        menu.style.transform = 'translate(-50%, -50%) scale(0)';
    });
});

// جلب عنصر الرابط الخاص بالطلاب
const studentsLink = document.getElementById('students-link');
const studentList = document.getElementById('student-list');

// إضافة حدث عند الضغط على رابط "الطلاب"
studentsLink.addEventListener('click', function(event) {
    event.preventDefault();

    // التبديل بين إظهار وإخفاء قائمة الطلاب
    if (studentList.style.display === 'none' || studentList.style.display === '') {
        studentList.style.display = 'block';
    } else {
        studentList.style.display = 'none';
    }
});

document.addEventListener('DOMContentLoaded', () => {
    const studentsLink = document.getElementById('students-link');
    const studentList = document.getElementById('student-list');

    studentsLink.addEventListener('click', (event) => {
        event.preventDefault();
        window.location.href = 'students.html'; // الانتقال إلى صفحة الطلاب
    });
});