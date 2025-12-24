// ============================================
// LER Telecom - Complete JavaScript File (Tabby Limit Fixed)
// ============================================

// Initialize AOS (Animate On Scroll)
function initializeAOS() {
    if (typeof AOS !== 'undefined') {
        AOS.init({
            duration: 800,
            once: true,
            offset: 100
        });
    }
}

// ============================================
// BUSINESS LOGIC CONFIGURATION
// ============================================

// نسبة الربح الثابتة (65%)
const PROFIT_PERCENTAGE = 0.65; 

// نسبة السيولة (الكاش) من قيمة الجهاز
const CASH_LIQUIDITY_RATIO = 0.56; 

const WHATSAPP_NUMBER = "966533774766";

// تم تعديل الحدود حسب نظام تابي
const MIN_AMOUNT = 100;
const MAX_AMOUNT = 5000;

// State Management
let financingState = {
    fullName: '',
    mobileNumber: '',
    amount: 2500, // مبلغ افتراضي ضمن حدود تابي
    duration: 12,
    interestRate: PROFIT_PERCENTAGE,
    noDownPayment: false,
    valid: false
};

// DOM Elements
const elements = {
    form: null,
    fullNameInput: null,
    mobileInput: null,
    amountInput: null,
    durationButtons: null,
    downpaymentToggle: null,
    monthlyInstallment: null,
    netCash: null,
    breakdownAmount: null,
    breakdownRate: null,
    breakdownInterest: null,
    breakdownTotal: null,
    breakdownLiquidity: null,
    downpaymentStatus: null,
    downpaymentAmount: null,
    whatsappSubmit: null
};

// ============================================
// MAIN INITIALIZATION
// ============================================

document.addEventListener('DOMContentLoaded', function() {
    // Initialize animations
    initializeAOS();
    
    // Check if we're on the main page or blog
    if (document.getElementById('calculator-section')) {
        initializeCalculator();
    }
    
    if (document.querySelector('.article-container')) {
        initializeBlog();
    }
    
    // Initialize common functionality
    initializeCommon();

    // Initialize Quara Modal Events (ESC key)
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') closeQuaraModal();
    });
});

// ============================================
// CALCULATOR FUNCTIONALITY
// ============================================

function initializeCalculator() {
    initializeElements();
    cleanButtonLabels(); // إخفاء النسب القديمة
    setupEventListeners();
    
    // تحديث حقول الإدخال لتتناسب مع الحدود الجديدة
    if(elements.amountInput) {
        elements.amountInput.min = MIN_AMOUNT;
        elements.amountInput.max = MAX_AMOUNT;
        elements.amountInput.value = financingState.amount;
    }
    
    calculateFinancing();
    validateForm();
    initializeCounters();
}

function cleanButtonLabels() {
    // إخفاء الـ badges القديمة التي تحتوي على نسب متغيرة
    const badges = document.querySelectorAll('.rate-badge');
    badges.forEach(badge => {
        badge.style.display = 'none';
    });
}

function initializeElements() {
    elements.form = document.getElementById('financingForm');
    elements.fullNameInput = document.getElementById('fullName');
    elements.mobileInput = document.getElementById('mobileNumber');
    elements.amountInput = document.getElementById('amountInput');
    elements.durationButtons = document.querySelectorAll('.duration-btn');
    elements.downpaymentToggle = document.getElementById('downpaymentToggle');
    elements.monthlyInstallment = document.getElementById('monthlyInstallment');
    elements.netCash = document.getElementById('netCash');
    elements.breakdownAmount = document.getElementById('breakdownAmount');
    elements.breakdownRate = document.getElementById('breakdownRate');
    elements.breakdownInterest = document.getElementById('breakdownInterest');
    elements.breakdownTotal = document.getElementById('breakdownTotal');
    elements.breakdownLiquidity = document.getElementById('breakdownLiquidity');
    elements.downpaymentStatus = document.getElementById('downpaymentStatus');
    elements.downpaymentAmount = document.getElementById('downpaymentAmount');
    elements.whatsappSubmit = document.getElementById('whatsappSubmit');
}

