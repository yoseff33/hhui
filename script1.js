// ============================================
// LER Telecom - Complete JavaScript File
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

// Business Logic Constants
const INTEREST_RATES = {
    4: 0.05,   // 5%
    6: 0.08,   // 8%
    8: 0.12,   // 12%
    12: 0.17   // 17%
};

const CASH_LIQUIDITY_RATIO = 0.56; // 56%
const WHATSAPP_NUMBER = "966533774766";
const MIN_AMOUNT = 1000;
const MAX_AMOUNT = 100000;

// State Management
let financingState = {
    fullName: '',
    mobileNumber: '',
    amount: 5000,
    duration: 4,
    interestRate: 0.05,
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
    setupEventListeners();
    calculateFinancing();
    validateForm();
    initializeCounters();
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
    
    // Set initial state from inputs
    if (elements.amountInput) {
        financingState.amount = parseInt(elements.amountInput.value) || 5000;
    }
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
            
            // Validate range
            if (value < MIN_AMOUNT) {
                value = MIN_AMOUNT;
                this.value = MIN_AMOUNT;
            } else if (value > MAX_AMOUNT) {
                value = MAX_AMOUNT;
                this.value = MAX_AMOUNT;
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
                const rate = parseFloat(this.getAttribute('data-rate'));
                
                setDuration(months, rate, this);
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

function setDuration(months, rate, button) {
    financingState.duration = months;
    financingState.interestRate = rate;
    
    // Update UI
    elements.durationButtons.forEach(btn => {
        btn.classList.remove('active');
        btn.setAttribute('aria-pressed', 'false');
    });
    
    button.classList.add('active');
    button.setAttribute('aria-pressed', 'true');
    
    // Update breakdown rate display
    if (elements.breakdownRate) {
        elements.breakdownRate.textContent = `${rate * 100}%`;
    }
    
    calculateFinancing();
}

function calculateFinancing() {
    const amount = financingState.amount;
    const duration = financingState.duration;
    const interestRate = financingState.interestRate;
    const noDownPayment = financingState.noDownPayment;
    
    // 1. Calculate Total Amount with Interest
    const interestAmount = amount * interestRate;
    const totalAmount = amount + interestAmount;
    
    // 2. Calculate Monthly Installment
    const monthlyInstallment = totalAmount / duration;
    
    // 3. Calculate Base Cash Liquidity (56%)
    const baseCashLiquidity = amount * CASH_LIQUIDITY_RATIO;
    
    // 4. Apply Down Payment Logic
    let netCash = baseCashLiquidity;
    let downpaymentStatus = "✅ الدفعة الأولى: تدفعها أنت";
    let downpaymentAmount = 0;
    
    if (noDownPayment) {
        // Deduct first installment from cash
        netCash = baseCashLiquidity - monthlyInstallment;
        downpaymentStatus = "✅ الدفعة الأولى: دفعناها لك";
        downpaymentAmount = monthlyInstallment;
    }
    
    // Ensure net cash is not negative
    netCash = Math.max(netCash, 0);
    
    // Update UI
    updateUI({
        monthlyInstallment,
        netCash,
        amount,
        interestRate,
        interestAmount,
        totalAmount,
        baseCashLiquidity,
        downpaymentStatus,
        downpaymentAmount,
        noDownPayment
    });
}

function updateUI(data) {
    // Format numbers with thousand separators
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
        elements.breakdownAmount.textContent = `${wholeFormatter.format(data.amount)} ر.س`;
    }
    
    if (elements.breakdownInterest) {
        elements.breakdownInterest.textContent = `+${wholeFormatter.format(data.interestAmount)} ر.س`;
    }
    
    if (elements.breakdownTotal) {
        elements.breakdownTotal.textContent = `${wholeFormatter.format(data.totalAmount)} ر.س`;
    }
    
    if (elements.breakdownLiquidity) {
        elements.breakdownLiquidity.textContent = `${wholeFormatter.format(data.baseCashLiquidity)} ر.س`;
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
    
    // Reset validation classes
    input.classList.remove('valid', 'invalid');
    
    if (!name) {
        showValidationMessage(input, 'الاسم الكامل مطلوب', false);
        return false;
    }
    
    // Check for at least 4 parts (typical Arabic name structure)
    const nameParts = name.split(/\s+/).filter(part => part.length > 0);
    
    if (nameParts.length < 2) {
        showValidationMessage(input, 'الرجاء إدخال الاسم الكامل (اسم واسم العائلة على الأقل)', false);
        return false;
    }
    
    // Check minimum length
    if (name.length < 6) {
        showValidationMessage(input, 'الاسم قصير جداً', false);
        return false;
    }
    
    // Check for Arabic characters
    const arabicRegex = /^[ء-ي\s]+$/;
    if (!arabicRegex.test(name)) {
        showValidationMessage(input, 'الرجاء استخدام الأحرف العربية فقط', false);
        return false;
    }
    
    showValidationMessage(input, '✅ الاسم صالح', true);
    return true;
}

function validateMobile() {
    const mobile = financingState.mobileNumber;
    const input = elements.mobileInput;
    
    if (!input) return false;
    
    // Reset validation classes
    input.classList.remove('valid', 'invalid');
    
    if (!mobile) {
        showValidationMessage(input, 'رقم الجوال مطلوب', false);
        return false;
    }
    
    // Saudi mobile number validation (05XXXXXXXX)
    const saudiMobileRegex = /^05[0-9]{8}$/;
    
    if (!saudiMobileRegex.test(mobile)) {
        showValidationMessage(input, 'رقم غير صالح. يجب أن يبدأ بـ 05 ويتكون من 10 أرقام', false);
        return false;
    }
    
    showValidationMessage(input, '✅ رقم الجوال صالح', true);
    return true;
}

function validateAmount() {
    const amount = financingState.amount;
    
    return amount >= MIN_AMOUNT && amount <= MAX_AMOUNT;
}

function validateForm() {
    const isNameValid = validateName();
    const isMobileValid = validateMobile();
    const isAmountValid = validateAmount();
    
    financingState.valid = isNameValid && isMobileValid && isAmountValid;
    
    // Update submit button state
    if (elements.whatsappSubmit) {
        if (financingState.valid) {
            elements.whatsappSubmit.disabled = false;
            elements.whatsappSubmit.setAttribute('aria-disabled', 'false');
            elements.whatsappSubmit.title = 'انقر لإرسال الطلب عبر واتساب';
        } else {
            elements.whatsappSubmit.disabled = true;
            elements.whatsappSubmit.setAttribute('aria-disabled', 'true');
            elements.whatsappSubmit.title = 'الرجاء إكمال جميع الحقول المطلوبة بشكل صحيح';
        }
    }
    
    return financingState.valid;
}

function showValidationMessage(input, message, isValid) {
    // Remove existing message
    const existingMessage = input.parentNode.querySelector('.validation-message');
    if (existingMessage) {
        existingMessage.remove();
    }
    
    // Add validation class
    input.classList.remove('valid', 'invalid');
    input.classList.add(isValid ? 'valid' : 'invalid');
    
    // Create message element
    const messageEl = document.createElement('div');
    messageEl.className = `validation-message ${isValid ? 'valid' : 'invalid'}`;
    messageEl.textContent = message;
    
    // Add icon
    const icon = document.createElement('i');
    icon.className = isValid ? 'fas fa-check-circle mr-1' : 'fas fa-exclamation-circle mr-1';
    messageEl.prepend(icon);
    
    // Insert after input
    input.parentNode.appendChild(messageEl);
}

// ============================================
// WHATSAPP INTEGRATION (Calculator)
// ============================================

function submitToWhatsApp() {
    if (!validateForm()) {
        alert('الرجاء إكمال جميع الحقول المطلوبة بشكل صحيح قبل الإرسال');
        return;
    }
    
    // Calculate final values
    const amount = financingState.amount;
    const duration = financingState.duration;
    const interestRate = financingState.interestRate;
    const totalAmount = amount + (amount * interestRate);
    const monthlyInstallment = totalAmount / duration;
    const baseCashLiquidity = amount * CASH_LIQUIDITY_RATIO;
    const netCash = financingState.noDownPayment 
        ? Math.max(baseCashLiquidity - monthlyInstallment, 0)
        : baseCashLiquidity;
    
    // Format numbers
    const formatter = new Intl.NumberFormat('ar-SA', {
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
    });
    
    // Prepare WhatsApp message
    const message = `السلام عليكم، أرغب بطلب تمويل من لير للاتصالات 📱
--------------------------------
👤 بيانات العميل:
الاسم: ${financingState.fullName}
الجوال: ${financingState.mobileNumber}
--------------------------------
💰 تفاصيل الطلب:
مبلغ السلعة: ${formatter.format(amount)} ريال
المدة: ${duration} أشهر
القسط الشهري: ${formatter.format(monthlyInstallment)} ريال
--------------------------------
💵 الحسبة النهائية:
صافي الكاش المستلم: ${formatter.format(netCash)} ريال
حالة الدفعة الأولى: ${financingState.noDownPayment ? 'دفعها لير وتم خصمها من الكاش' : 'يدفعها العميل'}
--------------------------------
✅ أقر أنا العميل بصحة البيانات والموافقة على الشروط.`;
    
    // Encode message for WhatsApp URL
    const encodedMessage = encodeURIComponent(message);
    const whatsappURL = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodedMessage}`;
    
    // Show loading state
    const originalHTML = elements.whatsappSubmit.innerHTML;
    elements.whatsappSubmit.innerHTML = '<i class="fas fa-spinner fa-spin"></i> جاري التحضير...';
    elements.whatsappSubmit.disabled = true;
    
    // Open WhatsApp after short delay for better UX
    setTimeout(() => {
        window.open(whatsappURL, '_blank');
        
        // Reset button state
        setTimeout(() => {
            elements.whatsappSubmit.innerHTML = originalHTML;
            elements.whatsappSubmit.disabled = false;
            
            // Track conversion
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
        
        // Mark as read when scrolled 75%
        window.addEventListener('scroll', function() {
            const scrollPercentage = (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100;
            
            if (scrollPercentage > 75 && !localStorage.getItem(readKey)) {
                localStorage.setItem(readKey, 'true');
                
                // Optional: Send analytics or update UI
                console.log('Article marked as read:', articleId);
            }
        });
    }
}

function calculateReadTime() {
    const articleText = document.querySelector('.article-container')?.innerText || '';
    const wordCount = articleText.split(/\s+/).length;
    const readingTime = Math.ceil(wordCount / 200); // 200 words per minute
    
    const timeElement = document.querySelector('.article-meta span:nth-child(2)');
    if (timeElement && readingTime > 0) {
        timeElement.innerHTML = `<i class="far fa-clock"></i> ⏱ ${readingTime} دقائق قراءة`;
    }
}

// ============================================
// COMMON FUNCTIONALITY
// ============================================

function initializeCommon() {
    // Accordion functionality
    initializeAccordions();
    
    // Initialize counters
    initializeCounters();
    
    // Setup scroll to section
    setupScrollToSection();
    
    // Setup device selection
    setupDeviceSelection();
    
    // Add back to top button
    addBackToTopButton();
    
    // Setup keyboard shortcuts
    setupKeyboardShortcuts();
    
    // Setup print functionality
    setupPrintStyles();
    
    // Performance monitoring
    setupPerformanceMonitoring();
}

function initializeAccordions() {
    document.querySelectorAll('.accordion-btn').forEach(button => {
        button.addEventListener('click', function() {
            const content = this.nextElementSibling;
            const icon = this.querySelector('i');
            const isExpanded = this.getAttribute('aria-expanded') === 'true';
            
            if (content.style.maxHeight) {
                content.style.maxHeight = null;
                if (icon) icon.style.transform = 'rotate(0deg)';
                this.setAttribute('aria-expanded', 'false');
            } else {
                content.style.maxHeight = content.scrollHeight + "px";
                if (icon) icon.style.transform = 'rotate(180deg)';
                this.setAttribute('aria-expanded', 'true');
            }
        });
    });
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

function setupScrollToSection() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            
            // If it's an external link, don't prevent default
            if (href.includes('http') || href === '#') {
                return;
            }
            
            e.preventDefault();
            
            const targetElement = document.querySelector(href);
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

function scrollToSection(id) {
    const element = document.getElementById(id);
    if (element) {
        element.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
    }
}

function setupDeviceSelection() {
    document.querySelectorAll('.device-btn').forEach(button => {
        button.addEventListener('click', function() {
            const deviceName = this.parentElement.querySelector('.device-name').textContent;
            selectDevice(deviceName);
        });
    });
}

// ----------------------------------------------------
// UPDATED: Device Selection now opens the Quara Modal
// ----------------------------------------------------
function selectDevice(deviceName) {
    const modal = document.getElementById('quaraModal');
    const deviceNameField = document.getElementById('selectedDeviceName');
    const hiddenDeviceField = document.getElementById('deviceName');
    
    // Set device name in modal
    if(deviceNameField) deviceNameField.textContent = deviceName;
    if(hiddenDeviceField) hiddenDeviceField.value = deviceName;
    
    // Show Modal
    if(modal) {
        modal.classList.remove('hidden');
        document.body.classList.add('overflow-hidden'); // Prevent background scrolling
    }
    
    // Focus on first input
    setTimeout(() => {
        const nameInput = document.getElementById('quaraFullName');
        if(nameInput) nameInput.focus();
    }, 300);
}

// ============================================
// NEW: Quara Finance Modal Functions
// ============================================

function closeQuaraModal() {
    const modal = document.getElementById('quaraModal');
    if(modal) {
        modal.classList.add('hidden');
        document.body.classList.remove('overflow-hidden');
    }
    // Reset form
    const form = document.getElementById('quaraForm');
    if(form) form.reset();
}

function submitQuaraForm() {
    const form = document.getElementById('quaraForm');
    
    // Validate inputs
    if (!form.checkValidity()) {
        form.reportValidity();
        return;
    }
    
    // Collect Data
    const data = {
        device: document.getElementById('deviceName').value,
        name: document.getElementById('quaraFullName').value,
        mobile: document.getElementById('quaraMobile').value,
        salary: document.getElementById('quaraSalary').value,
        sector: document.getElementById('quaraSector').value,
        city: document.getElementById('quaraCity').value,
        commitments: document.getElementById('quaraCommitments').value || 'لا يوجد'
    };
    
    // Prepare Message
    const msg = `
السلام عليكم، أرغب بتقديم طلب تمويل كوارا:
📱 الجهاز: ${data.device}
👤 الاسم: ${data.name}
📞 الجوال: ${data.mobile}
💰 الراتب: ${data.salary} ريال
🏢 الوظيفة: ${data.sector}
📍 المدينة: ${data.city}
💳 التزامات: ${data.commitments}
    `.trim();
    
    // Open WhatsApp
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`, '_blank');
    
    closeQuaraModal();
}

