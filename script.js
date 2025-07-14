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
    const userType = localStorage.getItem('userType'); // 'owner' or 'renter'

    const authLinks = document.querySelectorAll('.nav-links .auth-link');
    const ownerDashboardLink = document.getElementById('nav-owner-dashboard');
    const renterDashboardLink = document.getElementById('nav-renter-dashboard');
    const addCarLink = document.getElementById('nav-add-car');

    const guestButton = document.getElementById('nav-guest-button');
    const userProfilePlaceholder = document.getElementById('nav-user-profile-placeholder'); // عنصر جديد

    if (isLoggedIn) {
        if (guestButton) guestButton.style.display = 'none';
        if (userProfilePlaceholder) { // عرض placeholder للملف الشخصي وزر الخروج
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

        authLinks.forEach(link => link.style.display = 'none'); // إخفاء كل روابط لوحة التحكم أولاً

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

    // Check saved preference or default to light
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
const MAX_RECENTLY_VIEWED = 5; // عدد السيارات التي تظهر في الشريط

function addCarToRecentlyViewed(carId, carImg, carTitle) {
    let recentlyViewed = JSON.parse(localStorage.getItem(RECENTLY_VIEWED_KEY)) || [];

    // إزالة السيارة إذا كانت موجودة بالفعل (لنقلها للأعلى)
    recentlyViewed = recentlyViewed.filter(car => car.id !== carId);

    // إضافة السيارة الجديدة في البداية
    recentlyViewed.unshift({ id: carId, img: carImg, title: carTitle });

    // قص القائمة لـ Max_RECENTLY_VIEWED
    if (recentlyViewed.length > MAX_RECENTLY_VIEWED) {
        recentlyViewed = recentlyViewed.slice(0, MAX_RECENTLY_VIEWED);
    }

    localStorage.setItem(RECENTLY_VIEWED_KEY, JSON.stringify(recentlyViewed));
    renderRecentlyViewedCars(); // إعادة رسم الشريط بعد التحديث
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
                carLink.href = '#'; // هنا يمكنك وضع رابط لصفحة تفاصيل السيارة الحقيقية
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

    // Hide all slides and remove active class from dots
    slides.forEach(slide => slide.style.display = 'none');
    dots.forEach(dot => dot.classList.remove('active'));

    // Move to next slide
    slideIndex++;
    if (slideIndex > slides.length) {
        slideIndex = 1;
    }

    // Display current slide and add active class to current dot
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
// عند تحميل المحتوى (DOMContentLoaded)
// -------------------------------------

document.addEventListener('DOMContentLoaded', () => {
    setupThemeToggle(); // إعداد تبديل الثيم
    updateNavbarBasedOnLoginStatus(); // تحديث حالة الـ Navbar

    // هذا رقم افتراضي، سيتغير ليأتي من بيانات المستخدم الفعلية من الخادم
    const userCompletedRentals = 3; // مثال: المستخدم أتم 3 حجوزات
    updateLoyaltyCard(userCompletedRentals); // تحديث بطاقة الولاء أيضاً

    renderRecentlyViewedCars(); // عرض شريط آخر مشاهدة للسيارات

    // تشغيل السلايدر كل 5 ثوانٍ
    if (document.querySelector('.testimonial-slider')) {
        showSlides(); // Display initial slide
        setInterval(showSlides, 5000);
    }
    
    setupQuiz(); // إعداد وظيفة الاختبار
});

// For demonstration purposes: Simulate adding cars to recently viewed
// In a real app, this would happen when a user views a car's detail page.
document.addEventListener('click', (e) => {
    if (e.target.closest('.car-card')) {
        const carCard = e.target.closest('.car-card');
        const carImg = carCard.querySelector('.car-img img').src;
        const carTitle = carCard.querySelector('.car-title').textContent;
        const carId = carTitle.replace(/\s/g, '-'); // Simple ID for demo

        addCarToRecentlyViewed(carId, carImg, carTitle);
    }
});
