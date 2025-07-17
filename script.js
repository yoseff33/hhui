// تنشيط فلتر السيارات (سيستخدم في صفحة السيارات)
document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', function() {
        const currentActive = document.querySelector('.filter-btn.active');
        if (currentActive) {
            currentActive.classList.remove('active');
        }
        this.classList.add('active');
        // في مشروع حقيقي، هنا ستتم فلترة السيارات المعروضة بناءً على الزر المختار
    });
});

// تأثير التنقل عند التمرير (مشترك بين جميع الصفحات)
window.addEventListener('scroll', function() {
    const header = document.querySelector('header');
    if (header) { // Check if header exists
        if (window.scrollY > 100) {
            header.style.padding = '10px 0';
            header.style.boxShadow = '0 5px 20px rgba(0, 0, 0, 0.1)';
        } else {
            header.style.padding = '15px 0';
            header.style.boxShadow = '0 5px 20px rgba(0, 0, 0, 0.05)';
        }
    }
});

// -------------------------------------
// Mobile Menu Toggle (إصلاح جذري)
// -------------------------------------
document.addEventListener('DOMContentLoaded', () => {
    const mobileToggleButton = document.querySelector('.mobile-toggle'); // زر الهامبرغر في الهيدر
    const mobileNavMenu = document.querySelector('.nav-links'); // القائمة نفسها (التي تتغير لتصبح قائمة جوال)
    const mobileMenuOverlay = document.querySelector('.mobile-menu-overlay'); // الطبقة الشفافة التي تغطي المحتوى

    // وظيفة لفتح القائمة
    const openMobileMenu = () => {
        if (mobileNavMenu && mobileMenuOverlay && mobileToggleButton) {
            mobileNavMenu.classList.add('open');
            mobileMenuOverlay.style.display = 'block';
            document.body.classList.add('no-scroll'); // منع التمرير في الخلفية
            mobileToggleButton.innerHTML = '<i class="fas fa-times"></i>'; // تغيير الأيقونة إلى X
            mobileToggleButton.setAttribute('aria-expanded', 'true');
        }
    };

    // وظيفة لإغلاق القائمة
    const closeMobileMenu = () => {
        if (mobileNavMenu && mobileMenuOverlay && mobileToggleButton) {
            mobileNavMenu.classList.remove('open');
            mobileMenuOverlay.style.display = 'none';
            document.body.classList.remove('no-scroll'); // استعادة التمرير
            mobileToggleButton.innerHTML = '<i class="fas fa-bars"></i>'; // تغيير الأيقونة إلى هامبرغر
            mobileToggleButton.setAttribute('aria-expanded', 'false');
        }
    };

    // الاستماع لزر الهامبرغر في الهيدر لفتح/إغلاق القائمة
    if (mobileToggleButton) {
        mobileToggleButton.addEventListener('click', (event) => {
            event.stopPropagation(); // منع النقر من الانتشار إلى المستند وإغلاق القائمة فورًا
            const isOpen = mobileNavMenu.classList.contains('open');
            if (isOpen) {
                closeMobileMenu();
            } else {
                openMobileMenu();
            }
        });
    }

    // الاستماع للنقر على الطبقة الشفافة لإغلاق القائمة
    if (mobileMenuOverlay) {
        mobileMenuOverlay.addEventListener('click', closeMobileMenu);
    }

    // إغلاق القائمة عند النقر على أي رابط داخلها
    // (يجب أن تستمع لروابط التنقل الموجودة داخل القائمة)
    if (mobileNavMenu) {
        mobileNavMenu.querySelectorAll('li a').forEach(link => {
            link.addEventListener('click', closeMobileMenu);
        });
    }

    // عند تغيير حجم الشاشة من الجوال إلى الديسكتوب، تأكد من إغلاق القائمة الجانبية
    window.addEventListener('resize', () => {
        // إذا كان حجم الشاشة أكبر من breakpoint الجوال والقائمة مفتوحة
        if (window.innerWidth > 992 && mobileNavMenu.classList.contains('open')) {
            closeMobileMenu();
        }
    });
});