function addBackToTopButton() {
    const backToTopButton = document.createElement('button');
    backToTopButton.innerHTML = '<i class="fas fa-arrow-up"></i>';
    backToTopButton.className = 'back-to-top';
    backToTopButton.style.cssText = `
        position: fixed;
        bottom: 80px;
        right: 20px;
        width: 50px;
        height: 50px;
        background-color: #3AB54A;
        color: white;
        border: none;
        border-radius: 50%;
        font-size: 20px;
        cursor: pointer;
        opacity: 0;
        transition: opacity 0.3s, transform 0.3s;
        z-index: 1000;
        box-shadow: 0 4px 12px rgba(58, 181, 74, 0.3);
        display: none;
    `;

    document.body.appendChild(backToTopButton);

    backToTopButton.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    window.addEventListener('scroll', () => {
        if (window.pageYOffset > 300) {
            backToTopButton.style.display = 'flex';
            backToTopButton.style.opacity = '1';
            backToTopButton.style.transform = 'translateY(0)';
        } else {
            backToTopButton.style.opacity = '0';
            backToTopButton.style.transform = 'translateY(10px)';
            setTimeout(() => {
                backToTopButton.style.display = 'none';
            }, 300);
        }
    });
}

function setupKeyboardShortcuts() {
    document.addEventListener('keydown', function(e) {
        // Ctrl + Enter to submit form (main page only)
        if (e.ctrlKey && e.key === 'Enter' && financingState.valid && elements.whatsappSubmit) {
            submitToWhatsApp();
        }
        
        // Escape to reset form (Modified to handle Modal first)
        if (e.key === 'Escape') {
             const modal = document.getElementById('quaraModal');
             if(modal && !modal.classList.contains('hidden')) {
                 closeQuaraModal();
                 return; // Don't reset calculator form if we just closed modal
             }

            if (elements.form) {
                if (confirm('هل تريد إعادة تعيين النموذج؟')) {
                    resetForm();
                }
            }
        }
        
        // Ctrl + / to focus on amount input
        if (e.ctrlKey && e.key === '/' && elements.amountInput) {
            e.preventDefault();
            elements.amountInput.focus();
            elements.amountInput.select();
        }
    });
}