function setupEventListeners() {
    // Form Inputs
    if (elements.fullNameInput) {
        elements.fullNameInput.addEventListener('input', function() {
            financingState.fullName = this.value.trim();
            validateName();
            validateForm();
        });
        elements.fullNameInput.addEventListener('blur', validateName);
    }
    
    if (elements.mobileInput) {
        elements.mobileInput.addEventListener('input', function() {
            financingState.mobileNumber = this.value.trim();
            validateMobile();
            validateForm();
        });
        elements.mobileInput.addEventListener('blur', validateMobile);
    }
    
    if (elements.amountInput) {
        elements.amountInput.addEventListener('input', function() {
            let value = parseInt(this.value) || 0;
            
            // التحقق الفوري من الحدود
            if (value > MAX_AMOUNT) {
                // تنبيه المستخدم بطريقة لطيفة (اختياري) أو مجرد تحديث الحالة للتحقق لاحقاً
            }
            
            financingState.amount = value;
            calculateFinancing();
            validateForm();
        });
    }
    
    // Duration Buttons
    if (elements.durationButtons) {
        elements.durationButtons.forEach(button => {
            button.addEventListener('click', function() {
                const months = parseInt(this.getAttribute('data-months'));
                setDuration(months, button);
            });
        });
    }
    
    // Down Payment Toggle
    if (elements.downpaymentToggle) {
        elements.downpaymentToggle.addEventListener('change', function() {
            financingState.noDownPayment = this.checked;
            calculateFinancing();
        });
    }
    
    // WhatsApp Submit Button
    if (elements.whatsappSubmit) {
        elements.whatsappSubmit.addEventListener('click', submitToWhatsApp);
    }
}

function setDuration(months, button) {
    financingState.duration = months;
    
    // Update UI
    elements.durationButtons.forEach(btn => {
        btn.classList.remove('active');
        btn.setAttribute('aria-pressed', 'false');
    });
    
    button.classList.add('active');
    button.setAttribute('aria-pressed', 'true');
    
    // Update breakdown rate display to Fixed 65%
    if (elements.breakdownRate) {
        const label = elements.breakdownRate.parentElement.querySelector('span:first-child');
        if (label) {
            label.innerHTML = `نسبة الأرباح (<span id="breakdownRate">65%</span>):`;
        } else {
            elements.breakdownRate.textContent = '65%';
        }
    }
    
    calculateFinancing();
}

// -------------------------------------------------------------
// المعادلة الجديدة: (المبلغ المطلوب + 65%)
// -------------------------------------------------------------
function calculateFinancing() {
    // بما أننا حددنا الحد الأقصى 5000، فالمقصود هنا هو مبلغ "التمويل" (قيمة الجهاز)
    // وليس الكاش الصافي، لأن تابي حده 5000 كقيمة شرائية.
    // إذا العميل حط 5000، يعني يبي يشتري جهاز بـ 5000.
    
    let productPrice = financingState.amount;
    
    // التأكد من الحدود
    if (productPrice > MAX_AMOUNT) productPrice = MAX_AMOUNT;
    if (productPrice < MIN_AMOUNT) productPrice = MIN_AMOUNT;

    const duration = financingState.duration;
    const interestRate = PROFIT_PERCENTAGE; // 0.65
    const noDownPayment = financingState.noDownPayment;
    
    // 1. حساب الفائدة (65%) على قيمة الجهاز
    const profitAmount = productPrice * interestRate;
    const totalAmount = productPrice + profitAmount;
    
    // 2. القسط الشهري
    const monthlyInstallment = totalAmount / duration;
    
    // 3. صافي الكاش (السيولة)
    // المعادلة: قيمة الجهاز * 0.56
    const baseCashLiquidity = productPrice * CASH_LIQUIDITY_RATIO;
    
    // 4. خصم الدفعة الأولى
    let netCash = baseCashLiquidity;
    let downpaymentStatus = "✅ الدفعة الأولى: تدفعها أنت";
    let downpaymentAmount = 0;
    
    if (noDownPayment) {
        netCash = baseCashLiquidity - monthlyInstallment;
        downpaymentStatus = "✅ الدفعة الأولى: خصمناها من الكاش";
        downpaymentAmount = monthlyInstallment;
    }
    
    // Ensure net cash is not negative
    netCash = Math.max(netCash, 0);
    
    // Update UI
    updateUI({
        monthlyInstallment,
        netCash,
        amount: productPrice,
        profitAmount,
        totalAmount,
        downpaymentStatus,
        downpaymentAmount,
        noDownPayment
    });
}

