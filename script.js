const doctorCircles = document.querySelectorAll('.doctor-circle');

doctorCircles.forEach(circle => {
  const name = circle.querySelector('.doctor-name');
  const menu = circle.querySelector('.circle-menu');

  name.addEventListener('click', (event) => {
    // إظهار أو إخفاء القائمة عند الضغط على اسم الدكتور
    event.stopPropagation(); // لمنع إخفاء القائمة عند الضغط على الدائرة نفسها
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