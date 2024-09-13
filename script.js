const doctorCircles = document.querySelectorAll('.doctor-circle');

doctorCircles.forEach(circle => {
  const name = circle.querySelector('.doctor-name');
  const menu = circle.querySelector('.circle-menu');

  // إظهار أو إخفاء القائمة عند الضغط على اسم الدكتور
  name.addEventListener('click', (event) => {
    event.stopPropagation(); // لمنع إخفاء القائمة عند الضغط على الدائرة نفسها

    // التبديل بين إظهار وإخفاء القائمة
    if (menu.style.transform === 'translate(-50%, -50%) scale(0)' || menu.style.transform === '') {
      menu.style.transform = 'translate(-50%, -50%) scale(1)';
    } else {
      menu.style.transform = 'translate(-50%, -50%) scale(0)';
    }

    // إخفاء القوائم الأخرى
    const otherMenus = document.querySelectorAll('.circle-menu');
    otherMenus.forEach(otherMenu => {
      if (otherMenu !== menu) {
        otherMenu.style.transform = 'translate(-50%, -50%) scale(0)';
      }
    });
  });

  // إخفاء القائمة عند النقر خارجها
  document.addEventListener('click', () => {
    menu.style.transform = 'translate(-50%, -50%) scale(0)';
  });
});

// رابط "الطلاب" يؤدي إلى صفحة جديدة
const studentsLink = document.getElementById('students-link');
studentsLink.addEventListener('click', function(event) {
    event.preventDefault(); // منع التصرف الافتراضي للرابط
    window.location.href = 'designers.html'; // الانتقال إلى صفحة الطلاب عند الضغط على الرابط
});