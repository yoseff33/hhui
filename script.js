// وظيفة لعرض أو إخفاء القائمة
function toggleMenu() {
    var menu = document.getElementById('menu');
    if (menu.classList.contains('hidden')) {
        menu.classList.remove('hidden');
    } else {
        menu.classList.add('hidden');
    }
}

// التأكد من أن القائمة تختفي عند النقر خارجها
document.addEventListener('click', function(event) {
    var menu = document.getElementById('menu');
    var menuButton = document.querySelector('.menu-btn');
    
    if (!menuButton.contains(event.target) && !menu.contains(event.target)) {
        menu.classList.add('hidden');
    }
});