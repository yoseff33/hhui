// التأكد من أن المستند جاهز للتفاعل
document.addEventListener('DOMContentLoaded', function() {
    const menuToggle = document.getElementById('menu-toggle');
    const menu = document.getElementById('main-menu');

    // عند الضغط على زر القائمة
    menuToggle.addEventListener('click', function() {
        // التبديل بين إظهار القائمة وإخفائها
        if (menu.style.display === 'block') {
            menu.style.display = 'none';
        } else {
            menu.style.display = 'block';
        }
    });

    // إغلاق القائمة إذا تم الضغط في أي مكان آخر على الصفحة
    document.addEventListener('click', function(event) {
        if (!menuToggle.contains(event.target) && !menu.contains(event.target)) {
            menu.style.display = 'none';
        }
    });
});

// التأكد من أن المستند جاهز للتفاعل
document.addEventListener('DOMContentLoaded', function() {
    const menuToggle = document.getElementById('menu-toggle');
    const menu = document.getElementById('main-menu');

    // عند الضغط على زر القائمة
    menuToggle.addEventListener('click', function() {
        // التبديل بين إظهار القائمة وإخفائها
        if (menu.style.display === 'block') {
            menu.style.display = 'none';
        } else {
            menu.style.display = 'block';
        }
    });

    // إغلاق القائمة إذا تم الضغط في أي مكان آخر على الصفحة
    document.addEventListener('click', function(event) {
        if (!menuToggle.contains(event.target) && !menu.contains(event.target)) {
            menu.style.display = 'none';
        }
    });

    // تفعيل الأكوردين
    const accordionHeaders = document.querySelectorAll('.accordion-header');

    accordionHeaders.forEach(header => {
        header.addEventListener('click', function() {
            const content = this.nextElementSibling;
            const isActive = content.style.display === 'block';

            // إغلاق جميع الأقسام الأخرى
            document.querySelectorAll('.accordion-content').forEach(item => {
                item.style.display = 'none';
            });

            // فتح القسم الحالي إذا لم يكن مفتوحًا
            if (!isActive) {
                content.style.display = 'block';
            }
        });
    });
});