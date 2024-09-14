document.addEventListener('DOMContentLoaded', () => {
    // جلب زر التمرير والقائمة
    const menuToggle = document.querySelector('.menu-toggle');
    const navMenu = document.querySelector('nav ul');

    // عند النقر على زر التمرير، تبديل الفئة 'active'
    menuToggle.addEventListener('click', (event) => {
        event.stopPropagation();
        navMenu.classList.toggle('active'); // التبديل بين إظهار وإخفاء القائمة
    });

    // إخفاء القائمة عند النقر خارج الهيدر
    document.addEventListener('click', (event) => {
        if (!event.target.closest('header')) {
            navMenu.classList.remove('active'); // إخفاء القائمة عند النقر خارج الهيدر
        }
    });

    // إضافة رابط إعادة التوجيه إلى الصفحة الرئيسية عند الضغط على "كلية إدارة الأعمال"
    const businessSchoolLink = document.querySelector('h1');
    if (businessSchoolLink) {
        businessSchoolLink.addEventListener('click', (event) => {
            event.preventDefault();
            window.location.href = 'index.html'; // توجيه المستخدم للصفحة الرئيسية
        });
    }

    // إعداد التفاعل مع القوائم الدائرية في صفحة أعضاء هيئة التدريس
    const doctorCircles = document.querySelectorAll('.doctor-circle');

    doctorCircles.forEach(circle => {
        const name = circle.querySelector('.doctor-name');
        const menu = circle.querySelector('.circle-menu');

        if (name) {
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

            // إخفاء القائمة عند النقر خارجها
            document.addEventListener('click', (event) => {
                const target = event.target;
                if (!target.closest('.doctor-circle')) {
                    const otherMenus = document.querySelectorAll('.circle-menu');
                    otherMenus.forEach(otherMenu => {
                        otherMenu.style.transform = 'translate(-50%, -50%) scale(0)';
                    });
                }
            });
        }
    });
});