// تنشيط القائمة الجانبية (سيستخدم في صفحات لوحات التحكم)
document.querySelectorAll('.sidebar-menu a').forEach(link => {
    link.addEventListener('click', function(e) {
        const currentActive = document.querySelector('.sidebar-menu a.active');
        if (currentActive) {
            currentActive.classList.remove('active');
        }
        this.classList.add('active');
    });
});

// -------------------------------------
// وظيفة إدارة حالة تسجيل الدخول (Front-end Simulation)
// -------------------------------------

function updateNavbarBasedOnLoginStatus() {
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    const userType = localStorage.getItem('userType');

    // Desktop Nav Links and Buttons
    const desktopNavLinks = document.querySelector('.navbar > .nav-links'); // Desktop nav-links UL
    const desktopAuthLinks = desktopNavLinks ? desktopNavLinks.querySelectorAll('.auth-link') : [];
    const desktopGuestButton = document.getElementById('nav-guest-button');
    const desktopUserProfilePlaceholder = document.getElementById('nav-user-profile-placeholder');

    // Mobile Nav Links (these are the same nav-links elements, but controlled by mobile menu CSS)
    const mobileAuthLinks = desktopNavLinks ? desktopNavLinks.querySelectorAll('.auth-link') : []; // Same elements as desktop, but within mobile view
    const mobileGuestButton = document.getElementById('nav-guest-button'); // Guest button (same as desktop, styling changes)
    const mobileUserProfilePlaceholder = document.getElementById('nav-user-profile-placeholder'); // User profile (same as desktop, styling changes)


    // Hide all auth links and user profile placeholders first
    if (desktopGuestButton) desktopGuestButton.style.display = 'none';
    if (desktopUserProfilePlaceholder) desktopUserProfilePlaceholder.style.display = 'none';
    
    // Auth links are handled by CSS media queries, but ensure their default is hidden
    desktopAuthLinks.forEach(link => link.style.display = 'none');


    if (isLoggedIn) {
        // Desktop user buttons (My Profile/Logout)
        if (desktopUserProfilePlaceholder) {
            desktopUserProfilePlaceholder.innerHTML = `
                <a href="#" class="btn btn-outline" onclick="logoutUser()" style="margin-right: 10px;">
                    <i class="fas fa-sign-out-alt"></i> خروج
                </a>
                <a href="${userType === 'owner' ? 'dashboard-owner.html' : 'dashboard-renter.html'}" class="btn btn-secondary">
                    <i class="fas fa-user-circle"></i> ملفي
                </a>
            `;
            desktopUserProfilePlaceholder.style.display = 'flex';
        }
        
        // Mobile user profile is controlled by CSS based on `nav-buttons-mobile-container`
        // We only need to ensure the correct auth links are visible.

        // Show appropriate auth links for desktop and mobile
        desktopAuthLinks.forEach(link => {
            const linkId = link.id; 
            const linkHref = link.getAttribute('href');

            // For both desktop and mobile views, we control the 'display' property
            if (userType === 'owner') {
                if (linkHref && (linkHref.includes('dashboard-owner.html') || linkHref.includes('add-car.html'))) {
                    link.style.display = 'block'; 
                } else if (link.classList.contains('auth-link')) {
                    link.style.display = 'none'; 
                }
            } else if (userType === 'renter') {
                if (linkHref && linkHref.includes('dashboard-renter.html')) {
                    link.style.display = 'block';
                } else if (link.classList.contains('auth-link')) {
                    link.style.display = 'none'; 
                }
            }
        });


    } else { // Not logged in
        if (desktopGuestButton) desktopGuestButton.style.display = 'flex';
    }
}


function loginUser(type) {
    localStorage.setItem('isLoggedIn', 'true');
    localStorage.setItem('userType', type);
    updateNavbarBasedOnLoginStatus();
    if (type === 'owner') {
        window.location.href = 'dashboard-owner.html';
    } else if (type === 'renter') {
        window.location.href = 'dashboard-renter.html';
    }
}

function logoutUser() {
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('userType');
    updateNavbarBasedOnLoginStatus();
    window.location.href = 'index.html';
}

// -------------------------------------
// وظيفة تحديث بطاقة الولاء (Loyalty Card)
// -------------------------------------

