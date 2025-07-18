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
// وظيفة إدارة حالة تسجيل الدخول وتحديث أشرطة التنقل
// -------------------------------------

function updateNavbarBasedOnLoginStatus() {
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    const userType = localStorage.getItem('userType');

    // Desktop Navbar elements (top header)
    const desktopNavLinks = document.querySelector('.desktop-nav-links'); // Desktop main links container
    const desktopAuthLinks = desktopNavLinks ? desktopNavLinks.querySelectorAll('.auth-link') : [];
    const desktopGuestButton = document.getElementById('nav-guest-button');
    const desktopUserProfilePlaceholder = document.getElementById('nav-user-profile-placeholder');

    // Mobile Bottom Navbar elements
    const mobileBottomNavGuestButton = document.getElementById('mobile-bottom-guest-button');
    const mobileBottomNavUserButton = document.getElementById('mobile-bottom-user-button');
    const mobileBottomNavAuthLinks = document.querySelectorAll('.mobile-bottom-navbar .auth-link-bottom');

    // Hide all auth related elements first for desktop
    if (desktopGuestButton) desktopGuestButton.style.display = 'none';
    if (desktopUserProfilePlaceholder) desktopUserProfilePlaceholder.style.display = 'none';
    desktopAuthLinks.forEach(link => link.style.display = 'none');
    
    // Hide all auth related elements first for mobile bottom nav
    if (mobileBottomNavGuestButton) mobileBottomNavGuestButton.style.display = 'none';
    if (mobileBottomNavUserButton) mobileBottomNavUserButton.style.display = 'none';
    mobileBottomNavAuthLinks.forEach(link => link.style.display = 'none');


    if (isLoggedIn) {
        // Desktop: Show user profile and relevant auth links
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
        
        desktopAuthLinks.forEach(link => {
            const linkHref = link.getAttribute('href');
            if (userType === 'owner') {
                if (linkHref && (linkHref.includes('dashboard-owner.html') || linkHref.includes('add-car.html'))) {
                    link.style.display = 'block';
                }
            } else if (userType === 'renter') {
                if (linkHref && linkHref.includes('dashboard-renter.html')) {
                    link.style.display = 'block';
                }
            }
        });

        // Mobile Bottom Nav: Show user profile button and specific auth links
        if (mobileBottomNavUserButton) {
            mobileBottomNavUserButton.style.display = 'flex';
            mobileBottomNavUserButton.href = userType === 'owner' ? 'dashboard-owner.html' : 'dashboard-renter.html';
        }
        mobileBottomNavAuthLinks.forEach(link => {
            const linkDataRole = link.getAttribute('data-role');
            if (linkDataRole === userType || linkDataRole === 'all') { // 'all' for links visible to all logged-in users
                link.style.display = 'flex';
            } else {
                link.style.display = 'none';
            }
        });

    } else { // Not logged in
        if (desktopGuestButton) desktopGuestButton.style.display = 'flex';
        if (mobileBottomNavGuestButton) mobileBottomNavGuestButton.style.display = 'flex';
    }
}


function loginUser(type) {
    localStorage.setItem('isLoggedIn', 'true');
    localStorage.setItem('userType', type);
    // يمكنك هنا تخزين اسم مستخدم وهمي لغرض العرض في التعهد
    localStorage.setItem('userName', type === 'owner' ? 'نواف السبيعي' : 'سارة الحربي'); 
    updateNavbarBasedOnLoginStatus();
    // Redirect after updating status
    if (type === 'owner') {
        window.location.href = 'dashboard-owner.html';
    } else if (type === 'renter') {
        window.location.href = 'dashboard-renter.html';
    }
}

function logoutUser() {
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('userType');
    localStorage.removeItem('userName'); // إزالة اسم المستخدم عند الخروج
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
            rewardInfo.textContent = 'تهانينا! تأجيرك المجاني بانتظرك!';
        }
    }
}

// -------------------------------------
// الواجهة الليلية/النهارية (Dark/Light Mode Toggle)
// -------------------------------------

