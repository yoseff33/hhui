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
// Mobile Menu Toggle (إصلاح شامل)
// -------------------------------------
document.addEventListener('DOMContentLoaded', () => {
    const mobileToggleButton = document.querySelector('.mobile-toggle'); // زر الهامبرغر في الهيدر (العنصر الوحيد المتحكم)
    const mobileNavMenu = document.querySelector('.nav-links'); // القائمة نفسها (نفس nav-links الديسكتوب، لكن تنسيقاتها تتغير للجوال)
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
    const desktopNavLinksContainer = document.querySelector('.navbar > .nav-links');
    const desktopAuthLinks = desktopNavLinksContainer ? desktopNavLinksContainer.querySelectorAll('.auth-link') : [];
    const desktopGuestButton = document.getElementById('nav-guest-button');
    const desktopUserProfilePlaceholder = document.getElementById('nav-user-profile-placeholder');

    // Mobile Nav Links (these are the same nav-links elements, but controlled by mobile menu CSS)
    const mobileAuthLinks = mobileNavLinksContainer ? mobileNavLinksContainer.querySelectorAll('.auth-link') : [];
    const mobileGuestButtonInNavButtons = document.querySelector('.nav-buttons .guest-only'); // This button is duplicated for mobile
    const mobileUserProfilePlaceholderInNavButtons = document.querySelector('.nav-buttons #nav-user-profile-placeholder'); // This placeholder for mobile

    if (isLoggedIn) {
        // Hide guest button on desktop and mobile
        if (desktopGuestButton) desktopGuestButton.style.display = 'none';
        if (mobileGuestButtonInNavButtons) mobileGuestButtonInNavButtons.style.display = 'none';

        // Show user profile placeholder on desktop
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
            desktopUserProfilePlaceholder.style.alignItems = 'center';
        }
        
        // No separate mobile profile placeholder needed, desktop one is conditionally displayed/hidden by CSS
        // Mobile menu CSS will handle its display within the overall nav-links structure
        
        // Hide all auth links first (desktop)
        desktopAuthLinks.forEach(link => link.style.display = 'none');
        
        // Then show appropriate links based on user type (desktop)
        if (userType === 'owner') {
            if (document.getElementById('nav-owner-dashboard')) document.getElementById('nav-owner-dashboard').style.display = 'block';
            if (document.getElementById('nav-add-car')) document.getElementById('nav-add-car').style.display = 'block';
        } else if (userType === 'renter') {
            if (document.getElementById('nav-renter-dashboard')) document.getElementById('nav-renter-dashboard').style.display = 'block';
        }

        // Manage visibility of auth links for mobile nav (same nav-links element, different display controlled by CSS)
        // These links are just elements within the main .nav-links, their display in mobile view is controlled by CSS media queries
        // and a specific class `show-mobile` which we will now remove.
        // Instead, the CSS rules for .nav-links li a (in mobile media query) will control their display based on `auth-link` class
        mobileAuthLinks.forEach(link => {
            const linkId = link.id; 
            if (userType === 'owner' && (linkId === 'nav-owner-dashboard' || linkId === 'nav-add-car')) {
                link.style.display = 'block'; // Make it visible if it's the right link type
            } else if (userType === 'renter' && linkId === 'nav-renter-dashboard') {
                link.style.display = 'block';
            } else if (link.classList.contains('auth-link')) {
                link.style.display = 'none'; // Hide other auth links
            }
        });


    } else {
        // Hide user profile placeholder on desktop
        if (desktopGuestButton) desktopGuestButton.style.display = 'flex';
        if (desktopUserProfilePlaceholder) desktopUserProfilePlaceholder.style.display = 'none';
        
        // Hide user profile placeholder on mobile (guest button will be visible instead)
        if (mobileGuestButtonInNavButtons) mobileGuestButtonInNavButtons.style.display = 'flex';
        if (mobileUserProfilePlaceholderInNavButtons) mobileUserProfilePlaceholderInNavButtons.style.display = 'none';


        // Hide all auth links on desktop and mobile
        desktopAuthLinks.forEach(link => link.style.display = 'none');
        mobileAuthLinks.forEach(link => link.style.display = 'none');
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
        if (answers.passengers === '5' || answers.passengers === '7') {
            if (answers.budget === 'medium' || answers.budget === 'high') {
                recommendation = "نوصي بسيارة دفع رباعي فسيحة ومريحة لرحلاتك العائلية.";
                carType = "دفع رباعي";
            } else {
                recommendation = "ننصح بسيارة سيدان متوسطة الحجم، اقتصادية ومناسبة للاستخدام اليومي.";
                carType = "سيدان";
            }
        } else if (answers.passengers === '2' || answers.passengers === '4') {
            if (answers.budget === 'low') {
                recommendation = "سيارة اقتصادية صغيرة ستكون مثالية لتنقلاتك اليومية داخل المدينة.";
                carType = "اقتصادية";
            } else if (answers.style === 'sporty' || answers.style === 'luxury') {
                recommendation = "سيارة فاخرة أو رياضية ستلبي رغبتك في الأناقة والأداء العالي.";
                carType = "فاخرة";
            } else {
                recommendation = "سيارة سيدان أنيقة وعملية ستكون خياراً ممتازاً لك.";
                carType = "سيدان";
            }
        }

        quizResults.innerHTML = `
            <h3>نتائج اختبارك</h3>
            <p>${recommendation}</p>
            <p>يمكنك استكشاف السيارات من فئة: <strong>${carType}</strong></p>
            <a href="cars.html" class="btn btn-primary" style="margin-top:20px;">
                <i class="fas fa-search"></i> استكشف السيارات
            </a>
        `;
        quizResults.style.display = 'block';
    });
}


