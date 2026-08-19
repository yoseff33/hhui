(() => {
    'use strict';

    // انتظار تحميل DOM بالكامل قبل تنفيذ أي كود
    document.addEventListener('DOMContentLoaded', function() {

        // قراءة الإعدادات من config.js
        const cfg = window.VIBES_CONFIG;
        if (!cfg || !cfg.supabaseUrl || !cfg.supabaseAnonKey) {
            console.error('VIBES_CONFIG غير معرف بشكل صحيح، تأكد من وجود config.js');
            return;
        }

        const db = window.supabase.createClient(cfg.supabaseUrl, cfg.supabaseAnonKey);
        const $ = s => document.querySelector(s);

        // دوال مساعدة
        const esc = (v = '') => String(v).replace(/[&<>'"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[c]));
        const money = v => `${Number(v || 0).toFixed(2)} ر.س`;
        let products = [];

        // إظهار رسالة منبثقة
        function toast(t) {
            const e = $('#toast');
            e.textContent = t;
            e.classList.add('show');
            setTimeout(() => e.classList.remove('show'), 2500);
        }

        // بدء التطبيق
        async function boot() {
            const { data: { session } } = await db.auth.getSession();
            if (!session) return showLogin();
            await enter(session.user);
        }

        function showLogin() {
            $('#loginView').classList.remove('hidden');
            $('#dashboardView').classList.add('hidden');
        }

        // دخول المستخدم مع التحقق من صلاحية الأدمن
        async function enter(user) {
            const { data: profile, error } = await db.from('profiles').select('role').eq('id', user.id).single();
            if (error || profile?.role !== 'admin') {
                await db.auth.signOut();
                $('#loginError').textContent = 'هذا الحساب لا يملك صلاحية الأدمن.';
                showLogin();
                return;
            }
            $('#loginView').classList.add('hidden');
            $('#dashboardView').classList.remove('hidden');
            $('#adminEmail').textContent = user.email;
            await Promise.all([loadProducts(), loadOrders(), loadSettings()]);
        }

        // تحميل قائمة المنتجات
        async function loadProducts() {
            const { data, error } = await db.from('products').select('*').order('sort_order').order('created_at');
            if (error) return toast(error.message);
            products = data || [];
            $('#productStat').textContent = products.length;
            $('#productsTable').innerHTML = `<table><thead><tr><th>الصورة</th><th>المنتج</th><th>السعر</th><th>التصنيف</th><th>الحالة</th><th></th></tr></thead><tbody>${products.map(p => `<tr><td>${p.image_url ? `<img src="${esc(p.image_url)}" alt="">` : '☕'}</td><td><b>${esc(p.name)}</b><div class="muted">${esc(p.description || '')}</div></td><td>${money(p.price)}</td><td>${esc(p.category)}</td><td>${p.active ? 'ظاهر' : 'مخفي'}</td><td><button class="secondary" data-edit="${p.id}">تعديل</button> <button class="danger" data-delete="${p.id}">حذف</button></td></tr>`).join('')}</tbody></table>`;
        }

        // تحميل الطلبات
        async function loadOrders() {
            const { data, error } = await db.from('orders')
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

        // تحميل إعدادات المتجر
        async function loadSettings() {
            const { data } = await db.from('store_settings').select('*').eq('id', 1).single();
            if (!data) return;
            const f = $('#settingsForm');
            ['whatsapp_number', 'store_name', 'open_hour', 'close_hour'].forEach(k => f.elements[k].value = data[k] ?? '');
            f.elements.is_open.checked = data.is_open;
        }

        // ---- الأحداث (Event Listeners) ----
        $('#loginForm').addEventListener('submit', async e => {
            e.preventDefault();
            $('#loginError').textContent = '';
            const f = new FormData(e.currentTarget);
            const { data, error } = await db.auth.signInWithPassword({ email: f.get('email'), password: f.get('password') });
            if (error) return $('#loginError').textContent = 'بيانات الدخول غير صحيحة.';
            await enter(data.user);
        });

        $('#logout').addEventListener('click', async () => {
            await db.auth.signOut();
            showLogin();
        });

        document.querySelector('.admin-tabs').addEventListener('click', e => {
            const b = e.target.closest('[data-tab]');
            if (!b) return;
            document.querySelectorAll('.pane').forEach(p => p.classList.add('hidden'));
            document.querySelectorAll('.admin-tabs button').forEach(x => x.classList.remove('active'));
            $('#' + b.dataset.tab).classList.remove('hidden');
            b.classList.add('active');
        });

        $('#newProduct').addEventListener('click', () => {
            $('#productForm').reset();
            $('#productForm').elements.active.checked = true;
            $('#editorTitle').textContent = 'منتج جديد';
            $('#productEditor').showModal();
        });

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
                $('#editorTitle').textContent = 'تعديل المنتج';
                $('#productEditor').showModal();
            }
            if (del && confirm('حذف المنتج نهائيًا؟')) {
                const { error } = await db.from('products').delete().eq('id', del.dataset.delete);
                error ? toast(error.message) : (toast('تم الحذف'), loadProducts());
            }
        });

        $('#productForm').addEventListener('submit', async e => {
            e.preventDefault();
            const f = e.currentTarget;
            const fd = new FormData(f);
            const id = fd.get('id');
            const row = {
                name: fd.get('name').trim(),
                description: fd.get('description').trim() || null,
                price: Number(fd.get('price')),
                category: fd.get('category'),
                image_url: fd.get('image_url').trim() || null,
                popular: f.elements.popular.checked,
                active: f.elements.active.checked
            };
            const q = id ? db.from('products').update(row).eq('id', id) : db.from('products').insert(row);
            const { error } = await q;
            if (error) return toast(error.message);
            $('#productEditor').close();
            toast('تم حفظ المنتج');
            loadProducts();
        });

        $('#ordersTable').addEventListener('change', async e => {
            if (!e.target.matches('[data-order]')) return;
            const { error } = await db.from('orders').update({ status: e.target.value }).eq('id', e.target.dataset.order);
            error ? toast(error.message) : toast('تم تحديث الطلب');
        });

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
            const { error } = await db.from('store_settings').upsert(row);
            error ? toast(error.message) : toast('تم حفظ الإعدادات');
        });

        $('#refreshOrders').addEventListener('click', loadOrders);

        document.addEventListener('click', e => {
            const b = e.target.closest('[data-close]');
            if (b) document.getElementById(b.dataset.close).close();
        });

        // تشغيل التطبيق
        boot();
    });
})();