function updateLoyaltyCard(completedRentals) {
    const totalRentalsNeeded = 8;
    const progressPercentage = (completedRentals / totalRentalsNeeded) * 100;

    const progressBarFill = document.querySelector('.loyalty-line-fill');
    const loyaltyDots = document.querySelectorAll('.loyalty-dot');
    const currentRentalsText = document.getElementById('current-rentals-count');
    const remainingRentalsText = document.getElementById('remaining-rentals-count');


    if (progressBarFill) {
        progressBarFill.style.width = `${progressPercentage}%`;
    }

    loyaltyDots.forEach((dot, index) => {
        if (index < completedRentals) {
            dot.classList.add('completed');
        } else {
            dot.classList.remove('completed');
        }
        dot.textContent = index + 1;
    });

    if (currentRentalsText) {
        currentRentalsText.textContent = completedRentals;
    }
    if (remainingRentalsText) {
        remainingRentalsText.textContent = totalRentalsNeeded - completedRentals;
    }

    if (completedRentals >= totalRentalsNeeded) {
        if (remainingRentalsText) {
            remainingRentalsText.textContent = '0';
        }
        const rewardInfo = document.querySelector('.loyalty-reward-info small');
        if (rewardInfo) {
            rewardInfo.textContent = 'تهانينا! تأجيرك المجاني بانتظارك!';
        }
    }
}

// -------------------------------------
// الواجهة الليلية/النهارية (Dark/Light Mode Toggle)
// -------------------------------------

function setupThemeToggle() {
    const themeToggleBtn = document.getElementById('theme-toggle');

    const applyTheme = (theme) => {
        document.body.classList.remove('light-mode', 'dark-mode');
        document.body.classList.add(theme + '-mode');
        localStorage.setItem('theme', theme);

        if (themeToggleBtn) {
            themeToggleBtn.innerHTML = theme === 'light' ? '<i class="fas fa-moon"></i>' : '<i class="fas fa-sun"></i>';
        }
    };

    const currentTheme = localStorage.getItem('theme') || 'light';
    applyTheme(currentTheme);

    if (themeToggleBtn) {
        themeToggleBtn.addEventListener('click', () => {
            const newTheme = document.body.classList.contains('light-mode') ? 'dark' : 'light';
            applyTheme(newTheme);
        });
    }
}


// -------------------------------------
// شريط "آخر مشاهدة للسيارات" (Recently Viewed Cars Bar)
// -------------------------------------

const RECENTLY_VIEWED_KEY = 'recentlyViewedCars';
const MAX_RECENTLY_VIEWED = 5;

function addCarToRecentlyViewed(carId, carImg, carTitle) {
    let recentlyViewed = JSON.parse(localStorage.getItem(RECENTLY_VIEWED_KEY)) || [];

    recentlyViewed = recentlyViewed.filter(car => car.id !== carId);

    recentlyViewed.unshift({ id: carId, img: carImg, title: carTitle });

    if (recentlyViewed.length > MAX_RECENTLY_VIEWED) {
        recentlyViewed = recentlyViewed.slice(0, MAX_RECENTLY_VIEWED);
    }

    localStorage.setItem(RECENTLY_VIEWED_KEY, JSON.stringify(recentlyViewed));
    renderRecentlyViewedCars();
}

function renderRecentlyViewedCars() {
    const recentlyViewed = JSON.parse(localStorage.getItem(RECENTLY_VIEWED_KEY)) || [];
    const container = document.getElementById('recently-viewed-cars-container');

    if (container) {
        if (recentlyViewed.length === 0) {
            container.innerHTML = '<p style="color:var(--gray);">لا توجد سيارات تم عرضها مؤخرًا.</p>';
        } else {
            container.innerHTML = '';
            recentlyViewed.forEach(car => {
                const carLink = document.createElement('a');
                carLink.href = '#';
                carLink.classList.add('recent-car-thumb');
                carLink.innerHTML = `<img src="${car.img}" alt="${car.title}">`;
                container.appendChild(carLink);
            });
        }
    }
}


// -------------------------------------
// شهادات العملاء كـ "سلايدر" تفاعلي (Interactive Testimonial Slider)
// -------------------------------------
let slideIndex = 0;
let slideInterval;