// -------------------------------------
// وظائف خريطة السيارات (Leaflet Map)
// -------------------------------------

let map;
let carMarkersLayer;

// بيانات السيارات الافتراضية داخل جامعة القصيم (مع إحداثيات من المستخدم)
const qassimCarsData = [
    {
        id: 'camry', type: 'سيدان', model: 'تويوتا كامري 2022', price: '85', location: 'مواقف المبنى الإداري',
        lat: 26.348037, lng: 43.771591,
        img: 'https://tse2.mm.bing.net/th/id/OIP.F3b-M0eckL0XjmywTpu8EgHaFj?rs=1&pid=ImgDetMain&o=7&rm=3'
    },
    {
        id: 'landcruiser', type: 'دفع رباعي', model: 'تويوتا لاندكروزر 2021', price: '220', location: 'كلية الهندسة',
        lat: 26.3350, lng: 43.7685,
        img: 'https://www.autopediame.com/userfiles/images/%D9%84%D8%A7%D9%86%D8%AF%D9%83%D8%B1%D9%88%D8%B2%D8%B1/%D8%AA%D9%88%D9%8A%D9%88%D8%AA%D8%A7%20%D9%84%D8%A7%D9%86%D8%AF%D9%83%D8%B1%D9%88%D8%B2%D8%B1%201.jpg'
    },
    {
        id: 'elantra', type: 'اقتصادية', model: 'هونداي النترا 2023', price: '75', location: 'بجوار المكتبة المركزية',
        lat: 26.351008, lng: 43.775861,
        img: 'https://static.sayidaty.net/styles/900_scale/public/2022-03/80578.jpeg.webp'
    },
    {
        id: 'mercedes', type: 'فاخرة', model: 'مرسيدس E-Class 2020', price: '300', location: 'المركز الثقافي',
        lat: 26.349181, lng: 43.761351,
        img: 'https://media.elbalad.news/2024/10/large/995/9/554.jpg'
    },
    {
        id: 'malibu', type: 'سيدان', model: 'شيفروليه ماليبو 2020', price: '90', location: 'أمام سكن الطلاب',
        lat: 26.3400, lng: 43.7630,
        img: 'https://cdn.motor1.com/images/mgl/zZX8w/s3/2020-chevrolet-malibu.jpg'
    },
    {
        id: 'patrol', type: 'دفع رباعي', model: 'نيسان باترول 2023', price: '250', location: 'مواقف كلية العلوم',
        lat: 26.3365, lng: 43.7645,
        img: 'https://www.nissan-cdn.net/content/dam/Nissan/middle-east/vehicles/Patrol/Patrol-MY23/overview/2023-Nissan-Patrol-hero-desktop.webp'
    },
    {
        id: 'kia-rio', type: 'اقتصادية', model: 'كيا ريو 2024', price: '65', location: 'مواقف كلية الحاسب',
        lat: 26.3340, lng: 43.7670,
        img: 'https://www.kia.com/content/dam/kw/vehicles/rio/2024/kia_rio_sedan_2024_01_m.jpg'
    },
];

