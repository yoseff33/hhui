document.addEventListener('DOMContentLoaded', () => {
    // اختار الزر الذي يفتح ويغلق القائمة
    const menuToggle = document.querySelector('.menu-toggle');
    // اختار القائمة التي ستظهر وتختفي
    const navMenu = document.querySelector('nav ul');

    // تحقق من وجود العناصر قبل إضافة الحدث
    if (menuToggle && navMenu) {
        // أضف حدث النقر للزر
        menuToggle.addEventListener('click', () => {
            // تبديل الفئة 'active' لعرض أو إخفاء القائمة
            navMenu.classList.toggle('active');
        });
    }
});
document.addEventListener('DOMContentLoaded', function() {
    const menuToggle = document.querySelector('.menu-toggle');
    const menu = document.querySelector('.menu');

    menuToggle.addEventListener('click', function() {
        menu.classList.toggle('open');
    });
});