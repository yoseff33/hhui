// csr-content.js

// بيانات مُولّدة بواسطة الذكاء الاصطناعي التوليدي (AI-Generated Facts & Statistics)
const csrFacts = [
    { id: 1, text: "تأجير السيارات التشاركي يقلل الحاجة لامتلاك سيارة ثانية بنسبة تصل إلى 25% في المناطق الحضرية، مما يقلل الازدحام." },
    { id: 2, text: "القيادة الهادئة والسلسة (الابتعاد عن التسارع والفرملة المفاجئة) يمكن أن توفر ما يصل إلى 15% من استهلاك الوقود." },
    { id: 3, text: "كل كيلومتر تقطعه بسيارة اقتصادية يساهم في تقليل انبعاثات ثاني أكسيد الكربون مقارنة بالسيارات الكبيرة ذات الاستهلاك العالي." },
    { id: 4, text: "المشاركة في تأجير السيارات تدعم الاقتصاد المحلي من خلال توفير فرص دخل إضافية للمالكين." },
    { id: 5, text: "فحص ضغط الإطارات بانتظام لا يحسن فقط كفاءة الوقود بنسبة 3%، بل يقلل أيضًا من خطر الحوادث بشكل كبير." },
    { id: 6, text: "السيارات الهجينة والكهربائية المتوفرة على وُجْهَة تساهم في تقليل التلوث الهوائي وتجعل مدينتنا أنظف." },
    { id: 7, text: "بفضل ثقة مجتمعنا، تم توفير ما يقدر بـ 1000 ساعة من وقت الانتظار على الطرقات العام الماضي." },
    { id: 8, text: "اختيارك لسيارة قريبة منك يقلل من المسافة المقطوعة لاستلامها، مما يقلل من بصمتك الكربونية." },
    { id: 9, text: "دعم وُجْهَة يعني دعم الاقتصاد التشاركي، الذي يعزز الاستخدام الأمثل للموارد." },
    { id: 10, text: "الحفاظ على نظافة السيارة المؤجرة يعكس الاحترام المتبادل بين أفراد المجتمع." }
    // يمكنك إضافة المزيد من الحقائق هنا باستخدام الذكاء الاصامعي التوليدي
];

// نصائح وإرشادات للقيادة الآمنة والمسؤولية الاجتماعية (AI-Generated Tips)
const csrTips = [
    { id: 1, title: "فحص الإطارات:", text: "تأكد من أن ضغط الإطارات صحيح قبل كل رحلة لضمان السلامة وكفاءة استهلاك الوقود." },
    { id: 2, title: "القيادة اللطيفة:", text: "تجنب التسارع والفرملة المفاجئة. القيادة السلسة أكثر أمانًا وتوفر الوقود." },
    { id: 3, title: "الصيانة الدورية:", text: "المؤجرون، احرصوا على صيانة سياراتكم بانتظام لضمان أدائها البيئي الأمثل وسلامة المستأجرين." },
    { id: 4, title: "التخطيط المسبق:", text: "خطط لرحلاتك لتجنب الازدحام وتقليل وقت القيادة، مما يوفر الوقود ويقلل الانبعاثات." },
    { id: 5, title: "نظافة السيارة:", text: "المستأجرون، اتركوا السيارة نظيفة كما وجدتموها. هذا يعكس الاحترام ويشجع على استمرار خدمة التأجير التشاركي." },
    // يمكنك إضافة المزيد من النصائح هنا باستخدام الذكاء الاصناعي التوليدي
];

// خيارات تعهد القيادة المسؤولة (AI-Generated Pledge Options & Thank You Messages)
const pledgeOptions = [
    {
        id: 'clean-car',
        text: "أتعهد بالحفاظ على نظافة السيارة المؤجرة وإعادتها بحالة ممتازة.",
        thankYou: "شكرًا لك يا [اسم_المستخدم] على تعهدك بالحفاظ على نظافة السيارة. مساهمتك تعزز ثقافة الاحترام المتبادل في وُجْهَة!"
    },
    {
        id: 'safe-drive',
        text: "أتعهد بالقيادة بمسؤولية، واحترام قوانين المرور، والتحلي بالهدوء على الطريق.",
        thankYou: "قيادتك المسؤولة يا [اسم_المستخدم] تجعل طرقنا أكثر أمانًا للجميع. شكرًا لالتزامك بسلامة المجتمع!"
    },
    {
        id: 'eco-friendly',
        text: "أتعهد باختيار السيارات الصديقة للبيئة قدر الإمكان والقيادة بكفاءة لتقليل البصمة الكربونية.",
        thankYou: "باختيارك المستدام يا [اسم_المستخدم]، أنت تساهم بفعالية في مستقبل بيئي أفضل. شكرًا لكونك جزءًا من الحل!"
    },
    {
        id: 'community-support',
        text: "أتعهد بدعم مجتمع وُجْهَة من خلال التعامل بإيجابية وتقديم الملاحظات البناءة لتحسين الخدمة.",
        thankYou: "دعمك وتفاعلك يا [اسم_المستخدم] يبني مجتمعًا أقوى وأكثر ترابطًا في وُجْهَة. شكرًا لمساهمتك القيمة!"
    }
    // يمكنك إضافة المزيد من التعهدات ورسائل الشكر هنا باستخدام الذكاء الاصناعي التوليدي
];

// إحصائيات الأثر الاجتماعي التقديرية (AI-Generated Impact Stats & Stories)
const impactStats = [
    { label: "رحلات مكتملة", value: 15000, unit: "+", story: "كل رحلة مكتملة تعزز الاقتصاد المحلي وتوفر خيارات نقل مرنة لسكان جامعة القصيم." },
    { label: "دخل إضافي للمؤجرين", value: 500, unit: " ألف+ ر.س", story: "منصتنا ساعدت المؤجرين على تحقيق دخل إضافي كبير، مما يدعم أسرهم والمجتمع." },
    { label: "سيارات تم استغلالها", value: 300, unit: "+", story: "تم تحويل مئات السيارات غير المستغلة إلى أصول منتجة تخدم المجتمع الجامعي." },
    { label: "توفير البصمة الكربونية", value: 80, unit: " طن+", story: "باختيار المستخدمين للسيارات الاقتصادية والهجينة، تم توفير كمية كبيرة من انبعاثات الكربون." },
    { label: "مستخدمين استفادوا", value: 10000, unit: "+", story: "نخدم آلاف الطلاب والموظفين في جامعة القصيم، موفرين لهم حلول نقل مريحة واقتصادية." }
    // يمكنك إضافة المزيد من الإحصائيات والقصص هنا باستخدام الذكاء الاصناعي التوليدي
];
