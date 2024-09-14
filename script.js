/* إعداد عام للجسم */
body {
    font-family: 'Cairo', sans-serif;
    margin: 0;
    padding: 0;
    box-sizing: border-box;
    background-color: white; /* خلفية الموقع باللون الأبيض */
    color: black; /* النصوص باللون الأسود */
    min-height: 100vh; /* لضمان امتداد الجسم لكامل ارتفاع الشاشة */
    display: flex;
    flex-direction: column;
}

/* تنسيق الهيدر */
header {
    background-color: #4B2E2C; /* لون بني غامق */
    padding: 1rem;
    text-align: center;
    position: relative;
    color: white; /* النصوص باللون الأبيض */
}

header h1 {
    margin: 0;
    font-size: 2.5rem;
}

.menu-btn {
    position: absolute;
    top: 1rem;
    right: 1rem;
    font-size: 2rem;
    background-color: transparent;
    border: none;
    color: white;
    cursor: pointer;
    z-index: 1000; /* لضمان ظهور الزر فوق العناصر الأخرى */
}

/* تنسيق القائمة */
nav {
    background-color: #4B2E2C; /* لون بني غامق */
    text-align: center;
    padding: 1rem 0;
    position: absolute;
    top: 3.5rem;
    right: 0;
    width: 100%; /* جعل القائمة تمتد بعرض الشاشة */
    z-index: 999; /* لضمان ظهور القائمة فوق المحتويات الأخرى */
    display: none; /* إخفاء القائمة افتراضيًا */
}

nav ul {
    list-style: none;
    padding: 0;
    margin: 0;
}

nav ul li {
    margin: 1rem 0;
}

nav ul li a {
    color: white;
    text-decoration: none;
    font-size: 1.5rem;
}

/* تنسيق قسم أعضاء هيئة التدريس */
.faculty-slider {
    padding: 2rem;
    text-align: center;
    flex: 1; /* للسماح للقسم بالتمدد */
}

.slider-container {
    display: flex;
    justify-content: center;
    flex-wrap: wrap;
}

.doctor-circle {
    margin: 1.5rem;
    text-align: center;
    position: relative;
    cursor: pointer; /* تغيير المؤشر عند المرور فوق الدائرة */
}

.doctor-circle img {
    width: 100%;
    max-width: 300px; /* تكبير حجم دائرة الدكتور */
    border-radius: 50%;
    border: 5px solid white; /* إضافة حدود بيضاء حول الصورة */
}

.doctor-name {
    margin-top: 0.5rem;
    font-size: 1.25rem;
    color: black; /* لون النصوص بالأسود */
}

.circle-menu {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%) scale(0);
    width: 120px; /* تصغير حجم الدائرة المخفية لتتناسب مع دائرة الدكتور */
    height: 120px; /* تصغير حجم الدائرة المخفية لتتناسب مع دائرة الدكتور */
    border-radius: 50%;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: rgba(255, 255, 255, 0.8); /* لون خلفية أبيض شفاف */
    flex-wrap: wrap;
    gap: 0.5rem; /* تباعد مناسب بين الرموز */
    visibility: hidden; /* إخفاء الدائرة المخفية افتراضيًا */
    transition: visibility 0.3s, transform 0.3s;
    padding: 0.5rem; /* إضافة تباعد داخلي */
}

.menu-item {
    width: 35px; /* تصغير حجم الرموز */
    height: 35px; /* تصغير حجم الرموز */
    background-color: #4B2E2C; /* بني غامق */
    border-radius: 50%;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 1.2rem; /* تصغير حجم الرموز */
    color: white; /* لون الرموز أبيض */
    transition: transform 0.3s;
}

.menu-item:hover {
    transform: scale(1.2);
    background-color: white; /* تغيير اللون عند التمرير */
    color: #4B2E2C; /* لون الرموز عند التمرير */
}

/* تنسيق الفوتر */
footer {
    background-color: #4B2E2C; /* لون بني غامق */
    text-align: center;
    padding: 1rem;
    color: white; /* النص الأبيض */
    margin-top: auto; /* لضمان ظهور التذييل في الأسفل */
}