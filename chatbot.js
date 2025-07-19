document.addEventListener('DOMContentLoaded', () => {
    const chatbotPopup = document.getElementById('chatbot-popup');
    const mobileChatbotToggleBtn = document.getElementById('mobile-chatbot-toggle'); // زر الجوال
    const desktopChatbotToggleBtn = document.getElementById('desktop-chatbot-toggle'); // زر الديسكتوب الجديد
    const chatbotCloseBtn = document.getElementById('chatbot-close-btn');
    const chatbotInput = document.getElementById('chatbot-input');
    const chatbotSendBtn = document.getElementById('chatbot-send-btn');
    const chatbotBody = document.getElementById('chatbot-body');

    // دالة لتبديل رؤية البوت
    function toggleChatbot() {
        chatbotPopup.classList.toggle('open');
        if (chatbotPopup.classList.contains('open')) {
            chatbotInput.focus();
            scrollToBottom();
        }
    }

    // ربط حدث النقر بزر الجوال
    if (mobileChatbotToggleBtn) {
        mobileChatbotToggleBtn.addEventListener('click', (e) => {
            e.preventDefault();
            toggleChatbot();
        });
    }

    // ربط حدث النقر بزر الديسكتوب
    if (desktopChatbotToggleBtn) {
        desktopChatbotToggleBtn.addEventListener('click', (e) => {
            e.preventDefault();
            toggleChatbot();
        });
    }

    // ... (بقية الكود الخاص بإغلاق البوت وإرسال الرسائل ومنطق الردود كما هو) ...
    if (chatbotCloseBtn) {
        chatbotCloseBtn.addEventListener('click', () => {
            chatbotPopup.classList.remove('open');
        });
    }

    function sendMessage() {
        const messageText = chatbotInput.value.trim();
        if (messageText === '') return;

        const userMessageDiv = document.createElement('div');
        userMessageDiv.classList.add('user-message');
        userMessageDiv.textContent = messageText;
        chatbotBody.appendChild(userMessageDiv);

        chatbotInput.value = '';
        scrollToBottom();

        setTimeout(() => {
            const botResponse = generateBotResponse(messageText);
            const botMessageDiv = document.createElement('div');
            botMessageDiv.classList.add('bot-message');
            botMessageDiv.textContent = botResponse;
            chatbotBody.appendChild(botMessageDiv);
            scrollToBottom();
        }, 500);
    }

    if (chatbotSendBtn) {
        chatbotSendBtn.addEventListener('click', sendMessage);
    }

    if (chatbotInput) {
        chatbotInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                sendMessage();
            }
        });
    }

    function scrollToBottom() {
        chatbotBody.scrollTop = chatbotBody.scrollHeight;
    }

    function generateBotResponse(message) {
        const lowerCaseMessage = message.toLowerCase();

        // Rental Terms responses
        if (lowerCaseMessage.includes('شروط الاستئجار') || lowerCaseMessage.includes('شروط التأجير')) {
            return "تنص شروط الاستئجار على أن المستأجر يجب أن يكون حاصلاً على رخصة قيادة سارية المفعول (سعودية أو دولية معترف بها)، والحد الأدنى للعمر هو 21 عامًا. يجب تقديم بطاقة هوية سارية المفعول (هوية وطنية أو إقامة).";
        }
        if (lowerCaseMessage.includes('فترة الإيجار') || lowerCaseMessage.includes('مدة الإيجار')) {
            return "تُحسب فترة الإيجار على أساس 24 ساعة لكل يوم. يتم تحديد وقت الاستلام والإرجاع في عقد الإيجار، وقد تؤدي أي تأخير إلى رسوم إضافية.";
        }
        if (lowerCaseMessage.includes('التأمين') || lowerCaseMessage.includes('مؤمنة')) {
            return "تشمل جميع الإيجارات تأمينًا ضد الغير. يمكن للمستأجر اختيار تأمين شامل إضافي. المستأجر يتحمل مسؤولية الأضرار الناتجة عن سوء الاستخدام أو الإهمال.";
        }
        if (lowerCaseMessage.includes('الوقود') || lowerCaseMessage.includes('البنزين')) {
            return "يتم تسليم السيارة بوقود كامل، ويجب إرجاعها بوقود كامل. في حالة عدم امتلاء الخزان، سيتم احتساب رسوم إعادة تعبئة بالإضافة إلى تكلفة الوقود.";
        }
        if (lowerCaseMessage.includes('إلغاء الحجز') || lowerCaseMessage.includes('إلغاء الحجوزات')) {
            return "يمكن إلغاء الحجوزات قبل 24 ساعة من موعد الاستلام دون رسوم. الإلغاءات التي تتم في أقل من 24 ساعة قد تخضع لرسوم إلغاء.";
        }
        if (lowerCaseMessage.includes('المخالفات المرورية') || lowerCaseMessage.includes('غرامات')) {
            return "المستأجر مسؤول عن جميع المخالفات المرورية والغرامات التي تحدث خلال فترة الإيجار.";
        }

        // FAQ responses
        if (lowerCaseMessage.includes('كيف استأجر سيارة') || lowerCaseMessage.includes('تأجير سيارة')) {
            return "يمكنك تأجير سيارة من خلال تطبيق وُجْهَة أو الموقع الإلكتروني. ابحث عن السيارة المناسبة، حدد تواريخ الإيجار، ثم أكمل الحجز والدفع.";
        }
        if (lowerCaseMessage.includes('أضيف سيارتي') || lowerCaseMessage.includes('اضافة سيارة') || lowerCaseMessage.includes('أضيف سيارة')) {
            return "يمكنك التسجيل كمالك سيارة عبر الموقع أو التطبيق، ثم إضافة تفاصيل سيارتك وصورها. بعد مراجعة واعتماد سيارتك، ستصبح متاحة للتأجير.";
        }
        if (lowerCaseMessage.includes('حادث') || lowerCaseMessage.includes('حوادث')) {
            return "في حالة وقوع حادث، يجب عليك أولاً التأكد من سلامة الجميع. ثم قم بإبلاغ وُجْهَة على الفور، وسنقدم لك الدعم والإرشادات اللازمة للتعامل مع الموقف.";
        }
        if (lowerCaseMessage.includes('دليل المستخدم') || lowerCaseMessage.includes('كيف استخدم المنصة')) {
            return "يمكنك الاطلاع على دليل المستخدم الشامل للحصول على معلومات مفصلة حول كيفية استخدام منصة وُجْهَة لكل من المستأجرين والمالكين.";
        }
        if (lowerCaseMessage.includes('اتصل') || lowerCaseMessage.includes('تواصل معنا') || lowerCaseMessage.includes('رقم الهاتف')) {
            return "يمكنك التواصل معنا عبر الهاتف على الرقم +966 56 546 4718 أو عبر البريد الإلكتروني q_p@outlook.cl."; // assuming contact info is static
        }
        if (lowerCaseMessage.includes('عن وُجْهَة')) {
            return "وُجْهَة هي أول منصة سعودية متخصصة في تأجير السيارات بين الأفراد بثقة وأمان وسهولة تامة. نسعى لتحويل السيارات الواقعة إلى أصول منتجة.";
        }


        // General greetings and fallback
        if (lowerCaseMessage.includes('مرحبا') || lowerCaseMessage.includes('سلام')) {
            return "أهلاً بك! كيف يمكنني مساعدتك؟";
        }
        if (lowerCaseMessage.includes('شكرا') || lowerCaseMessage.includes('شكرًا')) {
            return "على الرحب والسعة!";
        }

        return "عذرًا، لم أفهم سؤالك. يرجى محاولة صياغة سؤالك بشكل مختلف أو زيارة صفحة الأسئلة الشائعة أو شروط الاستئجار للحصول على المزيد من المعلومات.";
    }
});
