// التحكم في الزر الجانبي لإظهار القائمة الجانبية
document.addEventListener('DOMContentLoaded', function() {
    const menuBtn = document.querySelector('.menu-btn');
    const sidebar = document.querySelector('.sidebar');

    menuBtn.addEventListener('click', function() {
        if (sidebar.style.width === '250px') {
            sidebar.style.width = '0';
        } else {
            sidebar.style.width = '250px'; // عرض الشريط الجانبي عند الضغط
        }
    });

    // إغلاق القائمة الجانبية عند الضغط على زر الإغلاق
    const closeBtn = document.querySelector('.closebtn');
    closeBtn.addEventListener('click', function() {
        sidebar.style.width = '0';
    });
});