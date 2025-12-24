// ==========================================
// إعدادات الربط مع مشروع Supabase الخاص بك
// ==========================================
const PROJECT_URL = "https://mgbdukdtzckxspxmcvpo.supabase.co";
const ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1nYmR1a2R0emNreHNweG1jdnBvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjY1MzMzOTcsImV4cCI6MjA4MjEwOTM5N30.iUDPcU5AG5XCQOSHBMZKTnYrVQRAYAOCXOkOKHZqzPo";

// تهيئة الاتصال
const supabase = window.supabase.createClient(PROJECT_URL, ANON_KEY);

// ==========================================
// دالة إرسال طلب التمويل (تستخدم في زر الإرسال)
// ==========================================
async function submitOrder(customerData, orderData) {
    console.log("جاري الاتصال بقاعدة البيانات...", customerData);

    try {
        // 1. تسجيل أو تحديث بيانات العميل
        const { data: customer, error: customerError } = await supabase
            .from('customers')
            .upsert({ 
                full_name: customerData.name,
                phone: customerData.phone,
                city: customerData.city || 'غير محدد',
                total_orders: 1 // قيمة مبدئية
            }, { onConflict: 'phone' })
            .select()
            .single();

        if (customerError) {
            console.error("خطأ في تسجيل العميل:", customerError);
            throw new Error("خطأ في حفظ بيانات العميل: " + customerError.message);
        }

        // 2. تسجيل الطلب وربطه بالعميل
        const { data: order, error: orderError } = await supabase
            .from('financing_orders')
            .insert({
                customer_id: customer.id,
                installment_months: parseInt(orderData.months),
                monthly_payment: parseFloat(orderData.monthlyPayment),
                total_amount: parseFloat(orderData.totalAmount),
                status: 'pending',
                notes: 'تم الطلب عبر الموقع'
            })
            .select()
            .single();

        if (orderError) {
            console.error("خطأ في تسجيل الطلب:", orderError);
            throw new Error("خطأ في حفظ الطلب: " + orderError.message);
        }

        console.log("تمت العملية بنجاح:", order);
        return { success: true, orderId: order.id };

    } catch (error) {
        console.error("حدث خطأ عام:", error);
        return { success: false, message: error.message };
    }
}

// تجهيز الدوال للاستخدام في أي مكان بالموقع
window.supabaseClient = {
    submitOrder,
    supabase
};
