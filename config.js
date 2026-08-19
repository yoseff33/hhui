// المفتاح anon آمن للنشر عندما تكون سياسات RLS الموجودة في supabase.sql مفعلة.
// لا تضع service_role key في المتصفح أبداً.
window.VIBES_CONFIG = Object.freeze({
  supabaseUrl: 'https://lqdgqyhagpzzeelwfcyn.supabase.co',
  // المفتاح السابق تم اختباره وكان مرفوضًا (Invalid API key).
  supabaseAnonKey: 'PUT_YOUR_ANON_OR_PUBLISHABLE_KEY_HERE'
});