function showSlides() {
    const slides = document.querySelectorAll('.testimonial-slide');
    const dots = document.querySelectorAll('.dot');
    if (slides.length === 0) return;

    slides.forEach(slide => slide.style.display = 'none');
    dots.forEach(dot => dot.classList.remove('active'));

    slideIndex++;
    if (slideIndex > slides.length) {
        slideIndex = 1;
    }

    slides[slideIndex - 1].style.display = 'block';
    dots[slideIndex - 1].classList.add('active');
}

function currentSlide(n) {
    clearInterval(slideInterval); // Stop auto-slide when manual navigation
    slideIndex = n;
    const slides = document.querySelectorAll('.testimonial-slide');
    const dots = document.querySelectorAll('.dot');
    if (slides.length === 0) return;

    slides.forEach(slide => slide.style.display = 'none');
    dots.forEach(dot => dot.classList.remove('active'));

    slides[slideIndex - 1].style.display = 'block';
    dots[slideIndex - 1].classList.add('active');
    
    slideInterval = setInterval(showSlides, 5000); // Restart auto-slide after manual navigation
}


// -------------------------------------
// أداة "اختبار السيارة المناسبة لي" (Which Car Suits Me Quiz)
// -------------------------------------
function setupQuiz() {
    const quizForm = document.getElementById('car-quiz-form');
    const quizResults = document.getElementById('quiz-results');
    if (!quizForm || !quizResults) return;

    quizForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const formData = new FormData(quizForm);
        const answers = {};
        for (let [key, value] of formData.entries()) {
            answers[key] = value;
        }

        let recommendation = "لا يمكننا تحديد سيارة مناسبة بناءً على اختياراتك.";
        let carType = "";

        // Simple quiz logic
        if (answers.passengers === '5' || answers.box-shadow: var(--box-shadow);
    background-color: var(--card-bg-light);
    z-index: 1;
}
body.dark-mode #mapid {
    background-color: var(--card-bg-dark);
}

/* Filter buttons for map */
.map-filters {
    display: flex;
    justify-content: center;
    gap: 15px;
    margin-top: 30px;
    flex-wrap: wrap;
}
.map-filter-btn {
    padding: 10px 25px;
    border-radius: 12px;
    background: var(--card-bg-light);
    border: 2px solid var(--border-color-light);
    font-weight: 700;
    cursor: pointer;
    transition: var(--transition);
    font-size: 1rem;
    color: var(--dark);
}
body.dark-mode .map-filter-btn {
    background: #333;
    border-color: #444;
    color: var(--text-color-dark);
}
.map-filter-btn.active, .map-filter-btn:hover {
    background: var(--primary);
    color: white;
    border-color: var(--primary);
}

/* Custom Leaflet Marker Icon */
.custom-car-icon {
    background-color: var(--primary);
    border-radius: 50%;
    width: 40px !important;
    height: 40px !important;
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    font-size: 1.2rem;
    border: 2px solid white;
    box-shadow: 0 0 0 5px rgba(46, 139, 87, 0.3);
    transition: transform 0.2s ease;
}
.custom-car-icon:hover {
    transform: scale(1.1);
    box-shadow: 0 0 0 8px rgba(46, 139, 87, 0.5);
}

/* Custom Leaflet Popup (InfoWindow) Styling */
.leaflet-popup-content-wrapper {
    background: var(--card-bg-light);
    color: var(--dark);
    border-radius: var(--border-radius);
    box-shadow: var(--box-shadow);
    padding: 0;
    text-align: right;
    direction: rtl;
}
body.dark-mode .leaflet-popup-content-wrapper {
    background: var(--card-bg-dark);
    color: var(--text-color-dark);
}

.leaflet-popup-content {
    margin: 0;
    padding: 15px;
}

.leaflet-popup-tip {
    background: var(--card-bg-light);
    box-shadow: var(--box-shadow);
}
body.dark-mode .leaflet-popup-tip {
    background: var(--card-bg-dark);
}

.leaflet-popup-close-button {
    color: var(--dark);
    font-size: 1.5rem;
    top: 5px;
    right: 5px;
}
body.dark-mode .leaflet-popup-close-button {
    color: var(--text-color-dark);
}