function updateUI(data) {
    const formatter = new Intl.NumberFormat('ar-SA', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    });
    
    const wholeFormatter = new Intl.NumberFormat('ar-SA');
    
    // Monthly Installment
    if (elements.monthlyInstallment) {
        elements.monthlyInstallment.textContent = formatter.format(data.monthlyInstallment);
    }
    
    // Net Cash
    if (elements.netCash) {
        elements.netCash.textContent = formatter.format(data.netCash);
    }
    
    // Breakdown
    if (elements.breakdownAmount) {
        const label = elements.breakdownAmount.parentElement.querySelector('span:first-child');
        if(label) label.textContent = "قيمة السلعة (الحد 5000):";
        elements.breakdownAmount.textContent = `${wholeFormatter.format(data.amount)} ر.س`;
    }
    
    if (elements.breakdownInterest) {
        elements.breakdownInterest.textContent = `+${wholeFormatter.format(data.profitAmount)} ر.س`;
    }
    
    if (elements.breakdownTotal) {
        elements.breakdownTotal.textContent = `${wholeFormatter.format(data.totalAmount)} ر.س`;
    }
    
    // إخفاء سطر نسبة السيولة القديم
    if (elements.breakdownLiquidity) {
        const liItem = elements.breakdownLiquidity.parentElement;
        if(liItem) liItem.style.display = 'none'; 
    }
    
    if (elements.downpaymentStatus) {
        elements.downpaymentStatus.textContent = data.downpaymentStatus;
    }
    
    if (elements.downpaymentAmount) {
        if (data.noDownPayment) {
            elements.downpaymentAmount.textContent = `-${wholeFormatter.format(data.downpaymentAmount)} ر.س`;
            elements.downpaymentAmount.style.color = '#ef4444';
        } else {
            elements.downpaymentAmount.textContent = `-0 ر.س`;
            elements.downpaymentAmount.style.color = '#9ca3af';
        }
    }
}

// ============================================
// VALIDATION FUNCTIONS
// ============================================

function validateName() {
    const name = financingState.fullName;
    const input = elements.fullNameInput;
    if (!input) return false;
    
    input.classList.remove('valid', 'invalid');
    
    if (!name || name.split(/\s+/).length < 2) {
        showValidationMessage(input, 'الاسم الكامل مطلوب', false);
        return false;
    }
    
    showValidationMessage(input, '✅ الاسم صالح', true);
    return true;
}

function validateMobile() {
    const mobile = financingState.mobileNumber;
    const input = elements.mobileInput;
    if (!input) return false;
    
    input.classList.remove('valid', 'invalid');
    const saudiMobileRegex = /^05[0-9]{8}$/;
    
    if (!saudiMobileRegex.test(mobile)) {
        showValidationMessage(input, 'رقم غير صالح. يجب أن يبدأ بـ 05', false);
        return false;
    }
    
    showValidationMessage(input, '✅ رقم الجوال صالح', true);
    return true;
}

function validateAmount() {
    const amount = financingState.amount;
    // التحقق الصارم من الحدود (100 - 5000)
    return amount >= MIN_AMOUNT && amount <= MAX_AMOUNT;
}

function validateForm() {
    const isNameValid = validateName();
    const isMobileValid = validateMobile();
    const isAmountValid = validateAmount();
    
    financingState.valid = isNameValid && isMobileValid && isAmountValid;
    
    if (elements.whatsappSubmit) {
        if (financingState.valid) {
            elements.whatsappSubmit.disabled = false;
            elements.whatsappSubmit.removeAttribute('title');
        } else {
            elements.whatsappSubmit.disabled = true;
            // إضافة رسالة توضيحية للزر
            if (!isAmountValid) {
                elements.whatsappSubmit.title = `المبلغ يجب أن يكون بين ${MIN_AMOUNT} و ${MAX_AMOUNT} ريال`;
            }
        }
    }
    
    return financingState.valid;
}

function showValidationMessage(input, message, isValid) {
    const existingMessage = input.parentNode.querySelector('.validation-message');
    if (existingMessage) existingMessage.remove();
    
    input.classList.add(isValid ? 'valid' : 'invalid');
    const messageEl = document.createElement('div');
    messageEl.className = `validation-message ${isValid ? 'valid' : 'invalid'}`;
    messageEl.textContent = message;
    
    const icon = document.createElement('i');
    icon.className = isValid ? 'fas fa-check-circle mr-1' : 'fas fa-exclamation-circle mr-1';
    messageEl.prepend(icon);
    
    input.parentNode.appendChild(messageEl);
}

