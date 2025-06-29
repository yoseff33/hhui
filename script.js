function analyzeSituation() {
    const input = document.getElementById("situationInput").value.trim().toLowerCase();
    const resultDiv = document.getElementById("analysisResult");
    const resultSection = document.getElementById("resultSection");

    if (!input) {
        alert("من فضلك أدخل وصفًا للموقف.");
        return;
    }

    let response = {};

    // محاكاة نظام الذكاء الاصطناعي
    if (input.includes("خصم") || input.includes("تخفيض")) {
        response = {
            title: "اقتراح قرار",
            decision: "منح خصم جزئي (20%) مع شرط زيادة الكمية أو تكرار الشراء.",
            options: [
                "منح الخصم الكامل (40%)",
                "رفض الخصم وشرح الأسباب",
                "تقديم منتج مجاني بدل الخصم"
            ],
            prosCons: [
                { option: "منح الخصم الكامل", pros: ["زيادة المبيعات الفورية"], cons: ["انخفاض الربحية"] },
                { option: "رفض الخصم", pros: ["الحفاظ على هامش الربح"], cons: ["احتمال فقدان العميل"] },
                { option: "منتج مجاني", pros: ["تعزيز العلاقة مع العميل"], cons: ["تكلفة الشحن والتصنيع"] }
            ],
            recommendation: "الخيار الأول: منح خصم 20% مع شرط زيادة الكمية، لأن هذا يوازن بين الحفاظ على الربح ورضاء العميل."
        };
    } else if (input.includes("فصل") || input.includes("تأخير")) {
        response = {
            title: "اقتراح قرار",
            decision: "إجراء مقابلة مع الموظف لفهم أسباب التأخير قبل اتخاذ قرار نهائي.",
            options: [
                "فصل الموظف فورًا",
                "إعطاء إنذار كتابي",
                "تحويله إلى تدريب داخلي"
            ],
            prosCons: [
                { option: "فصل الموظف", pros: ["عدم تكرار المشكلة"], cons: ["فقدان خبرة"] },
                { option: "إنذار كتابي", pros: ["فرصة للتحسين"], cons: ["قد لا يؤثر بشكل كافٍ"] },
                { option: "تدريب داخلي", pros: ["تطوير الموظف"], cons: ["استمرار التأخير المحتمل"] }
            ],
            recommendation: "الخيار الثاني: إعطاء إنذار كتابي مع تحديد موعد لتقييم الأداء بعد شهر."
        };
    } else {
        response = {
            title: "اقتراح عام",
            decision: "تحليل الموقف يحتاج إلى تفاصيل أكثر، لكن إليك بعض الخيارات العامة:",
            options: ["التواصل المباشر", "مراجعة السياسات الداخلية", "الاستعانة بفريق إدارة"],
            prosCons: [],
            recommendation: "نوصي بالتواصل المباشر مع الطرف المتسبب في المشكلة لفهم الجذور الحقيقية."
        };
    }

    let html = `<h3>${response.title}</h3>`;
    html += `<p><strong>التحليل:</strong> ${response.decision}</p>`;
    html += `<h4>خيارات متاحة:</h4><ul>`;
    response.options.forEach(opt => {
        html += `<li>${opt}</li>`;
    });
    html += `</ul>`;

    if (response.prosCons.length > 0) {
        html += `<h4>مقارنة الإيجابيات والسلبيات:</h4>`;
        response.prosCons.forEach(item => {
            html += `<p><strong>${item.option}:</strong><br>`;
            html += `إيجابيات: ${item.pros.join(', ')}<br>`;
            html += `سلبيات: ${item.cons.join(', ')}</p>`;
        });
    }

    html += `<h4>التوصية الذكية:</h4>`;
    html += `<p style="color:#007BFF;"><strong>✅ ${response.recommendation}</strong></p>`;

    resultDiv.innerHTML = html;
    resultSection.style.display = "block";
}