.popup-car-details h4 {
    margin-top: 0;
    margin-bottom: 10px;
    color: var(--primary);
    font-size: 1.2rem;
}

.popup-car-details p {
    margin-bottom: 5px;
    font-size: 0.95rem;
    color: var(--text-color-light);
}
body.dark-mode .popup-car-details p {
    color: var(--text-color-dark);
}

.popup-car-details .car-img-popup {
    width: 100%;
    height: 120px;
    object-fit: cover;
    border-radius: var(--border-radius);
    margin-bottom: 10px;
}

.popup-car-details .btn {
    display: block;
    width: calc(100% - 30px);
    margin: 15px auto 0;
    text-align: center;
    padding: 10px 15px;
    font-size: 0.9rem;
}


/* ------------------------------------- */
/* Responsive Design (الجوال واللابتوب) */
/* ------------------------------------- */

/* لأجهزة الكمبيوتر اللوحية والشاشات المتوسطة (أقل من 1200 بكسل) */
@media (max-width: 1200px) {
    .hero h1 {
        font-size: 3.8rem;
    }
    .hero p {
        font-size: 1.3rem;
    }
    .features-grid, .cars-grid {
        grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
        gap: 25px;
    }
    .steps-container {
        flex-wrap: wrap;
        justify-content: center;
        gap: 30px;
    }
    .step {
        width: 48%;
        padding: 30px 20px;
    }
    .steps-container:before {
        display: none;
    }
    .footer-grid {
        grid-template-columns: repeat(2, 1fr);
        gap: 30px;
    }
    .dashboard {
        grid-template-columns: 1fr;
    }
    .dashboard-sidebar {
        padding: 20px;
        text-align: center;
    }
    .user-profile {
        justify-content: center;
    }
    .user-info {
        text-align: center;
    }
    .sidebar-menu {
        display: flex;
        flex-wrap: wrap;
        justify-content: center;
        gap: 10px;
    }
    .sidebar-menu li {
        margin-bottom: 0;
    }
    .sidebar-menu a {
        padding: 10px 15px;
        font-size: 0.95rem;
    }
    .testimonial-slide {
        padding: 30px;
    }
    .testimonial-text {
        font-size: 1.15rem;
    }
    .quiz-container {
        padding: 30px;
    }
    .quiz-question p {
        font-size: 1.1rem;
    }
    .quiz-options label {
        font-size: 1rem;
        padding: 12px 15px;
    }
    #mapid {
        height: 500px;
    }
}