function resetForm() {
    if (elements.form) {
        elements.form.reset();
    }
    
    // Reset state
    financingState = {
        fullName: '',
        mobileNumber: '',
        amount: 5000,
        duration: 4,
        interestRate: 0.05,
        noDownPayment: false,
        valid: false
    };
    
    // Reset UI
    if (elements.amountInput) {
        elements.amountInput.value = 5000;
    }
    
    if (elements.downpaymentToggle) {
        elements.downpaymentToggle.checked = false;
    }
    
    if (elements.durationButtons) {
        elements.durationButtons.forEach(btn => {
            btn.classList.remove('active');
            btn.setAttribute('aria-pressed', 'false');
        });
        
        // Activate 4 months button
        const fourMonthBtn = document.querySelector('.duration-btn[data-months="4"]');
        if (fourMonthBtn) {
            fourMonthBtn.classList.add('active');
            fourMonthBtn.setAttribute('aria-pressed', 'true');
        }
    }
    
    // Recalculate
    calculateFinancing();
    validateForm();
}

function setupPrintStyles() {
    const printStyles = `
        @media print {
            .whatsapp-float,
            .alert-banner,
            .nav-buttons,
            .duration-btn,
            .whatsapp-cta-btn,
            .direct-whatsapp-btn,
            .toggle-switch,
            .back-to-top,
            #quaraModal {
                display: none !important;
            }
            
            body {
                background-color: white !important;
                color: black !important;
            }
            
            .calculator-card,
            .benefits-sidebar {
                border: 1px solid #ccc !important;
                box-shadow: none !important;
            }
        }
    `;
    
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
            
            if (loadTime > 3000) {
                console.warn('Page load time is high:', loadTime + 'ms');
            }
        });
    }
}

