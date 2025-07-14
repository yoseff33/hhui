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
    if (window.scrollY > 100) {
        header.style.padding = '10px 0';
        header.style.boxShadow = '0 5px 20px rgba(0, 0, 0, 0.1)';
    } else {
        header.style.padding = '15px 0';
        header.style.boxShadow = '0 5px 20px rgba(0, 0, 0, 0.05)';
    }
});

// Mobile Menu Toggle
document.addEventListener('DOMContentLoaded', () => {
    const mobileToggle = document.querySelector('.mobile-toggle');
    const navLinks = document.querySelector('.nav-links');
    const overlay = document.createElement('div');
    overlay.classList.add('mobile-menu-overlay');
    document.body.appendChild(overlay);

    mobileToggle.addEventListener('click', () => {
        navLinks.classList.toggle('open');
        overlay.style.display = navLinks.classList.contains('open') ? 'block' : 'none';
        document.body.style.overflow = navLinks.classList.contains('open') ? 'hidden' : ''; /* Disable scroll when menu is open */
    });

    overlay.addEventListener('click', () => {
        navLinks.classList.remove('open');
        overlay.style.display = 'none';
        document.body.style.overflow = '';
    });

    // Close menu when a link is clicked
    navLinks.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            if (navLinks.classList.contains('open')) {
                navLinks.classList.remove('open');
                overlay.style.display = 'none';
                document.body.style.overflow = '';
            }
        });
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

    const authLinks = document.querySelectorAll('.nav-links .auth-link');
    const ownerDashboardLink = document.getElementById('nav-owner-dashboard');
    const renterDashboardLink = document.getElementById('nav-renter-dashboard');
    const addCarLink = document.getElementById('nav-add-car');

    const guestButton = document.getElementById('nav-guest-button');
    const userProfilePlaceholder = document.getElementById('nav-user-profile-placeholder');

    if (isLoggedIn) {
        if (guestButton) guestButton.style.display = 'none';
        if (userProfilePlaceholder) {
            userProfilePlaceholder.innerHTML = `
                <a href="#" class="btn btn-outline" onclick="logoutUser()" style="margin-right: 10px;">
                    <i class="fas fa-sign-out-alt"></i> خروج
                </a>
                <a href="${userType === 'owner' ? 'dashboard-owner.html' : 'dashboard-renter.html'}" class="btn btn-secondary">
                    <i class="fas fa-user-circle"></i> ملفي
                </a>
            `;
            userProfilePlaceholder.style.display = 'flex';
            userProfilePlaceholder.style.alignItems = 'center';
        }

        authLinks.forEach(link => link.style.display = 'none');

        if (userType === 'owner') {
            if (ownerDashboardLink) ownerDashboardLink.style.display = 'block';
            if (addCarLink) addCarLink.style.display = 'block';
        } else if (userType === 'renter') {
            if (renterDashboardLink) renterDashboardLink.style.display = 'block';
        }

    } else {
        if (guestButton) guestButton.style.display = 'flex';
        if (userProfilePlaceholder) userProfilePlaceholder.style.display = 'none';

        authLinks.forEach(link => link.style.display = 'none');
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
    if (!themeToggleBtn) return;

    const currentTheme = localStorage.getItem('theme') || 'light';
    document.body.classList.add(currentTheme + '-mode');
    themeToggleBtn.innerHTML = currentTheme === 'light' ? '<i class="fas fa-moon"></i>' : '<i class="fas fa-sun"></i>';

    themeToggleBtn.addEventListener('click', () => {
        if (document.body.classList.contains('light-mode')) {
            document.body.classList.remove('light-mode');
            document.body.classList.add('dark-mode');
            localStorage.setItem('theme', 'dark');
            themeToggleBtn.innerHTML = '<i class="fas fa-sun"></i>';
        } else {
            document.body.classList.remove('dark-mode');
            document.body.classList.add('light-mode');
            localStorage.setItem('theme', 'light');
            themeToggleBtn.innerHTML = '<i class="fas fa-moon"></i>';
        }
    });
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
    slideIndex = n;
    const slides = document.querySelectorAll('.testimonial-slide');
    const dots = document.querySelectorAll('.dot');
    if (slides.length === 0) return;

    slides.forEach(slide => slide.style.display = 'none');
    dots.forEach(dot => dot.classList.remove('active'));

    slides[slideIndex - 1].style.display = 'block';
    dots[slideIndex - 1].classList.add('active');
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

// بيانات السيارات الافتراضية داخل جامعة القصيم (مع إحداثيات حقيقية من المستخدم)
const qassimCarsData = [
    {
        id: 'car1', type: 'سيدان', model: 'تويوتا كامري 2022', price: '85', location: 'موقع 1 (جامعة القصيم)',
        lat: 26.348037, lng: 43.771591, // الإحداثيات من المستخدم
        img: 'https://tse2.mm.bing.net/th/id/OIP.F3b-M0eckL0XjmywTpu8EgHaFj?rs=1&pid=ImgDetMain&o=7&rm=3'
    },
    {
        id: 'car2', type: 'دفع رباعي', model: 'تويوتا لاندكروزر 2021', price: '220', location: 'كلية الهندسة',
        lat: 26.3350, lng: 43.7685, // لم يتم تغييرها، بقيت افتراضية
        img: 'https://www.autopediame.com/userfiles/images/%D9%84%D8%A7%D9%86%D8%AF%D9%83%D8%B1%D9%88%D8%B2%D8%B1/%D8%AA%D9%88%D9%8A%D9%88%D8%AA%D8%A7%20%D9%84%D8%A7%D9%86%D8%AF%D9%83%D8%B1%D9%88%D8%B2%D8%B1%201.jpg'
    },
    {
        id: 'car3', type: 'اقتصادية', model: 'هونداي النترا 2023', price: '75', location: 'موقع 2 (جامعة القصيم)',
        lat: 26.351008, lng: 43.775861, // الإحداثيات من المستخدم
        img: 'https://static.sayidaty.net/styles/900_scale/public/2022-03/80578.jpeg.webp'
    },
    {
        id: 'car4', type: 'فاخرة', model: 'مرسيدس E-Class 2020', price: '300', location: 'موقع 3 (جامعة القصيم)',
        lat: 26.349181, lng: 43.761351, // الإحداثيات من المستخدم
        img: 'https://media.elbalad.news/2024/10/large/995/9/554.jpg'
    },
    {
        id: 'car5', type: 'سيدان', model: 'شيفروليه ماليبو 2020', price: '90', location: 'سكن الطلاب (بوابة 4)',
        lat: 26.3400, lng: 43.7630,
        img: 'https://cdn.motor1.com/images/mgl/zZX8w/s3/2020-chevrolet-malibu.jpg'
    },
    {
        id: 'car6', type: 'دفع رباعي', model: 'نيسان باترول 2023', price: '250', location: 'مواقف كلية العلوم',
        lat: 26.3365, lng: 43.7645,
        img: 'https://www.nissan-cdn.net/content/dam/Nissan/middle-east/vehicles/Patrol/Patrol-MY23/overview/2023-Nissan-Patrol-hero-desktop.webp'
    },
    {
        id: 'car7', type: 'اقتصادية', model: 'كيا ريو 2024', price: '65', location: 'مواقف كلية الحاسب',
        lat: 26.3340, lng: 43.7670,
        img: 'https://www.kia.com/content/dam/kw/vehicles/rio/2024/kia_rio_sedan_2024_01_m.jpg'
    },
];

function initMap() {
    const qassimUniversityCoords = [26.345, 43.769]; // مركز جامعة القصيم التقريبي
    const defaultZoom = 14; // مستوى تكبير مناسب لعرض الجامعة

    map = L.map('mapid').setView(qassimUniversityCoords, defaultZoom);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);

    carMarkersLayer = L.layerGroup().addTo(map);
    renderCarsOnMap('الكل');
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

// Setup map filters (already exists, but adding to general DOMContentLoaded)
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
        setInterval(showSlides, 5000);
    }
    
    setupQuiz();

    // Initial render and setup for the car map
    if (document.getElementById('mapid')) {
        initMap();
        setupMapFilters();
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
