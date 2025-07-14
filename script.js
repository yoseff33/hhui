// تنشيط فلتر السيارات (سيستخدم في صفحة السيارات)
document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', function() {
        // تأكد من وجود زر active قبل محاولة إزالته
        const currentActive = document.querySelector('.filter-btn.active');
        if (currentActive) {
            currentActive.classList.remove('active');
        }
        this.classList.add('active');
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
        // e.preventDefault(); // لا تستخدم هذه إذا كنت تريد الانتقال لصفحات مختلفة

        // إزالة "active" من كل الروابط في القائمة الجانبية
        const currentActive = document.querySelector('.sidebar-menu a.active');
        if (currentActive) {
            currentActive.classList.remove('active');
        }
        // إضافة "active" للرابط الذي تم النقر عليه
        this.classList.add('active');
    });
});

// -------------------------------------
// وظيفة تحديث بطاقة الولاء (Loyalty Card)
// -------------------------------------

// هذه الوظيفة ستكون مبدئية، وفي نظام حقيقي ستأخذ البيانات من الخادم
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
        dot.textContent = index + 1; // ترقيم النقاط من 1 إلى 8
    });

    if (currentRentalsText) {
        currentRentalsText.textContent = completedRentals;
    }
    if (remainingRentalsText) {
        remainingRentalsText.textContent = totalRentalsNeeded - completedRentals;
    }

    // إذا تم إكمال جميع الحجوزات
    if (completedRentals >= totalRentalsNeeded) {
        if (remainingRentalsText) {
            remainingRentalsText.textContent = '0';
        }
        const rewardInfo = document.querySelector('.loyalty-reward-info small');
        if (rewardInfo) {
            rewardInfo.textContent = 'تهانينا! تأجيرك المجاني بانتظارك!';
        }
        // يمكنك هنا عرض زر "استخدم المكافأة" مثلاً
    }
}

// استدعاء وظيفة تحديث البطاقة عند تحميل الصفحة التي تحتوي على بطاقة الولاء.
// في النظام الحقيقي، ستقوم بجلب "completedRentals" من قاعدة بيانات المستخدم.
document.addEventListener('DOMContentLoaded', () => {
    // هذا رقم افتراضي، سيتغير ليأتي من بيانات المستخدم الفعلية من الخادم
    const userCompletedRentals = 3; // مثال: المستخدم أتم 3 حجوزات
    updateLoyaltyCard(userCompletedRentals);
});
