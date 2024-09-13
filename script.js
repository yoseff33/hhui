// جلب عنصر الرابط الخاص // جلب عنصر الرابط الخاص بالطلاب
const studentsLink = document.getElementById('students-link');
const studentList = document.getElementById('student-list');

// إضافة حدث عند الضغط على رابط "الطلاب"
studentsLink.addEventListener('click', function(event) {
    // منع التصرف الافتراضي للرابط
    event.preventDefault();

    // التبديل بين إظهار وإخفاء قائمة الطلاب
    if (studentList.style.display === 'none' || studentList.style.display === '') {
        studentList.style.display = 'block';
    } else {
        studentList.style.display = 'none';
    }
});