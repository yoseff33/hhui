// كود القائمة المنسدلة// التحكم في الزر المنيو لإظهار وإخفاء القائمة
document.addEventListener('DOMContentLoaded', function() {
    const menuBtn = document.querySelector('.menu-btn');
    const navMenu = document.querySelector('nav ul');

    menuBtn.addEventListener('click', function() {
        if (navMenu.classList.contains('active')) {
            navMenu.classList.remove('active'); // إخفاء القائمة
        } else {
            navMenu.classList.add('active'); // إظهار القائمة
        }
    });
});

// التنقل إلى الصفحة الرئيسية عند الضغط على "إدارة الأعمال"
const businessLink = document.querySelector('.business-link');
businessLink.addEventListener('click', function() {
    window.location.href = 'index.html'; // توجيه إلى الصفحة الرئيسية
});

// كود خاص بالتقويم الأكاديمي
const academicCalendar = document.querySelector('.calendar-container');

// التأكد من أن صفحة التقويم تظهر بشكل صحيح
if (academicCalendar) {
    // يمكنك إضافة أي إعدادات إضافية هنا لصفحة التقويم
    console.log("صفحة التقويم الأكاديمي جاهزة.");
}