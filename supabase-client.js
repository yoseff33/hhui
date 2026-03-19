// ==========================================
// ملف: supabase-client.js
// الوصف: الربط مع قاعدة البيانات وإرسال الطلبات
// ==========================================

// 1. إعدادات المشروع (مفاتيح الربط)
const MY_PROJECT_URL = "https://mgbdukdtzckxspxmcvpo.supabase.co"
const MY_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1nYmR1a2R0emNreHNweG1jdnBvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjY1MzMzOTcsImV4cCI6MjA4MjEwOTM5N30.iUDPcU5AG5XCQOSHBMZKTnYrVQRAYAOCXOkOKHZqzPo"

// 2. تهيئة الاتصال
// ملاحظة: سمينا المتغير dbClient عشان ما يتعارض مع اسم المكتبة الأصلي
const dbClient = window.supabase.createClient(MY_PROJECT_URL, MY_ANON_KEY);

// 3. دالة إرسال طلب التمويل (الرئيسية)
async function submitOrder(customerData, orderData) {
    console.log("🚀 بدء عملية إرسال الطلب...", customerData);

    try {
        // أ) خطوة تسجيل أو تحديث بيانات العميل
        // نستخدم upsert عشان لو الرقم موجود يحدث البيانات، ولو جديد يضيفه
        const { data: customer, error: customerError } = await dbClient
            .from('customers')
            .upsert({ 
                full_name: customerData.name,
                phone: customerData.phone,
                city: customerData.city || 'غير محدد',
                total_orders: 1 // يمكن تحديث هذا الرقم لاحقاً بمجرد قبول الطلب
            }, { onConflict: 'phone' })
            .select()
            .single();

        if (customerError) {
            console.error("❌ خطأ في بيانات العميل:", customerError);
            throw new Error("فشل في تسجيل بيانات العميل: " + customerError.message);
        }

        console.log("✅ تم تحديد العميل:", customer.id);

        // ب) خطوة تسجيل الطلب وربطه بالعميل
        const { data: order, error: orderError } = await dbClient
            .from('financing_orders')
            .insert({
                customer_id: customer.id,
                installment_months: parseInt(orderData.months),
                monthly_payment: parseFloat(orderData.monthlyPayment),
                total_amount: parseFloat(orderData.totalAmount),
                status: 'pending', // الحالة المبدئية: قيد الانتظار
                notes: 'تم الطلب عبر الموقع الإلكتروني',
                created_at: new Date().toISOString()
            })
            .select()
            .single();

        if (orderError) {
            console.error("❌ خطأ في إنشاء الطلب:", orderError);
            throw new Error("فشل في حفظ الطلب: " + orderError.message);
        }

        console.log("🎉 تم حفظ الطلب بنجاح برقم:", order.id);
        
        // إرجاع النتيجة للموقع عشان يكمل عملية الواتساب
        return { 
            success: true, 
            orderId: order.id,
            customerId: customer.id
        };

    } catch (error) {
        console.error("❌ حدث خطأ غير متوقع:", error);
        return { 
            success: false, 
            message: error.message 
        };
    }
}

// 4. تصدير الدوال للاستخدام في الملفات الأخرى
window.supabaseClient = {
    submitOrder,
    supabase: dbClient // بنحتاجه لو بغينا نستخدمه مباشرة مستقبلاً
};
