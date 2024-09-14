// عرض وإخفاء القائمة عند الضغط على زر القائمة
document.getElementById('menu-button').addEventListener('click', () => {
    const menu = document.getElementById('menu');
    menu.style.display = (menu.style.display === 'block' || menu.style.display === '') ? 'none' : 'block';
});

// إظهار دائرة القائمة المخفية عند الضغط على دائرة الدكتور
document.querySelectorAll('.doctor-circle').forEach(circle => {
    const name = circle.querySelector('.doctor-name');
    const menu = circle.querySelector('.circle-menu');

    name.addEventListener('click', (event) => {
        event.stopPropagation(); // لمنع إخفاء القائمة عند الضغط على الدائرة نفسها

        // إخفاء جميع القوائم الأخرى
        document.querySelectorAll('.circle-menu').forEach(otherMenu => {
            if (otherMenu !== menu) {
                otherMenu.style.transform = 'translate(-50%, -50%) scale(0)';
                otherMenu.style.visibility = 'hidden';
            }
        });

        // التبديل بين إظهار وإخفاء القائمة الحالية
        if (menu.style.transform === 'translate(-50%, -50%) scale(0)' || menu.style.transform === '') {
            menu.style.transform = 'translate(-50%, -50%) scale(1)';
            menu.style.visibility

 = 'visible';
        } else {
            menu.style.transform = 'translate(-50%, -50%) scale(0)';
            menu.style.visibility = 'hidden';
        }
    });
});

// إخفاء القوائم عند النقر خارج الدائرة
document.addEventListener('click', () => {
    document.querySelectorAll('.circle-menu').forEach(menu => {
        menu.style.transform = 'translate(-50%, -50%) scale(0)';
        menu.style.visibility = 'hidden';
    });
});