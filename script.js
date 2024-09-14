// كود القائمة المنسدلة
const menuButton = document.querySelector('.menu-button');
const menu = document.querySelector('.menu');

// عندما يتم الضغط على زر القائمة
menuButton.addEventListener('click', function() {
    // تبديل ظهور القائمة
    if (menu.style.display === 'block') {
        menu.style.display = 'none';
    } else {
        menu.style.display = 'block';
    }
});

// إغلاق القائمة عند الضغط خارجها
document.addEventListener('click', function(event) {
    if (!menu.contains(event.target) && !menuButton.contains(event.target)) {
        menu.style.display = 'none';
    }
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