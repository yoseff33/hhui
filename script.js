// وظيفة لفتح وإغلاق القائمة عند النقر على زر القائمة
document.addEventListener('DOMContentLoaded', function() {
    const menuToggle = document.querySelector('.menu-toggle');
    const menu = document.querySelector('.menu');

    if (menuToggle && menu) {
        // إضافة console.log للتأكد من أن النقر على الزر يعمل
        menuToggle.addEventListener('click', function() {
            console.log("تم النقر على زر القائمة");
            menu.classList.toggle('active');
            
            // تغيير العرض بدلًا من toggle للـ class
            if (menu.style.display === "block") {
                menu.style.display = "none";
            } else {
                menu.style.display = "block";
            }
        });
    }

    // وظيفة لإغلاق القائمة عند النقر على عنصر من عناصر القائمة
    const menuItems = document.querySelectorAll('.menu a');
    
    menuItems.forEach(item => {
        item.addEventListener('click', function() {
            menu.style.display = "none"; // إغلاق القائمة عند النقر على أي عنصر
        });
    });
});