// ============================================
// ANALYTICS & TRACKING
// ============================================

function trackConversion() {
    // Track in localStorage
    const conversions = parseInt(localStorage.getItem('ler_conversions') || '0');
    localStorage.setItem('ler_conversions', (conversions + 1).toString());
    
    // Track in sessionStorage for current session
    const sessionConversions = parseInt(sessionStorage.getItem('ler_session_conversions') || '0');
    sessionStorage.setItem('ler_session_conversions', (sessionConversions + 1).toString());
    
    console.log('Conversion tracked:', {
        conversions: conversions + 1,
        sessionConversions: sessionConversions + 1,
        timestamp: new Date().toISOString()
    });
}

// ============================================
// ERROR HANDLING
// ============================================

window.addEventListener('error', function(e) {
    console.error('JavaScript Error:', e.message, 'at', e.filename, 'line', e.lineno);
});

// ============================================
// PWA SUPPORT
// ============================================

if ('serviceWorker' in navigator) {
    window.addEventListener('load', function() {
        navigator.serviceWorker.register('/sw.js')
            .then(function(registration) {
                console.log('ServiceWorker registration successful:', registration.scope);
            })
            .catch(function(err) {
                console.log('ServiceWorker registration failed:', err);
            });
    });
}

// PWA Install Prompt
let deferredPrompt;
window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPrompt = e;
    
    // You could show an install button here
    console.log('PWA install available');
});