/* لأجهزة الكمبيوتر اللوحية والشاشات الكبيرة (أقل من 992 بكسل) */
@media (max-width: 992px) {
    body {
        padding-top: 70px; /* Adjust padding for smaller header on mobile */
    }
    header {
        padding: 10px 0; /* Smaller header on mobile */
    }
    .logo-icon {
        width: 40px;
        height: 40px;
        font-size: 1.2rem;
    }
    .logo-text {
        font-size: 1.5rem;
    }
    /* Mobile Toggle Button */
    .mobile-toggle {
        display: block; /* Show mobile menu button */
        font-size: 1.6rem;
        margin-left: 15px; /* Add some space from login button */
    }

    /* Adjust space for nav-buttons in mobile header */
    .navbar .nav-buttons {
        /* Make nav-buttons take full width minus logo and mobile toggle */
        flex-grow: 1; 
        justify-content: flex-end; /* Push content to the right (start for RTL) */
        gap: 10px; /* Reduced gap */
        margin-left: 15px; /* Space from logo */
    }
    .navbar .nav-buttons > .btn {
        padding: 8px 15px; /* Smaller padding for button text */
        font-size: 0.9rem; /* Smaller font size for buttons */
    }
    .navbar .nav-buttons > .theme-toggle {
        margin-left: 10px; /* Space between theme toggle and other buttons */
        order: 1; /* Move theme toggle to the end */
    }
    .navbar .mobile-toggle {
        order: 2; /* Move toggle button to the very end */
        margin-left: 10px; /* Space after the last button */
    }
    .navbar .nav-buttons > .guest-only {
        margin-right: 0 !important; /* Remove right margin from guest button */
    }
    .navbar .nav-buttons > #nav-user-profile-placeholder {
        margin-right: 0 !important;
    }


    /* Mobile Nav Menu Container (Slides from the side - Right) */
    .nav-links { /* This is the element that becomes the mobile menu */
        display: flex; /* Always flex for stacking content */
        position: fixed;
        top: 0;
        right: -100%; /* Start completely off-screen to the right (use % for responsiveness) */
        width: 100%; /* Full width */
        max-width: 320px; /* Max width to ensure it looks good on tablets in portrait */
        height: 100%; /* Full height of the viewport */
        background-color: var(--navbar-bg-light);
        box-shadow: -5px 0 20px rgba(0, 0, 0, 0.2);
        z-index: 1000;
        transition: right 0.3s ease-in-out; /* Transition from right */
        padding: 20px;
        flex-direction: column;
        align-items: flex-start; /* Align contents to start (right side for RTL) */
        justify-content: flex-start;
        overflow-y: auto; /* Allow scrolling if content overflows */
    }
    body.dark-mode .nav-links {
        background-color: var(--navbar-bg-dark);
    }
    .nav-links.open {
        right: 0; /* Slide into view */
    }

    /* Force desktop nav-links to be hidden always */
    .navbar > .nav-links { /* Target specifically the desktop nav-links in the navbar */
        display: none !important;
    }


    /* Overlay for mobile menu */
    .mobile-menu-overlay {
        display: none;
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background-color: rgba(0, 0, 0, 0.7);
        z-index: 998;
    }

    /* Styles for links and buttons INSIDE the mobile menu */
    .nav-links li { /* List items inside mobile menu */
        width: 100%;
        text-align: right; /* Right-align text for RTL */
        margin-bottom: 0;
    }
    .nav-links li a {
        display: block;
        padding: 15px 10px;
        font-size: 1.2rem;
        color: var(--dark);
        border-bottom: 1px solid var(--light-gray);
    }
    body.dark-mode .nav-links li a {
        color: var(--text-color-dark);
        border-bottom-color: var(--border-color-dark);
    }
    .nav-links li:last-child a {
        border-bottom: none;
    }
    
    /* Nav buttons inside mobile menu - these are from the desktop structure, just repositioned */
    /* They are now directly part of the .nav-links list on mobile, so they use the same flex container */
    .nav-links .nav-buttons-mobile-container { /* This is the LI that contains the buttons */
        width: 100%; /* Make sure it takes full width in mobile menu */
        padding-top: 20px;
        margin-top: 20px;
        border-top: 1px solid var(--light-gray);
        display: flex; /* Ensure it's a flex container */
        flex-direction: column;
        align-items: flex-start; /* Align to start */
        gap: 10px;
    }
    body.dark-mode .nav-links .nav-buttons-mobile-container {
        border-top-color: var(--border-color-dark);
    }

    .nav-links .nav-buttons-mobile-container .nav-buttons { /* This targets the actual nav-buttons group inside the LI */
        flex-direction: column;
        width: 100%;
        margin-top: 0; /* Remove top margin as its parent has it */
        align-items: flex-start;
        gap: 10px;
    }
    .nav-links .nav-buttons-mobile-container .nav-buttons .btn {
        width: 100%;
        margin-right: 0 !important; /* Override desktop margin */
        margin-left: 0 !important; /* Override desktop margin */
    }
    .nav-links .nav-buttons-mobile-container .theme-toggle {
        width: 100%;
        text-align: right;
        margin: 0 !important; /* Remove specific desktop margins */
        padding: 10px 0; /* Add some padding */
    }


    .hero h1 {
        font-size: 3rem;
    }
    .hero p {
        font-size: 1.2rem;
    }
    .section-title h2 {
        font-size: 2.5rem;
    }
    .section-title p {
        font-size: 1.1rem;
    }
    .btn {
        padding: 15px 30px;
        font-size: 1rem;
    }
    .footer-grid {
        grid-template-columns: 1fr;
    }
    .footer-col {
        text-align: center;
    }
    .footer-col h3:after {
        right: 50%;
        transform: translateX(50%);
    }
    .social-links {
        justify-content: center;
    }
    .booking-item {
        flex-direction: column;
        align-items: flex-start;
        text-align: right;
    }
    .booking-car, .booking-details, .booking-date, .booking-price, .booking-status {
        width: 100%;
        text-align: right;
    }
    .booking-date, .booking-price, .booking-status {
        text-align: right;
    }
    .booking-car img {
        margin-right: 15px;
    }
    .loyalty-progress {
        flex-wrap: wrap;
        justify-content: center;
        padding: 5px;
    }
    .loyalty-dot {
        margin: 5px;
        width: 30px;
        height: 30px;
        font-size: 0.85rem;
    }
    .loyalty-line {
        height: 4px;
    }
    .quiz-container {
        margin: 120px auto 40px;
    }
    #mapid {
        height: 400px;
    }
}