function setupThemeToggle() {
    // الزر الآن هو في الهيدر العلوي فقط ويُستخدم لجميع الشاشات
    const themeToggleBtn = document.getElementById('theme-toggle-desktop'); 

    const applyTheme = (theme) => {
        document.body.classList.remove('light-mode', 'dark-mode');
        document.body.classList.add(theme + '-mode');
        localStorage.setItem('theme', theme);

        if (themeToggleBtn) {
            // Check screen width to decide between icon only or icon with text
            if (window.innerWidth <= 992) { // Mobile view
                themeToggleBtn.innerHTML = theme === 'light' ? '<i class="fas fa-moon"></i><span>الوضع الليلي</span>' : '<i class="fas fa-sun"></i><span>الوضع النهاري</span>';
            } else { // Desktop view
                themeToggleBtn.innerHTML = theme === 'light' ? '<i class="fas fa-moon"></i>' : '<i class="fas fa-sun"></i>';
            }
        }
    };

    const currentTheme = localStorage.getItem('theme') || 'light';
    applyTheme(currentTheme); // Apply theme on load

    if (themeToggleBtn) {
        themeToggleBtn.addEventListener('click', () => {
            const newTheme = document.body.classList.contains('light-mode') ? 'dark' : 'light';
            applyTheme(newTheme);
        });

        // Re-apply theme on resize to switch between icon/text dynamically
        window.addEventListener('resize', () => applyTheme(localStorage.getItem('theme') || 'light'));
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

// هذا هو الجزء الذي تم تعديله في دالة renderCarsOnMap
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
                <a href="cars.html?carId=${car.id}" class="btn btn-primary">احجز الآن</a>
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
// وظائف المسؤولية الاجتماعية المُضافة (AI-Generated Content & Logic)
// -------------------------------------

function displayRandomCsrFact() {
    const csrFactElement = document.getElementById('csr-fact-display');
    if (csrFactElement && typeof csrFacts !== 'undefined' && csrFacts.length > 0) {
        const randomIndex = Math.floor(Math.random() * csrFacts.length);
        csrFactElement.textContent = csrFacts[randomIndex].text;
    }
}

function setupPledgeGenerator() {
    const pledgeForm = document.getElementById('pledge-form');
    const pledgeResultDiv = document.getElementById('pledge-result'); // Ensure this is the correct ID for the result display
    const userName = localStorage.getItem('userName') || 'صديقنا';

    if (pledgeForm && pledgeResultDiv && typeof pledgeOptions !== 'undefined') {
        // Populate pledge options
        const pledgeOptionsContainer = pledgeForm.querySelector('.quiz-options'); // Ensure this selects the correct container within the pledge form
        if (pledgeOptionsContainer) {
            pledgeOptionsContainer.innerHTML = ''; // Clear existing options
            pledgeOptions.forEach(option => {
                const label = document.createElement('label');
                label.innerHTML = `<input type="radio" name="pledge-type" value="${option.id}"> ${option.text}`;
                pledgeOptionsContainer.appendChild(label);
            });
        }

        pledgeForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const selectedPledgeId = pledgeForm.querySelector('input[name="pledge-type"]:checked')?.value;

            if (selectedPledgeId) {
                const selectedPledge = pledgeOptions.find(p => p.id === selectedPledgeId);
                if (selectedPledge) {
                    const thankYouMessage = selectedPledge.thankYou.replace('[اسم_المستخدم]', userName);
                    pledgeResultDiv.innerHTML = `
                        <h3>شكرًا لالتزامك!</h3>
                        <p>${thankYouMessage}</p>
                        <button class="btn btn-secondary" onclick="window.location.reload()">تعهد آخر</button>
                    `;
                    pledgeResultDiv.style.display = 'block';
                    pledgeForm.style.display = 'none'; // Hide form after submission
                }
            } else {
                pledgeResultDiv.innerHTML = `<p style="color:var(--text-color-light);">الرجاء اختيار تعهد أولاً للمتابعة.</p>`;
                pledgeResultDiv.style.display = 'block';
            }
        });
    }
}


function renderImpactDashboard() {
    const impactContainer = document.getElementById('impact-stats-container');
    if (impactContainer && typeof impactStats !== 'undefined' && impactStats.length > 0) {
        impactContainer.innerHTML = ''; 
        impactStats.forEach(stat => {
            const statCard = document.createElement('div');
            statCard.classList.add('stat-card'); // إعادة استخدام فئة stat-card الموجودة
            statCard.innerHTML = `
                <h3>${stat.label}</h3>
                <div class="value">${stat.value}${stat.unit}</div>
                <p class="story" style="font-size:0.95rem; color: var(--gray); margin-top:10px;">${stat.story}</p>
            `;
            impactContainer.appendChild(statCard);
        });
    }
}


// -------------------------------------
// عند تحميل المحتوى (DOMContentLoaded)
// -------------------------------------

document.addEventListener('DOMContentLoaded', () => {
    setupThemeToggle();
    updateNavbarBasedOnLoginStatus();

    // Specific logic for mobile bottom navbar's active state
    const bottomNavItems = document.querySelectorAll('.mobile-bottom-navbar .nav-item');
    bottomNavItems.forEach(item => {
        // Remove active class from all items first
        item.classList.remove('active');
        // Add active class if href matches current page path
        // Use pathname for comparison to ignore host/protocol
        const currentPath = window.location.pathname.substring(window.location.pathname.lastIndexOf('/') + 1);
        const itemHref = item.getAttribute('href');

        if (itemHref === currentPath) {
            item.classList.add('active');
        }
        // Handle index.html special case for root path
        if (itemHref === 'index.html' && (currentPath === '' || currentPath === 'index.html')) {
            item.classList.add('active');
        }
    });

    // Adjust body padding-bottom based on mobile bottom navbar presence
    function adjustBodyPadding() {
        const mobileBottomNavbar = document.querySelector('.mobile-bottom-navbar');
        if (mobileBottomNavbar && window.innerWidth <= 992) { // Only for mobile view
            document.body.style.paddingBottom = mobileBottomNavbar.offsetHeight + 'px';
        } else {
            document.body.style.paddingBottom = '0';
        }
    }

    adjustBodyPadding(); // Call on load
    window.addEventListener('resize', adjustBodyPadding); // Call on resize


    const userCompletedRentals = 3;
    updateLoyaltyCard(userCompletedRentals);

    renderRecentlyViewedCars();

    if (document.querySelector('.testimonial-slider')) {
        showSlides();
        slideInterval = setInterval(showSlides, 5000);
    }
    
    setupQuiz();

    // CSR Features Initialization
    // تأكد من وجود العناصر في الصفحة قبل استدعاء الوظيفة
    if (document.getElementById('csr-fact-display')) {
        displayRandomCsrFact(); 
    }
    if (document.getElementById('pledge-form')) {
        setupPledgeGenerator(); 
    }
    if (document.getElementById('impact-stats-container')) {
        renderImpactDashboard(); 
    }

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

document.addEventListener('click', (e) => {
    if (e.target.closest('.car-card')) {
        const carCard = e.target.closest('.car-card');
        const carImg = carCard.querySelector('.car-img img').src;
        const carTitle = carCard.querySelector('.car-title').textContent;
        const carId = carTitle.replace(/\s/g, '-');

        addCarToRecentlyViewed(carId, carImg, carTitle);
    }
});
