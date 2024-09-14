document.addEventListener('DOMContentLoaded', () => {
    // جلب زر التمرير والقائمة
    const menuToggle = document.querySelector('.menu-toggle');
    const navMenu = document.querySelector('nav ul');

    // عند النقر على زر التمرير، تبديل الفئة 'active'
    menuToggle.addEventListener('click', () => {
        navMenu.classList.toggle('active'); // التبديل بين إظهار وإخفاء القائمة
    });

    // إخفاء القائمة عند النقر خارجها
    document.addEventListener('click', (event) => {
        if (!event.target.closest('header')) {
            navMenu.classList.remove('active'); // إخفاء القائمة عند النقر خارج الهيدر
        }
    });

    // التعامل مع دوائر أعضاء هيئة التدريس
    const doctorCircles = document.querySelectorAll('.doctor-circle');

    doctorCircles.forEach(circle => {
        const name = circle.querySelector('.doctor-name');
        const menu = circle.querySelector('.circle-menu');

        name.addEventListener('click', (event) => {
            event.stopPropagation(); // لمنع إخفاء القائمة عند الضغط على الدائرة نفسها

            // التبديل بين إظهار وإخفاء القائمة
            if (menu.style.transform === 'translate(-50%, -50%) scale(1)') {
                menu.style.transform = 'translate(-50%, -50%) scale(0)';
            } else {
                menu.style.transform = 'translate(-50%, -50%) scale(1)';
                
                // إخفاء القوائم الأخرى
                const otherMenus = document.querySelectorAll('.circle-menu');
                otherMenus.forEach(otherMenu => {
                    if (otherMenu !== menu) {
                        otherMenu.style.transform = 'translate(-50%, -50%) scale(0)';
                    }
                });
            }
        });
    });

    // جلب عنصر الرابط الخاص بالطلاب
    const studentsLink = document.getElementById('students-link');
    const studentList = document.getElementById('student-list');

    // إضافة حدث عند الضغط على رابط "الطلاب"
    if (studentsLink && studentList) {
        studentsLink.addEventListener('click', function(event) {
            event.preventDefault();

            // التبديل بين إظهار وإخفاء قائمة الطلاب
            if (studentList.style.display === 'none' || studentList.style.display === '') {
                studentList.style.display = 'block';
            } else {
                studentList.style.display = 'none';
            }
        });
    }
});