إليك كود JavaScript بالكامل لضمان عمل الزر الخاص بالقائمة المنسدلة في جميع الصفحات:

### **script.js**

```javascript
document.addEventListener('DOMContentLoaded', () => {
    // اختار الزر الذي يفتح ويغلق القائمة
    const menuToggle = document.querySelector('.menu-toggle');
    // اختار القائمة التي ستظهر وتختفي
    const navMenu = document.querySelector('nav ul');

    // تحقق من وجود العناصر قبل إضافة الحدث
    if (menuToggle && navMenu) {
        // أضف حدث النقر للزر
        menuToggle.addEventListener('click', () => {
            // تبديل الفئة 'active' لعرض أو إخفاء القائمة
            navMenu.classList.toggle('active');
        });
    }
});
```

### **توضيح الكود:**

1. **`document.addEventListener('DOMContentLoaded', () => {...});`**: يضمن تنفيذ الشيفرة بعد تحميل كامل محتوى الصفحة.
2. **`const menuToggle = document.querySelector('.menu-toggle');`**: يختار الزر الذي يتحكم في القائمة.
3. **`const navMenu = document.querySelector('nav ul');`**: يختار القائمة المنسدلة.
4. **`menuToggle.addEventListener('click', () => {...});`**: يضيف مستمعًا للنقر على الزر، والذي بدوره يبدل الفئة `active` على القائمة لتظهر أو تختفي بناءً على حالتها الحالية.

### **تأكد من:**

- **تضمين `script.js` في جميع صفحات HTML:**
  ```html
  <script src="script.js"></script>
  ```

- **تأكد من تطابق الكلاسات في HTML مع ما هو مستخدم في JavaScript.**

إذا قمت بتطبيق هذا الكود بشكل صحيح، يجب أن يعمل الزر والقائمة المنسدلة كما هو متوقع في جميع صفحاتك.