// ============================================
// UTILITY FUNCTIONS
// ============================================

function formatCurrency(amount) {
    return new Intl.NumberFormat('ar-SA', {
        style: 'currency',
        currency: 'SAR',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
    }).format(amount);
}

function shareArticle() {
    const title = document.title;
    const url = window.location.href;
    
    if (navigator.share) {
        navigator.share({
            title: title,
            text: 'اقرأ هذا المقال عن طريقة الحصول على كاش فوري من تابي في حفر الباطن',
            url: url
        })
        .then(() => console.log('Successful share'))
        .catch((error) => console.log('Error sharing:', error));
    } else {
        // Fallback: Copy to clipboard
        navigator.clipboard.writeText(url).then(() => {
            alert('تم نسخ رابط المقال! يمكنك مشاركته الآن.');
        });
    }
}

function printArticle() {
    const printContent = document.querySelector('.article-container')?.innerHTML;
    const originalContent = document.body.innerHTML;
    
    document.body.innerHTML = `
        <div class="print-container" dir="rtl" style="padding: 20px; font-family: 'Tajawal', sans-serif;">
            ${printContent}
            <div style="margin-top: 40px; text-align: center; color: #666; font-size: 12px;">
                <p>نشرت بواسطة: مؤسسة لير للاتصالات</p>
                <p>الموقع: www.lear.sa</p>
                <p>رقم الهاتف: 053-377-4766</p>
            </div>
        </div>
    `;
    
    window.print();
    document.body.innerHTML = originalContent;
    location.reload();
}