// ============================================
// WHATSAPP INTEGRATION (Calculator)
// ============================================

function submitToWhatsApp() {
    if (!validateForm()) {
        const amount = financingState.amount;
        if (amount < MIN_AMOUNT || amount > MAX_AMOUNT) {
            alert(`عذراً، تمويل تابي متاح فقط من ${MIN_AMOUNT} إلى ${MAX_AMOUNT} ريال`);
        } else {
            alert('الرجاء إكمال جميع الحقول المطلوبة');
        }
        return;
    }
    
    // إعداد البيانات
    const productPrice = financingState.amount;
    const duration = financingState.duration;
    const profitAmount = productPrice * PROFIT_PERCENTAGE;
    const totalAmount = productPrice + profitAmount;
    const monthlyInstallment = totalAmount / duration;
    
    const baseCashLiquidity = productPrice * CASH_LIQUIDITY_RATIO;
    const netCash = financingState.noDownPayment 
        ? Math.max(baseCashLiquidity - monthlyInstallment, 0)
        : baseCashLiquidity;
    
    const formatter = new Intl.NumberFormat('ar-SA', { maximumFractionDigits: 0 });
    
    const message = `السلام عليكم، أرغب بطلب تمويل تابي من لير للاتصالات 📱
--------------------------------
👤 بيانات العميل:
الاسم: ${financingState.fullName}
الجوال: ${financingState.mobileNumber}
--------------------------------
💰 تفاصيل الطلب:
قيمة السلعة (التمويل): ${formatter.format(productPrice)} ريال
صافي الكاش المتوقع: ${formatter.format(netCash)} ريال
المدة: ${duration} أشهر
القسط الشهري: ${formatter.format(monthlyInstallment)} ريال
إجمالي المديونية: ${formatter.format(totalAmount)} ريال
--------------------------------
ℹ️ ملاحظات الدفع:
${financingState.noDownPayment ? 'بدون دفعة أولى (مخصومة من الكاش)' : 'مع دفعة أولى'}
--------------------------------
✅ أقر بصحة البيانات والموافقة على الشروط.`;
    
    const whatsappURL = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
    
    // Loading State
    const originalHTML = elements.whatsappSubmit.innerHTML;
    elements.whatsappSubmit.innerHTML = '<i class="fas fa-spinner fa-spin"></i> جاري التحضير...';
    elements.whatsappSubmit.disabled = true;
    
    setTimeout(() => {
        window.open(whatsappURL, '_blank');
        setTimeout(() => {
            elements.whatsappSubmit.innerHTML = originalHTML;
            elements.whatsappSubmit.disabled = false;
            trackConversion();
        }, 1500);
    }, 800);
}

// ============================================
// BLOG FUNCTIONALITY
// ============================================

function initializeBlog() {
    // Add animation to timeline items
    const timelineItems = document.querySelectorAll('.timeline-item');
    timelineItems.forEach((item, index) => {
        item.style.opacity = '0';
        item.style.transform = 'translateX(-20px)';
        
        setTimeout(() => {
            item.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
            item.style.opacity = '1';
            item.style.transform = 'translateX(0)';
        }, index * 200);
    });
    
    // Add hover effect to problem cards
    const problemCards = document.querySelectorAll('.problem-card');
    problemCards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            card.style.transform = 'translateY(-5px)';
            card.style.boxShadow = '0 10px 20px rgba(239, 68, 68, 0.2)';
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'translateY(0)';
            card.style.boxShadow = 'none';
        });
    });
    
    // Track blog reading progress
    trackReadingProgress();
    
    // Calculate read time
    calculateReadTime();
}