function initMap() {
    const qassimUniversityCoords = [26.345, 43.769];
    const defaultZoom = 14;

    // Check if map container exists and Leaflet library (L) is loaded, and map is not already initialized
    if (document.getElementById('mapid') && typeof L !== 'undefined' && !map) {
        map = L.map('mapid').setView(qassimUniversityCoords, defaultZoom);

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(map);

        carMarkersLayer = L.layerGroup().addTo(map);
        renderCarsOnMap('الكل');
    }
}

function createCarIcon(carType) {
    let iconClass = 'fas fa-car';
    return L.divIcon({
        className: 'custom-car-icon',
        html: `<i class="${iconClass}"></i>`,
        iconSize: [40, 40],
        iconAnchor: [20, 40],
        popupAnchor: [0, -40]
    });
}

function renderCarsOnMap(filterType = 'الكل') {
    if (!map) return;
    carMarkersLayer.clearLayers();

    const filteredCars = filterType === 'الكل' ? qassimCarsData : qassimCarsData.filter(car => car.type === filterType);

    filteredCars.forEach(car => {
        const carIcon = createCarIcon(car.type);
        const marker = L.marker([car.lat, car.lng], { icon: carIcon }).addTo(carMarkersLayer);

        const popupContent = `
            <div class="popup-car-details">
                <img src="${car.img}" alt="${car.model}" class="car-img-popup">
                <h4>${car.model}</h4>
                <p><strong>السعر:</strong> ${car.price} ريال/اليوم</p>
                <p><strong>الموقع:</strong> ${car.location}</p>
                <a href="#" class="btn btn-primary">احجز الآن</a>
            </div>
        `;
        marker.bindPopup(popupContent);
    });
}

function setupMapFilters() {
    document.querySelectorAll('.map-filter-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const currentActive = document.querySelector('.map-filter-btn.active');
            if (currentActive) {
                currentActive.classList.remove('active');
            }
            this.classList.add('active');
            
            const filterType = this.dataset.filter;
            renderCarsOnMap(filterType);
        });
    });
}


// -------------------------------------
// عند تحميل المحتوى (DOMContentLoaded)
// -------------------------------------

document.addEventListener('DOMContentLoaded', () => {
    setupThemeToggle();
    updateNavbarBasedOnLoginStatus();

    const userCompletedRentals = 3;
    updateLoyaltyCard(userCompletedRentals);

    renderRecentlyViewedCars();

    if (document.querySelector('.testimonial-slider')) {
        showSlides();
        slideInterval = setInterval(showSlides, 5000);
    }
    
    setupQuiz();

    // Check if mapid exists on current page before initializing map
    // Ensure Leaflet is loaded before calling initMap
    if (document.getElementById('mapid')) {
        // Add a small delay for Leaflet to ensure the script is fully loaded.
        // This is a common workaround for CDN loading issues, especially with SRI.
        setTimeout(() => {
            if (typeof L !== 'undefined') { // Final check for Leaflet
                initMap();
                setupMapFilters();
            } else {
                console.error("Leaflet library (L) is not defined. Map initialization failed. Check network tab for Leaflet JS/CSS loading errors.");
            }
        }, 100); // 100ms delay
    }
});

document.addEventListener('click', (e) => {
    if (e.target.closest('.car-card')) {
        const carCard = e.target.closest('.car-card');
        const carImg = carCard.querySelector('.car-img img').src;
        const carTitle = carCard.querySelector('.car-title').textContent;
        const carId = carTitle.replace(/\s/g, '-');

        addCarToRecentlyViewed(carId, carImg, carTitle);
    }
});