/* لأجهزة الكمبيوتر اللوحية الصغيرة (أقل من 768 بكسل) */
@media (max-width: 768px) {
    body {
        padding-top: 70px;
    }
    header {
        padding: 10px 0;
    }
    .logo-icon {
        width: 40px;
        height: 40px;
        font-size: 1.2rem;
    }
    .logo-text {
        font-size: 1.5rem;
    }
    .mobile-toggle {
        font-size: 1.6rem;
    }

    .hero h1 {
        font-size: 2.5rem;
    }
    .hero p {
        font-size: 1.1rem;
    }
    .hero-buttons {
        flex-direction: column;
        align-items: center;
    }
    .hero-buttons .btn {
        width: 80%;
    }
    .section-title h2 {
        font-size: 2rem;
    }
    .section-title p {
        font-size: 1.1rem;
    }
    .steps-container {
        flex-direction: column;
        align-items: center;
    }
    .step {
        width: 90%;
    }
    .form-grid {
        grid-template-columns: 1fr;
    }
    .add-car-form {
        padding: 25px;
    }
    .car-actions {
        flex-direction: column;
    }
    .car-actions .btn {
        width: 100%;
    }
    .dashboard-content {
        padding: 20px;
    }
    .stats-grid {
        grid-template-columns: 1fr;
        gap: 20px;
    }
    .recent-bookings {
        padding: 15px;
    }
    .booking-car {
        flex-direction: column;
        align-items: flex-end;
        text-align: right;
    }
    .booking-car img {
        margin-left: 0;
        margin-bottom: 10px;
    }
    .booking-details {
        text-align: right;
    }
    .loyalty-card h3 {
        font-size: 1.8rem;
    }
    .loyalty-card p {
        font-size: 1rem;
    }
    .loyalty-promo h3 {
        font-size: 1.8rem;
    }
    .loyalty-promo p {
        font-size: 1.0rem;
    }
    .recently-viewed-bar {
        padding: 15px 0;
    }
    .recently-viewed-bar h3 {
        font-size: 1.2rem;
    }
    .recent-car-thumb {
        width: 100px;
        height: 70px;
    }
    .testimonial-slide {
        padding: 20px;
    }
    .testimonial-text {
        font-size: 1rem;
    }
    .testimonial-author-img {
        width: 60px;
        height: 60px;
    }
    .testimonial-author-name {
        font-size: 1rem;
    }
}

/* للهواتف الذكية الصغيرة جداً (أقل من 480 بكسل) */
@media (max-width: 480px) {
    .container {
        padding: 0 15px;
    }
    .hero h1 {
        font-size: 2rem;
    }
    .hero p {
        font-size: 1rem;
    }
    .section-title h2 {
        font-size: 1.8rem;
    }
    .section-title p {
        font-size: 0.95rem;
    }
    .btn {
        padding: 12px 25px;
        font-size: 0.95rem;
    }
    .filter-btn {
        padding: 10px 20px;
        font-size: 0.9rem;
    }
    .car-card {
        margin: 0 auto;
        max-width: 300px;
    }
    .car-info {
        padding: 20px;
    }
    .car-title, .car-price {
        font-size: 1.5rem;
    }
    .feature-card {
        padding: 30px 20px;
    }
    .feature-icon {
        width: 80px;
        height: 80px;
        font-size: 2rem;
    }
    .feature-card h3 {
        font-size: 1.6rem;
    }
}
