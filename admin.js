(() => {
    'use strict';

    document.addEventListener('DOMContentLoaded', function() {

        const cfg = window.VIBES_CONFIG;
        if (!cfg || !cfg.supabaseUrl || !cfg.supabaseAnonKey) {
            console.error('VIBES_CONFIG غير معرف');
            return;
        }

        const supabase = window.supabase.createClient(cfg.supabaseUrl, cfg.supabaseAnonKey);
        const $ = s => document.querySelector(s);
        const $$ = s => document.querySelectorAll(s);

        // دوال مساعدة
        const esc = (v = '') => String(v).replace(/[&<>'"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[c]));
        const money = v => `${Number(v || 0).toFixed(2)} ر.س`;

        let products = [];
        let currentUserRole = '';
        let selectedFile = null;

        // Toast
        function toast(t) {
            const e = $('#toast');
            e.textContent = t;
            e.classList.add('show');
            setTimeout(() => e.classList.remove('show'), 3000);
        }

        // ---- المصادقة ----
        async function boot() {
            const { data: { session } } = await supabase.auth.getSession();
            if (!session) return showLogin();
            await enter(session.user);
        }

        function showLogin() {
            $('#loginView').classList.remove('hidden');
            $('#dashboardView').classList.add('hidden');
        }

        async function enter(user) {
            // جلب صلاحية المستخدم من جدول profiles
            const { data: profile, error } = await supabase.from('profiles').select('role').eq('id', user.id).single();
            if (error || !profile) {
                await supabase.auth.signOut();
                $('#loginError').textContent = 'حسابك غير مسجل في النظام.';
                showLogin();
                return;
            }
            currentUserRole = profile.role;
            if (currentUserRole !== 'admin' && currentUserRole !== 'manager') {
                await supabase.auth.signOut();
                $('#loginError').textContent = 'ليس لديك صلاحية للدخول.';
                showLogin();
                return;
            }

            $('#loginView').classList.add('hidden');
            $('#dashboardView').classList.remove('hidden');
            $('#adminEmail').textContent = user.email;
            $('#adminRole').textContent = `الصلاحية: ${currentUserRole === 'admin' ? 'أدمن كامل' : 'مشرف'}`;

            // إخفاء تبويب المستخدمين إذا كان مشرف
            if (currentUserRole !== 'admin') {
                $('#usersTab').style.display = 'none';
            }

            await Promise.all([loadProducts(), loadOrders(), loadSettings()]);
            if (currentUserRole === 'admin') loadUsers();
        }

        // ---- تحميل المنتجات ----
        async function loadProducts() {
            const { data, error } = await supabase.from('products').select('*').order('sort_order').order('created_at');
            if (error) return toast(error.message);
            products = data || [];
            $('#productStat').textContent = products.length;
            $('#productsTable').innerHTML = `<table><thead><tr><th>الصورة</th><th>المنتج</th><th>السعر</th><th>التصنيف</th><th>الحالة</th><th></th></tr></thead><tbody>${products.map(p => `<tr><td>${p.image_url ? `<img src="${esc(p.image_url)}" alt="">` : '☕'}</td><td><b>${esc(p.name)}</b><div class="muted">${esc(p.description || '')}</div></td><td>${money(p.price)}</td><td>${esc(p.category)}</td><td>${p.active ? 'ظاهر' : 'مخفي'}</td><td><button class="secondary" data-edit="${p.id}">تعديل</button> <button class="danger" data-delete="${p.id}">حذف</button></td></tr>`).join('')}</tbody></table>`;
        }

        // ---- تحميل الطلبات ----
        async function loadOrders() {
            const { data, error } = await supabase.from('orders')
                .select('id,order_number,customer_name,customer_phone,notes,total,status,created_at,order_items(quantity,unit_price,product_name)')
                .order('created_at', { ascending: false })
                .limit(100);
            if (error) return toast(error.message);
            const orders = data || [];
            const today = new Date().toDateString();
            const todays = orders.filter(o => new Date(o.created_at).toDateString() === today);
            $('#orderStat').textContent = todays.length;
            $('#salesStat').textContent = money(todays.reduce((n, o) => n + Number(o.total), 0));
            $('#ordersTable').innerHTML = `<table><thead><tr><th>الطلب</th><th>العميل</th><th>التفاصيل</th><th>الإجمالي</th><th>الحالة</th><th>الوقت</th></tr></thead><tbody>${orders.map(o => `<tr><td>#${o.order_number}</td><td>${esc(o.customer_name)}<div class="muted">${esc(o.customer_phone)}</div></td><td class="order-items">${(o.order_items || []).map(i => `${esc(i.product_name)} × ${i.quantity}`).join('<br>')}${o.notes ? `<br>ملاحظة: ${esc(o.notes)}` : ''}</td><td>${money(o.total)}</td><td><select class="status-select" data-order="${o.id}">${[['new','جديد'],['accepted','مقبول'],['preparing','قيد التحضير'],['ready','جاهز'],['completed','مكتمل'],['cancelled','ملغي']].map(([v,l]) => `<option value="${v}" ${o.status === v ? 'selected' : ''}>${l}</option>`).join('')}</select></td><td>${new Date(o.created_at).toLocaleString('ar-SA')}</td></tr>`).join('')}</tbody></table>`;
        }

        // ---- تحميل الإعدادات ----
        async function loadSettings() {
            const { data } = await supabase.from('store_settings').select('*').eq('id', 1).single();
            if (!data) return;
            const f = $('#settingsForm');
            ['whatsapp_number', 'store_name', 'open_hour', 'close_hour'].forEach(k => f.elements[k].value = data[k] ?? '');
            f.elements.is_open.checked = data.is_open;
        }

        // ---- تحميل المستخدمين (للأدمن فقط) ----
        async function loadUsers() {
            if (currentUserRole !== 'admin') return;
            const { data, error } = await supabase.from('profiles').select('id, email, role, full_name').order('created_at');
            if (error) return toast(error.message);
            const users = data || [];
            $('#usersTable').innerHTML = `<table><thead><tr><th>البريد</th><th>الاسم</th><th>الصلاحية</th><th>تغيير الصلاحية</th></tr></thead><tbody>${users.map(u => `<tr><td>${esc(u.email)}</td><td>${esc(u.full_name || '')}</td><td>${u.role === 'admin' ? 'أدمن' : u.role === 'manager' ? 'مشرف' : 'عميل'}</td><td><select class="user-role-select" data-user="${u.id}"><option value="customer" ${u.role === 'customer' ? 'selected' : ''}>عميل</option><option value="manager" ${u.role === 'manager' ? 'selected' : ''}>مشرف</option><option value="admin" ${u.role === 'admin' ? 'selected' : ''}>أدمن</option></select></td></tr>`).join('')}</tbody></table>`;
        }

        // ---- رفع الصورة إلى Storage ----
        async function uploadImage(file) {
            const fileExt = file.name.split('.').pop();
            const fileName = `${Date.now()}.${fileExt}`;
            const filePath = `${fileName}`;
            const { data, error } = await supabase.storage
                .from(cfg.storageBucket)
                .upload(filePath, file, { cacheControl: '3600', upsert: false });
            if (error) {
                toast('فشل رفع الصورة: ' + error.message);
                return null;
            }
            // الحصول على الرابط العام
            const { data: urlData } = supabase.storage.from(cfg.storageBucket).getPublicUrl(filePath);
            return urlData.publicUrl;
        }

        // ---- حذف صورة من Storage ----
        async function deleteImage(imageUrl) {
            if (!imageUrl) return;
            const fileName = imageUrl.split('/').pop();
            if (!fileName) return;
            const { error } = await supabase.storage.from(cfg.storageBucket).remove([fileName]);
            if (error) console.warn('فشل حذف الصورة:', error.message);
        }

        // ---- أحداث (Event Listeners) ----

        // تسجيل الدخول
        $('#loginForm').addEventListener('submit', async e => {
            e.preventDefault();
            $('#loginError').textContent = '';
            const f = new FormData(e.currentTarget);
            const { data, error } = await supabase.auth.signInWithPassword({ email: f.get('email'), password: f.get('password') });
            if (error) return $('#loginError').textContent = 'بيانات الدخول غير صحيحة.';
            await enter(data.user);
        });

        // خروج
        $('#logout').addEventListener('click', async () => {
            await supabase.auth.signOut();
            showLogin();
        });

        // تبديل التبويبات
        document.querySelector('.admin-tabs').addEventListener('click', e => {
            const b = e.target.closest('[data-tab]');
            if (!b) return;
            $$('.pane').forEach(p => p.classList.add('hidden'));
            $$('.admin-tabs button').forEach(x => x.classList.remove('active'));
            $('#' + b.dataset.tab).classList.remove('hidden');
            b.classList.add('active');
            // تحديث المستخدمين إذا كان التبويب نشطاً
            if (b.dataset.tab === 'usersPane' && currentUserRole === 'admin') loadUsers();
        });

        // فتح محرر المنتج
        $('#newProduct').addEventListener('click', () => {
            $('#productForm').reset();
            $('#productForm').elements.active.checked = true;
            $('#editorTitle').textContent = 'منتج جديد';
            $('#imagePreview').style.display = 'none';
            $('#imagePreview').src = '';
            $('#imageUrlInput').value = '';
            selectedFile = null;
            $('#productEditor').showModal();
        });

        // تحميل الصورة عند اختيار ملف
        $('#productImage').addEventListener('change', function(e) {
            const file = e.target.files[0];
            if (!file) return;
            selectedFile = file;
            const reader = new FileReader();
            reader.onload = function(ev) {
                const img = $('#imagePreview');
                img.src = ev.target.result;
                img.style.display = 'block';
            };
            reader.readAsDataURL(file);
        });

        // تعديل/حذف المنتج
        $('#productsTable').addEventListener('click', async e => {
            const edit = e.target.closest('[data-edit]');
            const del = e.target.closest('[data-delete]');
            if (edit) {
                const p = products.find(x => x.id === edit.dataset.edit);
                if (!p) return toast('المنتج غير موجود');
                const f = $('#productForm');
                Object.keys(p).forEach(k => {
                    if (f.elements[k]) {
                        if (f.elements[k].type === 'checkbox') {
                            f.elements[k].checked = !!p[k];
                        } else {
                            f.elements[k].value = p[k] ?? '';
                        }
                    }
                });
                // عرض الصورة الحالية
                if (p.image_url) {
                    $('#imagePreview').src = p.image_url;
                    $('#imagePreview').style.display = 'block';
                    $('#imageUrlInput').value = p.image_url;
                } else {
                    $('#imagePreview').style.display = 'none';
                    $('#imagePreview').src = '';
                    $('#imageUrlInput').value = '';
                }
                selectedFile = null;
                $('#editorTitle').textContent = 'تعديل المنتج';
                $('#productEditor').showModal();
            }
            if (del && confirm('حذف المنتج نهائيًا؟')) {
                const p = products.find(x => x.id === del.dataset.delete);
                if (p && p.image_url) {
                    await deleteImage(p.image_url);
                }
                const { error } = await supabase.from('products').delete().eq('id', del.dataset.delete);
                error ? toast(error.message) : (toast('تم الحذف'), loadProducts());
            }
        });

        // حفظ المنتج (إضافة أو تعديل)
        $('#productForm').addEventListener('submit', async e => {
            e.preventDefault();
            const f = e.currentTarget;
            const fd = new FormData(f);
            const id = fd.get('id');

            // رفع الصورة إذا تم اختيار ملف جديد
            let imageUrl = $('#imageUrlInput').value || null;
            if (selectedFile) {
                const uploadedUrl = await uploadImage(selectedFile);
                if (uploadedUrl) {
                    // حذف الصورة القديمة إذا وجدت
                    if (id && imageUrl) {
                        await deleteImage(imageUrl);
                    }
                    imageUrl = uploadedUrl;
                }
            }

            const row = {
                name: fd.get('name').trim(),
                description: fd.get('description').trim() || null,
                price: Number(fd.get('price')),
                category: fd.get('category'),
                image_url: imageUrl,
                popular: f.elements.popular.checked,
                active: f.elements.active.checked
            };

            const q = id ? supabase.from('products').update(row).eq('id', id) : supabase.from('products').insert(row);
            const { error } = await q;
            if (error) return toast(error.message);
            $('#productEditor').close();
            toast('تم حفظ المنتج');
            loadProducts();
        });

        // تحديث حالة الطلب
        $('#ordersTable').addEventListener('change', async e => {
            if (!e.target.matches('[data-order]')) return;
            const { error } = await supabase.from('orders').update({ status: e.target.value }).eq('id', e.target.dataset.order);
            error ? toast(error.message) : toast('تم تحديث الطلب');
        });

        // حفظ الإعدادات
        $('#settingsForm').addEventListener('submit', async e => {
            e.preventDefault();
            const f = e.currentTarget;
            const fd = new FormData(f);
            const row = {
                id: 1,
                whatsapp_number: fd.get('whatsapp_number'),
                store_name: fd.get('store_name'),
                open_hour: Number(fd.get('open_hour')),
                close_hour: Number(fd.get('close_hour')),
                is_open: f.elements.is_open.checked
            };
            const { error } = await supabase.from('store_settings').upsert(row);
            error ? toast(error.message) : toast('تم حفظ الإعدادات');
        });

        // تغيير صلاحية المستخدم (للأدمن فقط)
        $('#usersTable').addEventListener('change', async e => {
            if (!e.target.matches('.user-role-select')) return;
            if (currentUserRole !== 'admin') return toast('لا تملك صلاحية');
            const userId = e.target.dataset.user;
            const newRole = e.target.value;
            const { error } = await supabase.from('profiles').update({ role: newRole }).eq('id', userId);
            error ? toast(error.message) : toast('تم تحديث الصلاحية');
        });

        // تحديث المستخدمين
        $('#refreshUsers').addEventListener('click', () => loadUsers());
        $('#refreshOrders').addEventListener('click', loadOrders);

        // إغلاق المودال
        document.addEventListener('click', e => {
            const b = e.target.closest('[data-close]');
            if (b) document.getElementById(b.dataset.close).close();
        });

        // بدء التطبيق
        boot();
    });
})();
