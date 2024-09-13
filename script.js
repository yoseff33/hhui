const doctorCircles = document.querySelectorAll('.doctor-circle');

doctorCircles.forEach(circle => {
    const name = circle.querySelector('.doctor-name');
    const menu = circle.querySelector('.circle-menu');

    name.addEventListener('click', (event) => {
        event.stopPropagation(); // لمنع إخفاء القائمة عند الضغط على الدائرة نفسها

        // إخفاء جميع القوائم
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