function trackReadingProgress() {
    if (typeof localStorage !== 'undefined') {
        const articleId = 'blog-cash-in-hafar';
        const readKey = `read_${articleId}`;
        
        window.addEventListener('scroll', function() {
            const scrollPercentage = (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100;
            
            if (scrollPercentage > 75 && !localStorage.getItem(readKey)) {
                localStorage.setItem(readKey, 'true');
                console.log('Article marked as read:', articleId);
            }
        });
    }
}

function calculateReadTime() {
    const articleText = document.querySelector('.article-container')?.innerText || '';
    const wordCount = articleText.split(/\s+/).length;
    const readingTime = Math.ceil(wordCount / 200); 
    
    const timeElement = document.querySelector('.article-meta span:nth-child(2)');
    if (timeElement && readingTime > 0) {
        timeElement.innerHTML = `<i class="far fa-clock"></i> ⏱ ${readingTime} دقائق قراءة`;
    }
}

// ============================================
// COMMON FUNCTIONALITY & MODALS
// ============================================

function initializeCommon() {
    // Accordion Logic
    document.querySelectorAll('.accordion-btn').forEach(button => {
        button.addEventListener('click', function() {
            const content = this.nextElementSibling;
            const icon = this.querySelector('i');
            this.setAttribute('aria-expanded', this.getAttribute('aria-expanded') === 'true' ? 'false' : 'true');
            content.classList.toggle('hidden');
            if (icon) icon.classList.toggle('rotate-180');
        });
    });
    
    // Setup Scroll Links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href.includes('http') || href === '#') return;
            e.preventDefault();
            const targetElement = document.querySelector(href);
            if (targetElement) {
                targetElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });

    // Setup Device Selection
    document.querySelectorAll('.device-btn').forEach(button => {
        button.addEventListener('click', function() {
            const deviceName = this.parentElement.querySelector('.device-name').textContent;
            selectDevice(deviceName);
        });
    });

    // Add Back to Top
    addBackToTopButton();
    setupKeyboardShortcuts();
    setupPrintStyles();
    setupPerformanceMonitoring();
}

// Quara Modal Logic
function selectDevice(deviceName) {
    const modal = document.getElementById('quaraModal');
    const deviceNameField = document.getElementById('selectedDeviceName');
    const hiddenDeviceField = document.getElementById('deviceName');
    
    if(deviceNameField) deviceNameField.textContent = deviceName;
    if(hiddenDeviceField) hiddenDeviceField.value = deviceName;
    
    if(modal) {
        modal.classList.remove('hidden');
        document.body.classList.add('overflow-hidden');
    }
    setTimeout(() => {
        const nameInput = document.getElementById('quaraFullName');
        if(nameInput) nameInput.focus();
    }, 300);
}

function closeQuaraModal() {
    const modal = document.getElementById('quaraModal');
    if(modal) {
        modal.classList.add('hidden');
        document.body.classList.remove('overflow-hidden');
    }
    const form = document.getElementById('quaraForm');
    if(form) form.reset();
}

function submitQuaraForm() {
    const form = document.getElementById('quaraForm');
    if (!form.checkValidity()) {
        form.reportValidity();
        return;
    }
    
    const data = {
        device: document.getElementById('deviceName').value,
        name: document.getElementById('quaraFullName').value,
        mobile: document.getElementById('quaraMobile').value,
        salary: document.getElementById('quaraSalary').value,
        sector: document.getElementById('quaraSector').value,
        city: document.getElementById('quaraCity').value,
        commitments: document.getElementById('quaraCommitments').value || 'لا يوجد'
    };
    
    const msg = `السلام عليكم، أرغب بتقديم طلب تمويل كوارا:
📱 الجهاز: ${data.device}
👤 الاسم: ${data.name}
📞 الجوال: ${data.mobile}
💰 الراتب: ${data.salary} ريال
🏢 الوظيفة: ${data.sector}
📍 المدينة: ${data.city}
💳 التزامات: ${data.commitments}`.trim();
    
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`, '_blank');
    closeQuaraModal();
}

function initializeCounters() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounter(entry.target);
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });
    
    document.querySelectorAll('.counter').forEach(counter => {
        observer.observe(counter);
    });
}

function animateCounter(el) {
    const target = parseInt(el.getAttribute('data-target'));
    const duration = 2000;
    const step = target / (duration / 16);
    let current = 0;
    
    const timer = setInterval(() => {
        current += step;
        if (current >= target) {
            current = target;
            clearInterval(timer);
            el.innerText = target + "+";
        } else {
            el.innerText = Math.floor(current);
        }
    }, 16);
}

function addBackToTopButton() {
    const btn = document.createElement('button');
    btn.innerHTML = '<i class="fas fa-arrow-up"></i>';
    btn.className = 'back-to-top';
    btn.style.cssText = `position: fixed; bottom: 80px; right: 20px; width: 50px; height: 50px; background-color: #3AB54A; color: white; border: none; border-radius: 50%; font-size: 20px; cursor: pointer; opacity: 0; transition: all 0.3s; z-index: 1000; box-shadow: 0 4px 12px rgba(58, 181, 74, 0.3); display: none;`;
    document.body.appendChild(btn);
    
    btn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
    
    window.addEventListener('scroll', () => {
        if (window.pageYOffset > 300) {
            btn.style.display = 'flex';
            setTimeout(() => { btn.style.opacity = '1'; btn.style.transform = 'translateY(0)'; }, 10);
        } else {
            btn.style.opacity = '0';
            btn.style.transform = 'translateY(10px)';
            setTimeout(() => btn.style.display = 'none', 300);
        }
    });
}

function setupKeyboardShortcuts() {
    document.addEventListener('keydown', function(e) {
        if (e.ctrlKey && e.key === 'Enter' && financingState.valid && elements.whatsappSubmit) {
            submitToWhatsApp();
        }
        if (e.key === 'Escape') {
             const modal = document.getElementById('quaraModal');
             if(modal && !modal.classList.contains('hidden')) {
                 closeQuaraModal();
                 return;
             }
            if (elements.form && confirm('هل تريد إعادة تعيين النموذج؟')) resetForm();
        }
        if (e.ctrlKey && e.key === '/' && elements.amountInput) {
            e.preventDefault();
            elements.amountInput.focus();
            elements.amountInput.select();
        }
    });
}

function resetForm() {
    if (elements.form) elements.form.reset();
    financingState = {
        fullName: '',
        mobileNumber: '',
        amount: 2500, // Reset to default compliant amount
        duration: 12,
        interestRate: PROFIT_PERCENTAGE,
        noDownPayment: false,
        valid: false
    };
    if (elements.amountInput) elements.amountInput.value = 2500;
    if (elements.downpaymentToggle) elements.downpaymentToggle.checked = false;
    calculateFinancing();
    validateForm();
}

function setupPrintStyles() {
    const printStyles = `@media print { .whatsapp-float, .alert-banner, .nav-buttons, .duration-btn, .whatsapp-cta-btn, .direct-whatsapp-btn, .toggle-switch, .back-to-top, #quaraModal { display: none !important; } body { background-color: white !important; color: black !important; } .calculator-card, .benefits-sidebar { border: 1px solid #ccc !important; box-shadow: none !important; } }`;
    const styleSheet = document.createElement("style");
    styleSheet.type = "text/css";
    styleSheet.textContent = printStyles;
    document.head.appendChild(styleSheet);
}

function setupPerformanceMonitoring() {
    if (window.performance) {
        window.addEventListener('load', function() {
            const perfData = window.performance.timing;
            const loadTime = perfData.loadEventEnd - perfData.navigationStart;
            if (loadTime > 3000) console.warn('Page load time is high:', loadTime + 'ms');
        });
    }
}

// ============================================
// ANALYTICS & TRACKING
// ============================================

function trackConversion() {
    const conversions = parseInt(localStorage.getItem('ler_conversions') || '0');
    localStorage.setItem('ler_conversions', (conversions + 1).toString());
    const sessionConversions = parseInt(sessionStorage.getItem('ler_session_conversions') || '0');
    sessionStorage.setItem('ler_session_conversions', (sessionConversions + 1).toString());
    console.log('Conversion tracked');
}

// ============================================
// PWA SUPPORT & ERROR HANDLING
// ============================================

window.addEventListener('error', function(e) {
    console.error('JS Error:', e.message, 'at', e.filename, 'line', e.lineno);
});

if ('serviceWorker' in navigator) {
    window.addEventListener('load', function() {
        navigator.serviceWorker.register('/sw.js').catch(err => console.log('SW failed:', err));
    });
}

let deferredPrompt;
window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPrompt = e;
});

// ============================================
// UTILITY FUNCTIONS
// ============================================

function formatCurrency(amount) {
    return new Intl.NumberFormat('ar-SA', {
        style: 'currency',
        currency: 'SAR',
        minimumFractionDigits: 0
    }).format(amount);
}

function shareArticle() {
    const url = window.location.href;
    if (navigator.share) {
        navigator.share({ title: document.title, url: url });
    } else {
        navigator.clipboard.writeText(url).then(() => alert('تم نسخ الرابط!'));
    }
}

function printArticle() {
    const content = document.querySelector('.article-container')?.innerHTML;
    const original = document.body.innerHTML;
    document.body.innerHTML = `<div dir="rtl" style="padding:20px;font-family:'Tajawal'">${content}</div>`;
    window.print();
    document.body.innerHTML = original;
    location.reload();
}

function scrollToSection(id) {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
}
